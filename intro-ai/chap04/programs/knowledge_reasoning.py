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


def forward_chain(initial_facts, rules, record=None):
    """肯定的な事実を追加する最小推論器。規則順に照合し、追加時だけ記録。"""
    facts = set(initial_facts)  # 呼び出し元の事実は変えない
    trace = []
    changed = True
    while changed:
        changed = False
        for rule_id, conditions, conclusion in rules:
            missing = [condition for condition in conditions if condition not in facts]
            already_known = conclusion in facts
            if record is not None:
                record.append((rule_id, sorted(facts), list(conditions), missing, conclusion,
                               '追加済み' if already_known else '条件不足' if missing else '追加する'))
            if not missing and not already_known:
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



def lesson_isa(target='コンピュータ'):
    result = isa_path(PARENTS,'スマホ',target)
    rows = [(i,name,'目標に到達' if name==target else '親を調べる' if name in PARENTS else '親の記録なし',PARENTS.get(name,'—')) for i,name in enumerate(result['path'])]
    if not rows:
        rows=[('—','スマホ','探索前に未知語を検出','—')]
    return {'title':'分類の矢印を一つずつたどる','question':'経路がなければ否定してよいか',
            'input':f'スマホは{target}か。教材内の単一親の分類。',
            'columns':['段階','現在の用語','処理','記録された親'],'rows':rows,
            'result':result,'comparison':'コンピュータ→ノートPCでは、経路をたどっても目標へ着かずunknown。',
            'explanation':'スマホ→携帯型端末→コンピュータという分類上の関係。現実の全分類を収録したデータではなく、未到達は否定ではない。',
            'reset':'target="コンピュータ"で再実行。'}


def lesson_forward(reservation=False):
    facts = list(FACTS)
    if reservation:
        facts.append('予約確認済み')
    trace = []
    result = forward_chain(facts,RULES,record=trace)
    return {'title':'事実カードと規則の条件を照合する','question':'どの規則で新しい事実が増えたか',
            'input':facts,'columns':['規則','その時点の事実','必要条件','不足条件','結論','判定'],'rows':trace,
            'tables':[('実際に追加した順',['規則','使った条件','追加した事実'],[(r['rule'],r['conditions'],r['conclusion']) for r in result['trace']])],
            'result':result['facts'],'comparison':'予約確認済みを追加するとR3も条件がそろい、貸出準備可が加わる。',
            'explanation':'同じ周回内でも、先の規則で加えた事実を後の規則が使える。追加がなくなるまで繰り返す。規則の適用と単なる照合を区別する。',
            'reset':'reservation=Falseで再実行。FACTSのコピーを使う。'}


def lesson_missing(remove_training=True):
    facts = [f for f in FACTS if not (remove_training and f=='講習修了')]
    result = forward_chain(facts,RULES)
    rows = [(fact,'記録あり' if fact in result['facts'] else '導けない（不明）') for fact in ['講習修了','利用資格あり','貸出候補','貸出準備可']]
    return {'title':'導けないことと否定を区別する','question':'講習修了が記録にない人は未修了と断定できるか',
            'input':facts,'columns':['調べたい事実','この知識から言えること'],'rows':rows,
            'result':result,'comparison':'講習修了を除くとR1・R2が導けない。戻すと利用資格あり・貸出候補まで導ける。',
            'explanation':'このプログラムは肯定的事実を追加する前向き推論器。明示的な否定・例外の優先順位・後ろ向き探索は実装していない。事実がないことを否定へ置き換えない。',
            'reset':'remove_training=Trueで再実行。元のFACTSは保持。'}

STUDY_THEMES = {'isa': lesson_isa, 'forward': lesson_forward, 'missing': lesson_missing}

def explain_lesson(theme='all'):
    """表示は丸めても、計算には元の値を使う。"""
    functions = STUDY_THEMES if theme == 'all' else {theme: STUDY_THEMES[theme]}
    for name, function in functions.items():
        report = function()
        print('\nテーマ:', report['title'])
        print('問い:', report['question'])
        print('入力:', report['input'])
        print(' | '.join(report['columns']))
        for row in report['rows']:
            print(' | '.join(str(value) for value in row))
        for title, columns, rows in report.get('tables', []):
            print(title, ' | '.join(columns))
            for row in rows:
                print(' | '.join(str(value) for value in row))
        print('結果:', report['result'])
        print('一つ変える:', report['comparison'])
        print('読み取り:', report['explanation'])
        print('戻す:', report['reset'])


def study_cli():
    parser = argparse.ArgumentParser(description='入力→途中計算→結果を読む')
    parser.add_argument('--explain', choices=['all', *STUDY_THEMES], required=True)
    args = parser.parse_args()
    explain_lesson(args.explain)

if __name__ == '__main__':
    import sys
    if '--explain' in sys.argv:
        study_cli()
    else:
        main()
