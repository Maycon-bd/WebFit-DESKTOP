"""Finite, resumable collection of authorized public TBCA reference pages.

No application database or product catalogue is accessed. A failed/blocked
source never becomes a complete snapshot. Run import separately, offline.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import threading
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".tools/catalog-investigation"
DETAILS = CACHE / "composition"
OLD_CACHE = ROOT / ".tools/tbca-catalog"
STOP = threading.Event()
RATE_LOCK = threading.Lock()
NEXT_REQUEST = 0.0


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def atomic_write(path, raw):
    staged = path.with_suffix(path.suffix + ".tmp")
    staged.write_bytes(raw)
    staged.replace(path)


def validate_page(code, raw):
    page = raw.decode("utf-8", errors="strict")
    if "\ufffd" in page or not re.search(
            r'name=["\']cod_produto["\'][^>]*value=["\']' +
            re.escape(code) + r'["\']', page):
        raise ValueError("Food identity/encoding mismatch: " + code)
    if not re.search(r'<table\s+id=["\']tabela1["\']', page):
        raise ValueError("Composition table missing: " + code)


def get_page(code, index_url):
    global NEXT_REQUEST
    if not re.fullmatch(r"BRC[0-9]+[A-Z]", code):
        raise ValueError("Unexpected official code")
    url = index_url.replace("int_composicao_estatistica.php",
                            "int_composicao_alimentos_2_edit.php")
    parsed = urlparse(url)
    if (parsed.scheme != "https" or parsed.netloc != "www.tbca.net.br" or
            parsed.path != "/base-dados/int_composicao_alimentos_2_edit.php"):
        raise ValueError("Unexpected official URL: " + code)
    path = DETAILS / (code + ".html")
    legacy_key = digest((url + str(None)).encode())
    old = OLD_CACHE / (legacy_key + ".html")
    for cached in (path, old):
        if cached.exists():
            raw = cached.read_bytes()
            validate_page(code, raw)
            if cached != path:
                atomic_write(path, raw)
            return {"code": code, "url": url, "responseSha256": digest(raw)}
    for attempt in range(3):
        if STOP.is_set():
            raise RuntimeError("Collection interrupted after source failure")
        with RATE_LOCK:
            time.sleep(max(0, NEXT_REQUEST - time.monotonic()))
            NEXT_REQUEST = time.monotonic() + .25
        try:
            request = Request(url, headers={"User-Agent": "WebFit-reference-import/0.2"})
            with urlopen(request, timeout=30) as response:
                if urlparse(response.url).netloc != parsed.netloc:
                    raise ValueError("Unexpected redirect: " + code)
                raw = response.read(2_000_001)
            if len(raw) > 2_000_000:
                raise ValueError("Unexpected response size: " + code)
            validate_page(code, raw)
            atomic_write(path, raw)
            return {"code": code, "url": url, "responseSha256": digest(raw)}
        except HTTPError as error:
            if error.code in (401, 403, 429) or attempt == 2:
                STOP.set()
                raise
        except (URLError, TimeoutError, ConnectionError):
            if attempt == 2:
                STOP.set()
                raise
        time.sleep(2 * (attempt + 1))
    raise RuntimeError("Unreachable collection state")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limit", type=int, help="Probe only; snapshot stays incomplete")
    parser.add_argument("--workers", type=int, choices=(1, 2), default=2)
    args = parser.parse_args()
    index = json.loads((CACHE / "tbca-index.json").read_text(encoding="utf-8"))
    if (index.get("source") != "TBCA 7.3" or
            index.get("indexTraversalComplete") is not True or
            index.get("count") != len(index.get("codes", {}))):
        raise ValueError("A complete official index is required")
    entries = sorted(index["codes"].items())
    if args.limit is not None:
        if args.limit < 1:
            raise ValueError("Probe limit must be positive")
        entries = entries[:args.limit]
    DETAILS.mkdir(parents=True, exist_ok=True)
    sources, errors = [], []
    started = time.monotonic()
    # Submit a bounded batch instead of queuing the entire index; a source
    # refusal cancels the dependent collection promptly.
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        for offset in range(0, len(entries), 50):
            futures = {executor.submit(get_page, code, url): code
                       for code, url in entries[offset:offset + 50]}
            for future in as_completed(futures):
                code = futures[future]
                try:
                    sources.append(future.result())
                except Exception as error:
                    STOP.set()
                    errors.append({"code": code, "reason": str(error)})
            elapsed = round(time.monotonic() - started)
            print(f"Composition pages: {len(sources)}/{len(entries)}; errors: {len(errors)}; elapsed: {elapsed}s", flush=True)
            manifest = {"source": "TBCA 7.3",
                        "collectedAtUtc": datetime.now(timezone.utc).isoformat(),
                        "indexSha256": digest((CACHE / "tbca-index.json").read_bytes()),
                        "expectedCount": index["count"], "count": len(sources),
                        "compositionCollectionComplete": not errors and len(sources) == index["count"],
                        "sources": sorted(sources, key=lambda item: item["code"]),
                        "errors": sorted(errors, key=lambda item: item["code"])}
            atomic_write(CACHE / "tbca-composition-manifest.json",
                         (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode())
            if errors:
                raise RuntimeError("Collection stopped; cache retained, snapshot incomplete")


if __name__ == "__main__":
    main()
