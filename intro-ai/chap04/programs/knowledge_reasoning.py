"""知識表現と推論の観察用教材。標準ライブラリのみ、Python 3.10以降。"""
import argparse
import json

# 昨年度isa.pyの分類を教材内の定義として使用。現実の機器分類を網羅しない。
PARENTS = {
    "携帯型端末": "コンピュータ", "ノートPC": "コンピュータ",
    "据え置き型PC": "コンピュータ", "スマホ": "携帯型端末",
    "タブレット": "携帯型端末", "デスクトップ": "据え置き型PC",
    "サーバ": "据え置き型PC",
}
# 架空の機器貸出。一件の申請だけを扱い、実際の学校の規則ではない。
FACTS = ("利用登録済み", "講習修了", "在庫あり")
RULES = (
    ("R1", ("利用登録済み", "講習修了"), "利用資格あり"),
    ("R2", ("利用資格あり", "在庫あり"), "貸出候補"),
    ("R3", ("貸出候補", "予約確認済み"), "貸出準備可"),
)


def isa_path(parents, start, target):
    """単一親の経路を返す。未到達は否定せずunknown、循環はデータの問題。"""
    known = set(parents) | set(parents.values())
    if start not in known or target not in known:
        return {"status": "unknown", "reason": "unknown_term", "path": []}
    path = [start]
    visited = set()
    current = start
    while True:
        if current == target:
            return {"status": "yes", "reason": "reachable", "path": path}
        if current in visited:
            return {"status": "cycle", "reason": "repeated_node", "path": path}
        visited.add(current)
        if current not in parents:
            return {"status": "unknown", "reason": "no_path", "path": path}
        current = parents[current]
        path.append(current)


def forward_chain(initial_facts, rules):
    """肯定的な事実を追加する最小推論器。規則順に照合し、追加時だけ記録。"""
    facts = set(initial_facts)  # 呼び出し元の事実は変えない
    trace = []
    changed = True
    while changed:
        changed = False
        for rule_id, conditions, conclusion in rules:
            if set(conditions) <= facts and conclusion not in facts:
                facts.add(conclusion)
                trace.append({"rule": rule_id, "conditions": list(conditions),
                              "conclusion": conclusion})
                changed = True
    return {"facts": sorted(facts), "trace": trace}


def demo():
    queries = (("スマホ", "コンピュータ"), ("サーバ", "コンピュータ"),
               ("スマホ", "ノートPC"), ("ENIAC", "コンピュータ"),
               ("スマホ", "電子機器"), ("コンピュータ", "コンピュータ"))
    return {
        "isa": [{"start": a, "target": b, **isa_path(PARENTS, a, b)} for a, b in queries],
        "cycle": isa_path({"A": "B", "B": "A", "C": "D"}, "A", "D"),
        "initial_facts": list(FACTS),
        "baseline": forward_chain(FACTS, RULES),
        "with_reservation": forward_chain((*FACTS, "予約確認済み"), RULES),
        "without_training": forward_chain(tuple(f for f in FACTS if f != "講習修了"), RULES),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true", help="固定例を実行")
    parser.add_argument("--json", action="store_true", help="照合用JSONを出力")
    args = parser.parse_args()
    if not args.demo:
        parser.error("固定例は --demo を指定してください")
    result = demo()
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return
    labels = {"yes": "はい", "unknown": "この知識からはわかりません", "cycle": "循環を検出"}
    print("【is-a探索：教材内の分類】")
    for query in result["isa"]:
        print(f'{query["start"]}は{query["target"]}ですか？ {labels[query["status"]]}')
        print("  経路:", " → ".join(query["path"]) or "探索前に未知語を検出")
    print("循環例:", " → ".join(result["cycle"]["path"]), "（探索を停止）")
    for key, title in (("baseline", "基準"), ("with_reservation", "予約確認済みを追加"),
                       ("without_training", "講習修了を除いた別入力")):
        print(f"【前向き推論：{title}】")
        for step in result[key]["trace"]:
            print(step["rule"], " ＆ ".join(step["conditions"]), "→", step["conclusion"])
        print("最終事実:", "、".join(result[key]["facts"]))
        print("貸出準備可:", "導けた" if "貸出準備可" in result[key]["facts"] else "導けない（否定ではない）")


if __name__ == "__main__":
    main()
