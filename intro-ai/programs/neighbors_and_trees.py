"""第4回：k近傍法・1段の決定木・多数決を固定した架空データで観察する。

Python標準ライブラリのみ。距離の二乗・Gini不純度はFractionで厳密に計算。
ランダムフォレストやSVMを実装したプログラムではありません。
"""
import argparse
from collections import Counter
from fractions import Fraction
import json


# ID、特徴x、特徴y、正解ラベル。実物の測定値ではない。
TRAIN = (("T1", 0, 0, "A"), ("T2", 0, 2, "A"),
         ("T3", 2, 0, "A"), ("T4", 2, 2, "B"),
         ("T5", 6, 6, "B"), ("T6", 6, 8, "B"), ("T7", 8, 6, "B"))
VALIDATION = (("V1", 2, 3, "A"), ("V2", 3, 2, "A"),
              ("V3", 7, 7, "B"), ("V4", 8, 8, "B"))
TEST = (("E1", 1, 1, "A"), ("E2", 3, 3, "A"),
        ("E3", 7, 6, "B"), ("E4", 6, 7, "B"))
QUERY = (2, 3)


def validate_rows(rows):
    if not rows:
        raise ValueError("データは1件以上必要です")
    ids = []
    for row in rows:
        if len(row) != 4:
            raise ValueError("行はID・x・y・ラベルの4項目です")
        identity, x, y, label = row
        if not isinstance(identity, str) or not identity:
            raise ValueError("IDは空でない文字列です")
        if type(x) is not int or type(y) is not int or label not in ("A", "B"):
            raise ValueError("特徴は整数、ラベルはAまたはBです")
        ids.append(identity)
    if len(ids) != len(set(ids)):
        raise ValueError("IDが重複しています")


def validate_point(point):
    if len(point) != 2 or any(type(value) is not int for value in point):
        raise ValueError("入力は整数の特徴2個です")


def majority(labels):
    if not labels or any(label not in ("A", "B") for label in labels):
        raise ValueError("投票は1票以上、AまたはBです")
    counts = Counter(labels)
    # 同票ならA。この教材の規約であり、普遍的な規則ではない。
    return min(counts, key=lambda label: (-counts[label], label))


def nearest(train, point, k, scales=(1, 1)):
    validate_rows(train)
    validate_point(point)
    if type(k) is not int or not 1 <= k <= len(train):
        raise ValueError("kは1以上、学習件数以下の整数です")
    if len(scales) != 2 or any(type(s) is not int or s <= 0 for s in scales):
        raise ValueError("尺度は正の整数2個です")
    ranked = []
    for identity, x, y, label in train:
        d2 = Fraction((x - point[0]) ** 2, scales[0] ** 2)
        d2 += Fraction((y - point[1]) ** 2, scales[1] ** 2)
        ranked.append((d2, identity, label))
    # 距離が等しい場合はID順。元のTRAINを書き換えない。
    return sorted(ranked)[:k]


def predict_knn(train, point, k, scales=(1, 1)):
    return majority([label for _, _, label in nearest(train, point, k, scales)])


def gini(rows):
    validate_rows(rows)
    counts = Counter(row[3] for row in rows)
    return 1 - sum(Fraction(n, len(rows)) ** 2 for n in counts.values())


def fit_stump(train):
    """候補の加重Giniが最小となる1回の分岐を学習側だけで選ぶ。"""
    validate_rows(train)
    base = majority([row[3] for row in train])
    candidates = []
    for axis in (0, 1):
        values = sorted({row[axis + 1] for row in train})
        for low, high in zip(values, values[1:]):
            threshold = Fraction(low + high, 2)
            left = [row for row in train if row[axis + 1] <= threshold]
            right = [row for row in train if row[axis + 1] > threshold]
            weighted = (len(left) * gini(left) + len(right) * gini(right)) / len(train)
            candidates.append((weighted, axis, threshold, left, right))
    if not candidates:
        return {"axis": None, "threshold": None, "left": base, "right": base,
                "weighted_gini": gini(train)}
    # 同じ不純度ならx優先、次に小さいしきい値。改善しなければ分岐しない。
    weighted, axis, threshold, left, right = min(candidates, key=lambda c: c[:3])
    if weighted >= gini(train):
        return {"axis": None, "threshold": None, "left": base, "right": base,
                "weighted_gini": gini(train)}
    return {"axis": axis, "threshold": threshold,
            "left": majority([r[3] for r in left]),
            "right": majority([r[3] for r in right]), "weighted_gini": weighted}


def predict_stump(model, point):
    validate_point(point)
    if model["axis"] is None or point[model["axis"]] <= model["threshold"]:
        return model["left"]
    return model["right"]


def evaluate(predictor, rows):
    validate_rows(rows)
    predictions = [predictor((r[1], r[2])) for r in rows]
    return {"predictions": predictions,
            "correct": sum(pred == row[3] for pred, row in zip(predictions, rows)),
            "total": len(rows)}


def choose_k(validation_scores):
    if not validation_scores:
        raise ValueError("検証結果が必要です")
    # 比較する候補は同じ検証データを使う。同成績なら小さいk。
    return min(validation_scores, key=lambda k: (
        -Fraction(validation_scores[k]["correct"], validation_scores[k]["total"]), k))


def run_experiment():
    for rows in (TRAIN, VALIDATION, TEST):
        validate_rows(rows)
    ids = [row[0] for rows in (TRAIN, VALIDATION, TEST) for row in rows]
    if len(ids) != len(set(ids)):
        raise ValueError("分割間でIDが重複しています")
    train_scores = {k: evaluate(lambda point: predict_knn(TRAIN, point, k), TRAIN)
                    for k in (1, 3)}
    validation_scores = {k: evaluate(lambda point: predict_knn(TRAIN, point, k), VALIDATION)
                         for k in (1, 3)}
    selected = choose_k(validation_scores)
    # テストはkを確定した後、選んだモデルだけに使う。
    test_score = evaluate(lambda point: predict_knn(TRAIN, point, selected), TEST)
    stump = fit_stump(TRAIN)
    votes = [predict_knn(TRAIN, QUERY, 1), predict_knn(TRAIN, QUERY, 3),
             predict_stump(stump, QUERY)]
    scale_rows = (("S1", 0, 3, "A"), ("S2", 2, 0, "B"))
    return {
        "data": {"train": [list(r) for r in TRAIN],
                 "validation": [list(r) for r in VALIDATION], "test": [list(r) for r in TEST]},
        "query": list(QUERY),
        "nearest3": [{"id": i, "distance_squared": str(d), "label": label}
                     for d, i, label in nearest(TRAIN, QUERY, 3)],
        "train_scores": {str(k): score for k, score in train_scores.items()},
        "validation_scores": {str(k): score for k, score in validation_scores.items()},
        "selected_k": selected, "selected_test": test_score,
        "stump": {**stump, "threshold": str(stump["threshold"]),
                  "weighted_gini": str(stump["weighted_gini"]),
                  "query_prediction": predict_stump(stump, QUERY)},
        "votes": votes, "vote_prediction": majority(votes),
        "scale_example": {"raw": predict_knn(scale_rows, (0, 0), 1),
                          "y_divided_by_3": predict_knn(scale_rows, (0, 0), 1, (1, 3))},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true", help="固定例を実行")
    parser.add_argument("--json", action="store_true", help="照合用JSONを表示")
    parser.add_argument("--query", nargs=2, type=int, metavar=("X", "Y"))
    parser.add_argument("--k", type=int, default=3)
    args = parser.parse_args()
    if args.query is not None:
        print("近傍:", [(str(d), i, label) for d, i, label in nearest(TRAIN, args.query, args.k)])
        print("予測:", predict_knn(TRAIN, args.query, args.k))
    else:
        result = run_experiment()
        if args.json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            print("入力:", result["query"], "近傍3件:", result["nearest3"])
            print("学習:", result["train_scores"])
            print("検証:", result["validation_scores"])
            print("選んだk:", result["selected_k"], "最終テスト:", result["selected_test"])
            print("1段決定木:", result["stump"])
            print("投票:", result["votes"], "→", result["vote_prediction"])
            print("尺度変更:", result["scale_example"])


if __name__ == "__main__":
    main()
