"""第13回：ゲーム木とニム。実行: python game_search.py --demo

利得は常にMAXから見た値。探索は学習ではなく、入力を変更しない。
同じ局面への別経路も別節点として数え、キャッシュは使用しない。
"""
import argparse
from copy import deepcopy
import json

TREE_BASE = {"leaves": [3, 5, 2, 9, 0, 4], "heuristics": [0, 1, 4, 2],
             "depth": 2, "reverse": False, "algorithm": "minimax", "player": 1}
NIM_BASE = {"piles": [3, 2], "player": 1, "reverse": False, "algorithm": "minimax"}


def integer(value, low, high, name):
    if type(value) is not int or not low <= value <= high:
        raise ValueError(f"{name}: {low}〜{high}の整数を指定してください")
    return value


def validate_piles(piles):
    if not isinstance(piles, (list, tuple)) or len(piles) != 2:
        raise ValueError("山は2個です")
    for p in piles:
        integer(p, 0, 4, "石の数")
    if sum(piles) > 6:
        raise ValueError("石は合計6個以下です")


def legal_moves(piles):
    validate_piles(piles)
    moves = []
    for pile_index, stones in enumerate(piles):
        for take in range(1, stones + 1):
            moves.append([pile_index, take])
    return moves


def apply_move(piles, action):
    validate_piles(piles)
    if not isinstance(action, (list, tuple)) or len(action) != 2:
        raise ValueError("手は[山番号,取る個数]です")
    i, take = action
    integer(i, 0, 1, "山番号")
    integer(take, 1, 4, "取る個数")
    if take > piles[i]:
        raise ValueError("その山には指定した数の石がありません")
    result = list(piles)
    result[i] -= take
    return result


def _config(config, kind):
    base = TREE_BASE if kind == "tree" else NIM_BASE
    if not isinstance(config, dict) or set(config) - set(base):
        raise ValueError("未知の設定項目です")
    c = deepcopy({**base, **config})
    if type(c["player"]) is not int or c["player"] not in (-1, 1):
        raise ValueError("手番はMAX=1またはMIN=-1です")
    if type(c["reverse"]) is not bool or c["algorithm"] not in ("minimax", "alphabeta"):
        raise ValueError("探索順・方式が不正です")
    if kind == "tree":
        integer(c["depth"], 0, 2, "探索深さ")
        for key, length in (("leaves", 6), ("heuristics", 4)):
            if not isinstance(c[key], (list, tuple)) or len(c[key]) != length:
                raise ValueError(f"{key}は{length}個です")
            for x in c[key]:
                integer(x, -100, 100, key)
    else:
        validate_piles(c["piles"])
    return c


def _search(c, kind):
    """深さ優先探索。履歴中の±無限大はJSONで明示できる文字列にする。"""
    trace, pruned = [], []
    stats = {"visited_nodes": 0, "evaluations": 0, "terminal_evaluations": 0,
             "cutoff_evaluations": 0}
    ab = c["algorithm"] == "alphabeta"

    def bound_number(x):
        return "-inf" if x == -float("inf") else "+inf" if x == float("inf") else x

    def visit(state, player, depth, node_id, alpha, beta):
        stats["visited_nodes"] += 1
        trace.append({"event": "enter", "id": node_id, "player": player, "depth": depth,
                      "alpha": bound_number(alpha), "beta": bound_number(beta)})
        terminal = len(state) == 2 if kind == "tree" else sum(state) == 0
        cutoff = kind == "tree" and not terminal and depth >= c["depth"]
        if terminal or cutoff:
            if kind == "nim":
                value = -player  # 手番側は合法手がないので負け。
            elif terminal:
                value = c["leaves"]["ABC".index(state[0]) * 2 + int(state[1]) - 1]
            else:
                value = c["heuristics"][0 if state == "R" else "ABC".index(state) + 1]
            category = "terminal" if terminal else "cutoff"
            stats["evaluations"] += 1
            stats[category + "_evaluations"] += 1
            trace.append({"event": "evaluate", "id": node_id, "kind": category, "value": value})
            return value, None

        if kind == "tree":
            children = [(x, x, x) for x in (list("ABC") if state == "R" else [state + "1", state + "2"])]
        else:
            children = [(a, apply_move(state, a), f"{a[0]}:{a[1]}") for a in legal_moves(state)]
        if c["reverse"]:
            children.reverse()
        initial_alpha, initial_beta = alpha, beta
        value = -float("inf") if player == 1 else float("inf")
        best_action = None
        for index, (action, child, token) in enumerate(children):
            score, _ = visit(child, -player, depth + 1, node_id + "/" + token, alpha, beta)
            # 厳密な不等号で、同点時は最初の手を保持する。
            if best_action is None or (score > value if player == 1 else score < value):
                value, best_action = score, action
            if ab:
                if player == 1:
                    alpha = max(alpha, value)
                else:
                    beta = min(beta, value)
            trace.append({"event": "update", "id": node_id, "action": action, "value": value,
                          "alpha": bound_number(alpha), "beta": bound_number(beta)})
            if ab and alpha >= beta:
                skipped = [node_id + "/" + x[2] for x in children[index + 1:]]
                if skipped:
                    pruned.extend(skipped)
                    trace.append({"event": "prune", "id": node_id, "skipped": skipped,
                                  "value": value, "bound": "lower" if player == 1 else "upper"})
                break
        certainty = "upper" if ab and value <= initial_alpha else "lower" if ab and value >= initial_beta else "exact"
        trace.append({"event": "return", "id": node_id, "value": value, "bound": certainty})
        return value, best_action

    value, action = visit("R" if kind == "tree" else c["piles"], c["player"], 0, "R", -float("inf"), float("inf"))
    return {"value": value, "best_action": action, **stats, "pruned": pruned, "trace": trace}


def search_tree(config=None):
    return _search(_config({} if config is None else config, "tree"), "tree")


def search_nim(config=None):
    return _search(_config({} if config is None else config, "nim"), "nim")


def summary(result):
    """基準JSONには値と計数を保存。完全な探索履歴は各result['trace']に残す。"""
    return {key: deepcopy(value) for key, value in result.items() if key != "trace"}


def experiment_configs():
    """六つの独立変更。各ケースの基準をコピーして一項目だけ変える。"""
    cases = {}
    for name in ("leaf", "order", "depth", "heuristic", "piles", "algorithm"):
        kind = "nim" if name == "piles" else "tree"
        base = deepcopy(NIM_BASE if kind == "nim" else TREE_BASE)
        if name == "order":
            base["algorithm"] = "alphabeta"
        if name == "heuristic":
            base["depth"] = 1
        changed = deepcopy(base)
        if name == "leaf": changed["leaves"][2] = 6
        if name == "order": changed["reverse"] = True
        if name == "depth": changed["depth"] = 1
        if name == "heuristic": changed["heuristics"][1] = 5
        if name == "piles": changed["piles"] = [2, 2]
        if name == "algorithm": changed["algorithm"] = "alphabeta"
        cases[name] = {"kind": kind, "base": base, "changed": changed}
    return cases


def demo():
    changes = {}
    for key, case in experiment_configs().items():
        run = search_nim if case["kind"] == "nim" else search_tree
        changes[key] = {"before": summary(run(case["base"])), "after": summary(run(case["changed"]))}
    return {"tree": summary(search_tree()), "alphabeta": summary(search_tree({"algorithm": "alphabeta"})),
            "cutoff": summary(search_tree({"depth": 1})), "nim": summary(search_nim()), "changes": changes}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true", help="基準例と6変更を実行")
    parser.add_argument("--json", action="store_true", help="検査用JSONを出力")
    parser.add_argument("--trace", action="store_true", help="基準木とニムの完全な探索履歴も出力")
    args = parser.parse_args()
    result = demo()
    if args.trace:
        result["full_searches"] = {"tree": search_tree(), "nim": search_nim(),
                                  "alphabeta": search_tree({"algorithm": "alphabeta"})}
    if not args.json:
        print("基準：固定木は値3・手A、ニム(3,2)は値+1・左から1個。値はMAX側の視点です。")
        print("訪問数と評価数を比べ、各変更のbefore / afterを説明してください。")
    print(json.dumps(result, ensure_ascii=False, indent=2))



def lesson_moves(piles=(3,2)):
    rows = []
    for action in legal_moves(piles):
        after = apply_move(piles,action)
        rows.append((list(piles),action[0],action[1],after))
    result = search_nim({'piles':list(piles)})
    return {'title':'局面から合法手を作る','question':'1回に両方の山から取れるか',
            'input':list(piles),'columns':['元の山','選ぶ山番号','取る個数','次の局面'],'rows':rows,
            'result':summary(result),'comparison':'(3,2)→(2,2)にすると合法手と勝敗を比べられる。',
            'explanation':'一つの山から1個以上取る。山番号は0始まり。利得はMAX側から見て勝ち+1・負け−1。探索は学習ではない。',
            'reset':'piles=(3,2)に戻す。元の局面を変更せず探索する。'}


def lesson_minimax(leaf_b1=2):
    config = deepcopy(TREE_BASE)
    config['leaves'][2] = leaf_b1
    result = search_tree(config)
    rows = []
    for event in result['trace']:
        if event['event'] in ('evaluate','update','return'):
            rows.append((event['event'],event['id'],event.get('action','—'),event['value'],event.get('bound','—')))
    return {'title':'葉からMIN、MINからMAXへ値を戻す','question':'最も大きい葉9の枝を選べばよいか',
            'input':config['leaves'],'columns':['処理','節点','調べた子','現在値','値の確かさ'],'rows':rows,
            'tables':[('木の親子関係',['親・役割','子1','子2'],[(name+' MIN',config['leaves'][2*i],config['leaves'][2*i+1]) for i,name in enumerate('ABC')])],
            'result':summary(result),'comparison':'B1を2→6にすると、BでMINが返す値は2→6、根の選択もA→Bになる。',
            'explanation':'根RはMAX、A・B・CはMIN。相手が小さい値を選ぶことを織り込む。updateは調査済みの子だけの暫定値、returnはその探索の返却値。',
            'reset':'leaf_b1=2で再実行。'}


def lesson_depth(depth=2):
    result = search_tree({'depth':depth})
    rows = [(e['id'],e['kind'],e['value']) for e in result['trace'] if e['event']=='evaluate']
    return {'title':'終端の利得と途中の評価値を区別する','question':'浅く読むと同じ手を選ぶか',
            'input':f'深さ={depth}、途中評価R,A,B,C={TREE_BASE["heuristics"]}',
            'columns':['評価する節点','terminal=終端 / cutoff=打切り','値'],'rows':rows,
            'result':summary(result),'comparison':'深さ2では手A・値3、深さ1では手B・推定値4。',
            'explanation':'深さ1の値は葉まで読んだ確定利得ではなく、指定した評価関数の推定値。深く読めば常に現実の最善が保証されるという例ではない。',
            'reset':'depth=2で再実行。'}


def lesson_alphabeta(reverse=False):
    result = search_tree({'algorithm':'alphabeta','reverse':reverse})
    rows = []
    bounds = {}
    for event in result['trace']:
        node = event['id']
        if event['event'] in ('enter','update'):
            bounds[node] = (event['alpha'],event['beta'])
        alpha,beta = bounds.get(node,('—','—'))
        reason = ''
        if event['event']=='prune':
            reason = f'α={alpha} ≥ β={beta}。未訪問 {event["skipped"]} は根の選択を改善しない。'
        rows.append((event['event'],node,event.get('value','—'),alpha,beta,event.get('bound','—'),reason))
    full = search_tree({'reverse':reverse})
    return {'title':'αとβが出会ったら、その先を省略する','question':'省略した葉の値を計算済みと言えるか',
            'input':f'同じ木、子の順序を逆にする={reverse}',
            'columns':['処理','節点','値','α: MAXの下限','β: MINの上限','返却値の種別','省略の理由'],'rows':rows,
            'tables':[('全探索と比較',['方式','根の値','選んだ手','評価した葉数','省略'],[('minimax',full['value'],full['best_action'],full['evaluations'],full['pruned']),('αβ',result['value'],result['best_action'],result['evaluations'],result['pruned'])])],
            'result':summary(result),'comparison':'reverse=Trueでも根の値は3。評価数と省略位置は探索順に依存する。',
            'explanation':'upperは上限、lowerは下限、exactは確定値。枝刈りの返却値をすべて厳密値と読まない。-inf/+infはまだ制約のない境界。',
            'reset':'reverse=Falseで再実行。探索履歴も初めから作る。'}

STUDY_THEMES = {'moves': lesson_moves, 'minimax': lesson_minimax, 'depth': lesson_depth, 'alphabeta': lesson_alphabeta}

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
