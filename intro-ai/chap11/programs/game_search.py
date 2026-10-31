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
    return [[i, take] for i, n in enumerate(piles) for take in range(1, n + 1)]


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


if __name__ == "__main__":
    main()
