"""Validate and import complete official reference snapshots offline.

Run without --publish to prepare a report only. No application DB is accessed.
TACO candidates are compared with the whole TBCA inventory; a text search with
no result does not establish absence and cannot enable fallback.
"""
import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import html
import importlib.util
import json
import math
from pathlib import Path
import re
import unicodedata
from xml.etree import ElementTree as ET
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".tools/catalog-investigation"
DATA = ROOT / "src/data"
TACO_URL = "https://nepa.unicamp.br/wp-content/uploads/sites/27/2023/10/Taco-4a-Edicao.xlsx"
TACO_SHA256 = "a66b8ec528daeabc63bc2b015fc9bd8c6d76b941c2fc0ed93a4311d449302d14"
REVIEWED_INDEX_SHA256 = "116abd95ae918b49002d3ed62c3b8ce8710c34806f168c929a6e1efceb29990d"
REVIEWED_CHANTILLY_PAGES = {
    "BRC0007R": "85859623aad020c4073d8431c10b4b478896fc05813f9652c79c7f926fc17d80",
    "BRC0008R": "d7e9cd7f5b8df8bc2ac735aefb79b0f382819ab2c94aca842f210b9ab2d5edaa",
    "BRC0009R": "4a60c6f3fe289af80c466e04259edad2a81d6c7c86da5d53ec41d2824318ff23",
    "BRC0037K": "80af1a75a8badbf897a898ce1c13730e1b5f71a70e8929c16f72d03d4b5ba69b",
    "BRC0099K": "ce85a01fec77f40d7896e386035ba1b13a36c671f9c8ecd2c26a787667781ff7",
    "BRC0135G": "37c6f9eb73468448a2b371847581f8486a91c3c5e8e9e488e35ae7570d876e9a",
    "BRC1007A": "f2fea790e21102df3fc521a3263b50ad063f1c203b5816bde9e38bdcc2dbb1e6",
    "BRC1061A": "e939d1babf6f473fbea5c71d27f1bbf3ad292a2b2641ec5d1025aaddb5f24ba9",
    "BRC1149A": "e737362c0e741009ada021ec8e9e1e56b5c911b91cd6a5db2ca03f24db703b16",
}
spec = importlib.util.spec_from_file_location("tbca_parser", ROOT / "scripts/expand-tbca.py")
tbca = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tbca)
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, value, compact=False):
    if path.exists() and load_json(path) == value:
        return  # Preserve byte-identical snapshots, including formatting.
    path.parent.mkdir(parents=True, exist_ok=True)
    staged = path.with_suffix(path.suffix + ".staged")
    staged.write_text(json.dumps(value, ensure_ascii=False, allow_nan=False,
                                indent=None if compact else 2,
                                separators=(",", ":") if compact else None) + "\n", encoding="utf-8")
    staged.replace(path)


def normalized(value):
    folded = "".join(c for c in unicodedata.normalize("NFD", value.casefold())
                     if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", folded).strip()


def candidate_words(value):
    value = value.casefold().replace("s/", "sem ").replace("c/", "com ")
    value = normalized(value).replace("in natura", "cru")
    value = re.sub(r"\b(crua|cruas|crus)\b", "cru", value)
    value = re.sub(r"\b(cozid|assad|grelhad|frit|refogad|torrad)(?:o|a|os|as)\b", r"\1", value)
    aliases = {"bovina": "boi", "suina": "porco", "mingnon": "mignon",
               "bolognesa": "bolonhesa", "ponca": "ponka", "fejiao": "feijao"}
    return {aliases.get(word, word) for word in value.split()
            if word not in {"de", "do", "da", "dos", "das", "e", "para"}}


def xlsx_rows(path):
    """Read only the cached values in the official composition sheet."""
    with ZipFile(path) as archive:
        strings = ["".join(item.itertext()) for item in
                   ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("m:si", NS)]
        sheet = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))
        rows = []
        for row in sheet.findall("m:sheetData/m:row", NS):
            cells = {}
            for cell in row.findall("m:c", NS):
                value = cell.find("m:v", NS)
                if value is None:
                    text = ""
                elif cell.get("t") == "s":
                    text = strings[int(value.text)]
                elif cell.get("t") == "e":
                    raise ValueError("Spreadsheet error in " + cell.get("r", "?"))
                else:
                    text = value.text or ""
                column = re.sub(r"[0-9]", "", cell.get("r", ""))
                cells[column] = text
            rows.append((int(row.get("r")), cells))
        return rows


def taco_foods(path):
    if digest(path.read_bytes()) != TACO_SHA256:
        raise ValueError("Official TACO snapshot hash changed; inspect before importing")
    rows = xlsx_rows(path)
    headers = dict(rows)[3]
    if any(headers.get(column) != label for column, label in
           {"A": "Alimento", "D": "(kcal)", "F": "(g)", "I": "(g)",
            "J": "(g)", "L": "(mg)", "X": "(mcg)"}.items()):
        raise ValueError("Unexpected TACO column schema")
    columns = {"C": "Umidade:%", "D": "Energia:kcal", "E": "Energia:kJ",
               "F": "Proteína:g", "G": "Lipídios:g", "H": "Colesterol:mg",
               "I": "Carboidrato total:g", "J": "Fibra alimentar:g", "K": "Cinzas:g",
               "L": "Cálcio:mg", "M": "Magnésio:mg", "O": "Manganês:mg",
               "P": "Fósforo:mg", "Q": "Ferro:mg", "R": "Sódio:mg",
               "S": "Potássio:mg", "T": "Cobre:mg", "U": "Zinco:mg",
               "V": "Retinol:mcg", "W": "Vitamina A (RE):mcg", "X": "Vitamina A (RAE):mcg",
               "Y": "Tiamina:mg", "Z": "Riboflavina:mg", "AA": "Piridoxina:mg",
               "AB": "Niacina:mg", "AC": "Vitamina C:mg"}
    foods = []
    for row, cells in rows:
        if not re.fullmatch(r"[0-9]+", cells.get("A", "")):
            continue
        number = int(cells["A"])
        if cells.get("N") != cells["A"] or not cells.get("B", "").strip():
            raise ValueError("TACO food identity mismatch at row " + str(row))
        name = cells["B"].strip()
        if "\ufffd" in name:
            raise ValueError("TACO food name encoding error at row " + str(row))
        nutrients = {}
        issues = []
        for column, key in columns.items():
            original = cells.get(column, "").strip()
            try:
                value = float(original.replace(",", "."))
            except ValueError:
                value = None
            if value is not None and (not math.isfinite(value) or value < 0):
                issues.append(key)
                value = None
            nutrients[key] = {"value": value, "unit": key.rsplit(":", 1)[1], "original": original}
        food = {"code": f"TACO4-{number:03d}", "name": name, "source": "TACO 4ª edição",
                "url": TACO_URL, "grams": 100, "measures": [], "nutrients": nutrients,
                "sourceRow": row}
        for field, key in tbca.MACROS.items():
            food[field] = nutrients[key]["value"]
        if issues:
            food["compositionIssues"] = issues
        foods.append(food)
    if len(foods) != 597 or len({food["code"] for food in foods}) != len(foods):
        raise ValueError("Unexpected TACO snapshot inventory")
    return foods


def index_names(index):
    """Names are taken from the same hashed index traversal, not search snippets."""
    names = {}
    for source in index["pages"]:
        link = source["url"].removeprefix(tbca.BASE)
        path = CACHE / ("index-" + digest(link.encode()) + ".html")
        raw = path.read_bytes()
        if digest(raw) != source["sha256"]:
            raise ValueError("TBCA index cache hash mismatch")
        page = raw.decode("utf-8", errors="strict")
        for row in re.findall(r"<tr>.*?</tr>", page, re.S):
            links = re.findall(r"href='([^']+)'[^>]*>(.*?)</a>", row, re.S)
            if len(links) < 2 or not re.fullmatch(r"BRC[0-9]+[A-Z]", links[0][1]):
                continue
            name = tbca.plain(links[1][1])
            if "\ufffd" in name or not name:
                raise ValueError("TBCA index name encoding error")
            if links[0][1] in names and names[links[0][1]] != name:
                raise ValueError("Conflicting TBCA index description")
            names[links[0][1]] = name
    if set(names) != set(index["codes"]):
        raise ValueError("TBCA names do not cover the complete code inventory")
    return names


def compare_taco(foods, names):
    result = []
    prepared = [(code, name, candidate_words(name)) for code, name in sorted(names.items())]
    for food in foods:
        words = candidate_words(food["name"])
        # Matching all words is candidate discovery, not clinical equivalence.
        candidates = [{"code": code, "name": name} for code, name, tokens in prepared
                      if words.issubset(tokens)]
        result.append({"code": food["code"], "name": food["name"],
                       "status": "TBCA_CANDIDATE" if candidates else "NEEDS_EQUIVALENCE_REVIEW",
                       "candidates": candidates, "fallbackEnabled": False})
    return result


def qualify_fallback(coverage, taco, foods, snapshot):
    """One reviewed preparation, bound to the complete inventory. Text-only
    candidates remain unresolved; never merge nutrients from two tables."""
    if snapshot.get("indexSha256") != REVIEWED_INDEX_SHA256:
        raise ValueError("TBCA inventory changed; review fallback again")
    related = {food["code"]: {"name": food["name"], "responseSha256": food["responseSha256"]}
               for food in foods if any(word in normalized(food["name"]) for word in ("chantill", "chantily", "chantili", "spray"))}
    if {code: item["responseSha256"] for code, item in related.items()} != REVIEWED_CHANTILLY_PAGES:
        raise ValueError("Chantilly family inventory changed; review fallback again")
    # All standalone TBCA relatives are powder or prepared from powder; the
    # remaining records are cakes, sundae or pudding. None describes ready spray
    # with vegetable fat. Reviewed response hashes cannot be silently renewed.
    for row in coverage:
        if row["code"] != "TACO4-522":
            continue
        row.update(status="FALLBACK_QUALIFIED", fallbackEnabled=True,
                   evidence={"inventorySha256": snapshot["indexSha256"],
                             "reviewedTbcaFamily": related,
                             "reason": "TBCA relatives describe powder/prepared powder, cakes, sundae or pudding; no ready spray preparation with vegetable fat. Preserve exact TACO preparation, no substitution or nutrient merging.",
                             "decision": "D-CAT-019-002 AGENT-PROVISIONAL technical source qualification; clinical acceptance remains with Amanda"})
    fallback = [food for food in taco if food["code"] == "TACO4-522"]
    if len(fallback) != 1 or fallback[0].get("compositionIssues"):
        raise ValueError("Fallback TACO identity/composition changed")
    return fallback


def import_tbca(index, snapshot, allow_partial=False, names=None):
    if snapshot.get("indexSha256") != digest((CACHE / "tbca-index.json").read_bytes()):
        raise ValueError("Composition collection belongs to another TBCA inventory")
    if (index.get("indexTraversalComplete") is not True or
            index.get("count") != len(index.get("codes", {}))):
        raise ValueError("Incomplete TBCA code inventory")
    sources = snapshot.get("sources", [])
    codes = [source["code"] for source in sources]
    if len(set(codes)) != len(codes) or not set(codes).issubset(index["codes"]):
        raise ValueError("Duplicate/unexpected TBCA composition codes")
    if not allow_partial and (snapshot.get("compositionCollectionComplete") is not True or
                              set(codes) != set(index["codes"])):
        raise ValueError("Complete composition collection required before product import")
    foods = []
    for source in sorted(sources, key=lambda value: value["code"]):
        expected_url = index["codes"][source["code"]].replace("int_composicao_estatistica.php", "int_composicao_alimentos_2_edit.php")
        if source["url"] != expected_url:
            raise ValueError("TBCA composition origin differs from index")
        raw = (CACHE / "composition" / (source["code"] + ".html")).read_bytes()
        if digest(raw) != source["responseSha256"]:
            raise ValueError("TBCA composition response hash mismatch: " + source["code"])
        if not re.search(r"<th>Valor por 100\s+g</th>", raw.decode("utf-8")):
            raise ValueError("Unexpected TBCA composition basis: " + source["code"])
        food = tbca.parse_food(source["code"], source["url"], raw.decode("utf-8"),
                               require_quantitative=False)
        food["responseSha256"] = source["responseSha256"]
        if not food["name"] or not food["nutrients"]:
            if names is None or not names.get(source["code"]):
                raise ValueError("TBCA composition/index identity unavailable")
            food["sourceDescription"] = food["name"]
            food["name"] = names[source["code"]]
            food["compositionIssues"] = ["Official composition page empty; name from index only"]
        for measure in food["measures"]:
            if not math.isfinite(measure["grams"]) or measure["grams"] <= 0:
                raise ValueError("Invalid official household measure")
        if len({m["name"] for m in food["measures"]}) != len(food["measures"]):
            raise ValueError("Duplicate household measure")
        foods.append(food)
    return foods


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publish", action="store_true")
    parser.add_argument("--check", action="store_true", help="Reimport in memory and compare product data without writing it")
    parser.add_argument("--probe", action="store_true", help="Report cached partial composition only")
    args = parser.parse_args()
    if (args.publish or args.check) and args.probe:
        raise ValueError("A partial probe cannot publish product data")
    index = load_json(CACHE / "tbca-index.json")
    snapshot = load_json(CACHE / "tbca-composition-manifest.json")
    names = index_names(index)
    foods = import_tbca(index, snapshot, allow_partial=args.probe, names=names)
    taco = taco_foods(CACHE / "taco.xlsx")
    coverage = compare_taco(taco, names)
    fallback = qualify_fallback(coverage, taco, foods, snapshot) if not args.probe else []
    for food in fallback:
        food["responseSha256"] = TACO_SHA256
    unavailable = Counter(field for food in foods for field in tbca.MACROS if food[field] is None)
    report = {"source": "TBCA 7.3", "date": datetime.now(timezone.utc).date().isoformat(),
              "expectedCount": len(names), "count": len(foods),
              "complete": len(foods) == len(names) and snapshot["compositionCollectionComplete"],
              "missingCodes": sorted(set(names) - {f["code"] for f in foods}),
              "indexSha256": snapshot["indexSha256"],
              "indexPages": index["pages"],
              "compositionIssues": [{"code": f["code"], "fields": f["compositionIssues"]}
                                    for f in foods if f.get("compositionIssues")],
              "usableCount": sum(not f.get("compositionIssues") for f in foods),
              "blockedCount": sum(bool(f.get("compositionIssues")) for f in foods),
              "fallbackCodes": [f["code"] for f in fallback],
              "unavailableMacros": dict(unavailable), "sources": snapshot["sources"],
              "tacoSource": {"url": TACO_URL, "sha256": TACO_SHA256, "count": len(taco)},
              "tacoStatus": dict(Counter(row["status"] for row in coverage))}
    write_json(CACHE / "import-report.json", report)
    write_json(CACHE / "taco-coverage.json", coverage)
    write_json(CACHE / "taco-parsed.json", taco)
    if args.check:
        if load_json(DATA / "tbca.json") != foods or load_json(DATA / "taco.json") != fallback or load_json(DATA / "taco-coverage.json") != coverage:
            raise ValueError("Reimport differs from versioned product snapshot")
        print("Reimport idempotence: PASS; unique codes unchanged; no product/DB write")
    if args.publish:
        # Validation above completes before changing any product file.
        write_json(DATA / "tbca.json", foods, compact=True)
        write_json(DATA / "taco.json", fallback)
        write_json(DATA / "tbca-import-manifest.json", report)
        write_json(DATA / "taco-coverage.json", coverage)
    print(json.dumps({key: report[key] for key in
                      ("expectedCount", "count", "complete", "unavailableMacros", "tacoStatus")}, ensure_ascii=True))


if __name__ == "__main__":
    main()
