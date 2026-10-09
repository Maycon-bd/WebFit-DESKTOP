"""Reproducible source-description audit, never a clinical equivalence importer.

Reads the complete reviewed snapshots. Writes only review artifacts; no product
catalogue, application database or fallback switch is modified.
"""
import argparse
from collections import Counter
import hashlib
import importlib.util
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("catalog_import", ROOT / "scripts/import-food-catalog.py")
catalog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(catalog)


def description_words(text):
    # Ingredient lists inside parentheses do not identify the standalone food.
    head = re.split(r"[([]", text, maxsplit=1)[0]
    head = re.sub(r"(\d+)\s*minutos?", r"\1 min", head, flags=re.I)
    words = catalog.candidate_words(head)
    return words - {"em", "brasil", "brasiil", "brasl"}


def primary_words(text):
    return description_words(text.split(",", 1)[0])


def family_matches(name, requested, primary):
    head = re.split(r"[([]", name, maxsplit=1)[0]
    parts = head.split(",")
    leading = primary_words(name)
    if leading == primary:
        return True
    # Source descriptions can reverse noun order: "Farinha de arroz" /
    # "Arroz, farinha". Both nouns must be explicitly present, no synonym or
    # ingredient-recipe inference. Only the first two identity segments qualify.
    return (len(parts) > 1 and leading <= requested and
            primary <= description_words(parts[1]))


def candidate(food, requested):
    actual = description_words(food["name"])
    return {
        "code": food["code"], "name": food["name"], "url": food["url"],
        "responseSha256": food["responseSha256"],
        "missingDescriptors": sorted(requested - actual),
        "extraDescriptors": sorted(actual - requested),
        "compositionIssues": food.get("compositionIssues", []),
    }


def audit_row(row, taco, foods):
    requested = description_words(row["name"])
    primary = primary_words(row["name"])
    # Same leading food family only; aliases which change identity need a person.
    family = [f for f in foods if family_matches(f["name"], requested, primary)]
    direct = [f for f in family if requested <= description_words(f["name"])]
    not_direct = [x["code"] for x in row["candidates"]
                       if not any(f["code"] == x["code"] for f in direct)]
    ranked = sorted(family, key=lambda f: (
        len(requested - description_words(f["name"])),
        len(description_words(f["name"]) - requested), f["code"]))
    selected = direct if direct else ranked[:5]
    details = [candidate(f, requested) for f in selected]
    if row["fallbackEnabled"]:
        status = "EXISTING_QUALIFIED_FALLBACK"
        reason = "Qualificação técnica anterior preservada; aceite Amanda pendente."
    elif taco.get("compositionIssues"):
        status = "TACO_SOURCE_INVALID"
        reason = "Valores negativos na fonte TACO; não habilitar como fallback."
    elif direct:
        status = "DIRECT_DESCRIPTION_FOUND"
        reason = "Descritores TACO encontrados no alimento principal TBCA, fora da lista de ingredientes; diferenças adicionais permanecem explícitas."
    else:
        status = "IDENTITY_DECISION_REQUIRED"
        reason = "Descrição direta não demonstrada. Família/alias/variedade/preparo precisam de revisão humana; isto não comprova ausência TBCA."
    return {"code": row["code"], "name": row["name"], "status": status,
            "reason": reason, "fallbackEnabled": row["fallbackEnabled"],
            "clinicalEquivalenceApproved": False,
            "tacoIssues": taco.get("compositionIssues", []),
            "tacoUrl": taco["url"], "familyCount": len(family),
            "reviewedCandidates": details,
            "previousCandidatesNotDirect": not_direct}


def build_report(foods, taco, coverage, hashes):
    taco_by_code = {f["code"]: f for f in taco}
    if (len(taco_by_code) != len(taco) or len(coverage) != len(taco) or
            {r["code"] for r in coverage} != set(taco_by_code)):
        raise ValueError("TACO review must cover every unique source identity")
    rows = [audit_row(row, taco_by_code[row["code"]], foods) for row in coverage]
    return {"scope": "Technical description audit; no clinical equivalence or product activation",
            "sourceHashes": hashes, "count": len(rows),
            "statusCounts": dict(Counter(r["status"] for r in rows)), "rows": rows}


def markdown(report):
    lines = ["# Revisão das descrições TACO × TBCA — WEBFIT-19", "",
             "Matriz técnica reproduzível. Nenhuma equivalência clínica foi aprovada por este relatório; nenhum fallback novo foi ativado.", "",
             "As diferenças de descritores devem ser lidas antes de escolher uma preparação. Ausência de correspondência não prova ausência do alimento na TBCA.", "",
             "## Resumo", ""]
    lines += [f"- {status}: {count}" for status, count in report["statusCounts"].items()]
    lines += ["", "## Matriz completa", "", "| TACO | Alimento | Resultado | TBCA para conferir | Diferenças |", "| --- | --- | --- | --- | --- |"]
    for row in report["rows"]:
        examples = row["reviewedCandidates"]
        links = "; ".join(f"[{c['code']}]({c['url']}) — {c['name']}" for c in examples)
        differences = "; ".join(
            f"{c['code']}: não descrito={','.join(c['missingDescriptors']) or 'nenhum'}; adicional={','.join(c['extraDescriptors']) or 'nenhum'}" for c in examples)
        if row["tacoIssues"]:
            differences += "; Fonte inválida: " + ", ".join(row["tacoIssues"])
        cells = [row["code"], row["name"], row["status"], links or "Revisar família/alias", differences or row["reason"]]
        lines.append("| " + " | ".join(c.replace("|", "/").replace("\n", " ") for c in cells) + " |")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    paths = {"tbca": ROOT / "src/data/tbca.json",
             "taco": ROOT / ".tools/catalog-investigation/taco.xlsx",
             "coverage": ROOT / "src/data/taco-coverage.json"}
    raw = {key: path.read_bytes() for key, path in paths.items()}
    # Reparse the official workbook and require its reviewed SHA256 rather
    # than trusting a mutable derived cache as nutritional evidence.
    report = build_report(json.loads(raw["tbca"]), catalog.taco_foods(paths["taco"]), json.loads(raw["coverage"]),
                          {key: hashlib.sha256(value).hexdigest() for key, value in raw.items()})
    output = ROOT / "specs/checkpoint-pendencias-2026-10-09"
    payloads = {output / "P02-taco-review.json": json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                output / "P02-taco-review.md": markdown(report)}
    for path, payload in payloads.items():
        if args.check:
            if path.read_text(encoding="utf-8") != payload:
                raise ValueError("Source/review changed: regenerate and review " + path.name)
        else:
            path.write_text(payload, encoding="utf-8")
    print(json.dumps({"count": report["count"], "statusCounts": report["statusCounts"],
                      "productWrites": False, "clinicalApproval": False}))


if __name__ == "__main__":
    main()
