"""Import a bounded public TBCA selection; never access application/user data.

Run from repository root. Cached public HTML and response hashes make the
selection reproducible; the existing five records are preserved verbatim.
No missing/trace nutrient is silently converted to zero.
"""
import hashlib
import html
import json
from pathlib import Path
import re
import time
import unicodedata
import urllib.parse
import urllib.request

BASE = "https://www.tbca.net.br/base-dados/"
CACHE = Path(".tools/tbca-catalog")
QUERIES = ["arroz", "feijão", "banana", "maçã", "laranja", "mamão", "abacate",
           "aveia", "batata", "mandioca", "cenoura", "tomate", "alface", "brócolis",
           "frango", "carne, bovina", "ovo", "leite", "iogurte", "queijo", "pão",
           "azeite", "lentilha", "peixe, tilápia", "peixe, sardinha", "peixe, atum",
           "ovo, galinha, inteiro", "leite, vaca", "carne, frango, peito", "aveia, flocos",
           "pão, francês", "arroz, polido", "feijão, carioca", "feijão, preto"]
MACROS = {"kcal": "Energia:kcal", "protein": "Proteína:g", "carbs": "Carboidrato total:g",
          "fat": "Lipídios:g", "fiber": "Fibra alimentar:g"}


def plain(value):
    return html.unescape(re.sub(r"<[^>]+>", "", value)).strip()


def normalize(value):
    return "".join(c for c in unicodedata.normalize("NFD", value.casefold())
                   if not unicodedata.combining(c))


def matches_query(name, query):
    return re.match(re.escape(normalize(query)) + r"(?=\s|,|\(|$)", normalize(name)) is not None


def fetch(url, data=None):
    key = hashlib.sha256((url + str(data)).encode()).hexdigest()
    path = CACHE / (key + ".html")
    if not path.exists():
        body = urllib.parse.urlencode(data).encode() if data else None
        for attempt in range(3):
            try:
                request = urllib.request.Request(url, data=body, headers={"User-Agent": "WebFit-reference-import/0.1"})
                with urllib.request.urlopen(request, timeout=30) as response:
                    raw = response.read()
                raw.decode("utf-8", errors="strict")
                path.write_bytes(raw)
                time.sleep(0.25)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(1)
    raw = path.read_bytes()
    return raw.decode("utf-8"), hashlib.sha256(raw).hexdigest()


def parse_food(code, url, page):
    if not re.search(r'name="cod_produto"[^>]*value="' + re.escape(code) + r'"', page):
        raise ValueError("Official code mismatch: " + code)
    name = plain(re.search(r"<strong>Descrição:</strong>(.*?)<br>", page, re.S)[1])
    table = re.search(r"<table id='tabela1'.*?</table>", page, re.S)[0]
    nutrients = {}
    for row in re.findall(r"<tr>.*?</tr>", table, re.S):
        cells = [plain(c) for c in re.findall(r"<td>(.*?)</td>", row, re.S)]
        if len(cells) < 3:
            continue
        try:
            amount = float(cells[2].replace(",", "."))
        except ValueError:
            amount = None
        nutrients[cells[0] + ":" + cells[1]] = {"value": amount, "unit": cells[1], "original": cells[2]}
    measures = []
    for cell in re.findall(r"<th>(.*?)</th>", table, re.S):
        label = plain(cell)
        match = re.search(r"\(([0-9,]+)\s*g\)", label)
        if match:
            measures.append({"name": label, "grams": float(match[1].replace(",", "."))})
    food = {"code": code, "name": name, "source": "TBCA 7.3", "url": url,
            "grams": 100, "measures": measures, "nutrients": nutrients}
    for field, key in MACROS.items():
        amount = nutrients.get(key, {}).get("value")
        if amount is None or amount < 0:
            raise ValueError("Quantitative macronutrient unavailable: " + code + " " + field)
        food[field] = amount
    return food


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    target = Path("src/data/tbca.json")
    original = json.loads(target.read_text(encoding="utf-8"))
    foods = {food["code"]: food for food in original}
    manifest_path = Path("src/data/tbca-import-manifest.json")
    previous = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}
    sources = previous.get("sources", [])
    excluded = []
    for query in QUERIES:
        page, index_hash = fetch(BASE + "composicao_estatistica.php", {
            "guarda": "tomo1", "produto": query, "cmb_grupo": "", "cmb_tipo_alimento": ""})
        selected = []
        for row in re.findall(r"<tr>.*?</tr>", page, re.S):
            links = re.findall(r"href='([^']+)'[^>]*>(.*?)</a>", row, re.S)
            if len(links) < 2 or not re.fullmatch(r"BRC[0-9]+[A-Z]", links[0][1]):
                continue
            code = links[0][1]
            name = plain(links[1][1])
            if not matches_query(name, query):
                continue
            selected.append((code, links[0][0]))
            if len(selected) == 3:
                break
        for code, link in selected:
            if code in foods:
                continue
            url = BASE + link.replace("int_composicao_estatistica.php", "int_composicao_alimentos_2_edit.php")
            detail, detail_hash = fetch(url)
            try:
                foods[code] = parse_food(code, url, detail)
            except ValueError as error:
                excluded.append({"code": code, "reason": str(error), "url": url})
                continue
            sources.append({"code": code, "url": url, "responseSha256": detail_hash,
                            "query": query, "indexResponseSha256": index_hash})
        print(query + ": " + str(len(foods)) + " alimentos", flush=True)
    if len(foods) < 30:
        raise ValueError("Unexpectedly small catalog; previous file remains unchanged")
    serialized = json.dumps(list(foods.values()), ensure_ascii=False, indent=2) + "\n"
    if "\ufffd" in serialized:
        raise ValueError("Invalid decoded text; previous file remains unchanged")
    staged = target.with_suffix(".staged.json")
    staged.write_text(serialized, encoding="utf-8")
    staged.replace(target)
    manifest = {"date": "2026-10-07", "source": "TBCA 7.3", "queries": QUERIES,
                "selection": "First three matching-prefix records per query; bounded initial catalog, not complete TBCA",
                "count": len(foods), "previousRecordsPreserved": previous.get("previousRecordsPreserved", len(original)), "sources": sources, "excluded": excluded}
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("DONE: " + str(len(foods)) + " official foods; " + str(len(excluded)) + " exclusions", flush=True)


if __name__ == "__main__":
    main()
