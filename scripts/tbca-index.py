"""Collect the authorized public TBCA index, without changing product data.

The index alone is not nutritional composition or proof of equivalence to TACO.
Use sequential requests, a response cache and explicit completeness metadata.
"""
import hashlib
import json
from pathlib import Path
import re
import time
from urllib.parse import urljoin
from urllib.request import Request, urlopen

BASE = "https://www.tbca.net.br/base-dados/"
CACHE = Path(".tools/catalog-investigation")


def entries(page):
    return dict((code, urljoin(BASE, href)) for href, code in re.findall(
        r"href='([^']+)'[^>]*>(BRC[0-9]+[A-Z])</a>", page))


def pages(page):
    return sorted(set(link.replace("&amp;", "&") for link in re.findall(
        r"href=['\"]([^'\"]*pagina[^'\"]*)", page)
        if link.startswith("composicao_estatistica.php?")
        and re.search(r"[?&]pagina=[0-9]+(?:&|$)", link)))


def fetch(link):
    path = CACHE / ("index-" + hashlib.sha256(link.encode()).hexdigest() + ".html")
    if not path.exists():
        for attempt in range(3):
            try:
                request = Request(urljoin(BASE, link), headers={"User-Agent": "WebFit-reference-import/0.1"})
                with urlopen(request, timeout=30) as response:
                    data = response.read()
                page = data.decode("utf-8", errors="strict")
                if not entries(page):
                    raise ValueError("Index page has no official food codes")
                path.write_bytes(data)
                time.sleep(.5)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(2 * (attempt + 1))
    data = path.read_bytes()
    return data.decode("utf-8"), hashlib.sha256(data).hexdigest()


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    queue = ["composicao_estatistica.php"]
    seen, foods, provenance = set(), {}, []
    complete = False
    try:
        while queue:
            link = queue.pop(0)
            if link in seen:
                continue
            if len(seen) >= 100:
                raise ValueError("Unexpected pagination; completeness not established")
            page, digest = fetch(link)
            if not entries(page):
                raise ValueError("Missing food codes; completeness not established")
            seen.add(link)
            foods.update(entries(page))
            provenance.append({"url": urljoin(BASE, link), "sha256": digest})
            queue.extend(p for p in pages(page) if p not in seen and p not in queue)
            if len(seen) % 10 == 0:
                print(f"Pages: {len(seen)}; codes: {len(foods)}", flush=True)
        complete = True
    finally:
        result = {"source": "TBCA 7.3", "indexTraversalComplete": complete,
                  "compositionComplete": False, "count": len(foods),
                  "pages": provenance, "codes": foods}
        (CACHE / "tbca-index.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Index traversal complete: {len(seen)} pages; {len(foods)} codes", flush=True)


if __name__ == "__main__":
    main()
