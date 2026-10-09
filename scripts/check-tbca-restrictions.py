"""Recheck quarantined public pages, without changing snapshots."""
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("parser", ROOT / "scripts/expand-tbca.py")
parser = importlib.util.module_from_spec(spec)
spec.loader.exec_module(parser)


def main():
    foods = json.loads((ROOT / "src/data/tbca.json").read_text(encoding="utf-8"))
    blocked = [f for f in foods if f.get("compositionIssues")]
    if {f["code"] for f in blocked} != {"BRC0004A", "BRC0237T", "BRC1145B", "BRC1196B"}:
        raise ValueError("Reviewed restriction inventory changed")
    folder = ROOT / ".artifacts/visual-test/WEBFIT-19/source-recheck"
    folder.mkdir(parents=True, exist_ok=True)
    rows = []
    for food in blocked:
        url = food["url"]
        if not url.startswith("https://www.tbca.net.br/base-dados/int_composicao_alimentos_2_edit.php?"):
            raise ValueError("Unexpected public source")
        try:
            with urlopen(Request(url, headers={"User-Agent": "WebFit-reference-review/0.1"}), timeout=25) as response:
                if not response.url.startswith("https://www.tbca.net.br/"):
                    raise ValueError("Unexpected redirect")
                raw = response.read(2_000_001)
            if len(raw) > 2_000_000:
                raise ValueError("Response too large")
            current = parser.parse_food(food["code"], url, raw.decode("utf-8"), require_quantitative=False)
            (folder / (food["code"] + ".html")).write_bytes(raw)
            issues = current.get("compositionIssues", [])
            if not current["name"] or not current["nutrients"]:
                issues = issues + ["Official composition page empty"]
            rows.append({"code": food["code"], "url": url,
                         "previousSha256": food["responseSha256"],
                         "currentSha256": hashlib.sha256(raw).hexdigest(),
                         "status": "STILL_BLOCKED" if issues else "CORRECTION_REQUIRES_REVIEW",
                         "currentIssues": issues})
        except HTTPError as error:
            rows.append({"code": food["code"], "status": "SOURCE_UNAVAILABLE", "httpStatus": error.code})
            if error.code in (403, 429):
                break
        except (OSError, ValueError) as error:
            rows.append({"code": food["code"], "status": "SOURCE_UNAVAILABLE", "errorType": type(error).__name__})
        time.sleep(.3)
    report = {"checkedAtUtc": datetime.now(timezone.utc).isoformat(), "rows": rows,
              "productWrites": False}
    (folder / "results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=True))


if __name__ == "__main__":
    main()
