#!/usr/bin/env python3
"""Regenerate the complete, deterministic asset list used by the service worker."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "offline-assets.json"


def main() -> None:
    assets = {"./"}
    assets.update(
        f"./{path.relative_to(ROOT).as_posix()}"
        for path in ROOT.rglob("*")
        if path.is_file()
    )
    assets.add("./offline-assets.json")
    OUTPUT.write_text(
        json.dumps(sorted(assets), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
