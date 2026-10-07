"""第3回：学習・検証・テストを分けて分類を比較する（標準ライブラリ）。"""
import argparse
from fractions import Fraction
import json


# 授業用の架空データ。行は (ID, 整数の特徴, 0/1のラベル)。
TRAIN = (
    ("tr01", 10, 0), ("tr02", 20, 0), ("tr03", 30, 1), ("tr04", 40, 0),
    ("tr05", 60, 1), ("tr06", 70, 1), ("tr07", 80, 1), ("tr08", 90, 1),
)
VALIDATION = (
    ("va01", 15, 0), ("va02", 35, 0), ("va03", 65, 1), ("va04", 85, 1),
)
TEST = (
    ("te01", 5, 0), ("te02", 25, 0), ("te03", 75, 1), ("te04", 95, 1),
)


def validate_rows(rows):
    """この教材の入力条件を確認する。ラベルの正しさ自体は保証しない。"""
    if not rows:
        raise ValueError("データは1件以上必要です")
    ids = set()
    for row in rows:
        if len(row) != 3:
            raise ValueError("各行は (ID, 特徴, ラベル) にしてください")
        identifier, feature, label = row
        if not isinstance(identifier, str) or not identifier or identifier in ids:
            raise ValueError("IDは空でない文字列で、重複しないようにしてください")
        if type(feature) is not int or type(label) is not int or label not in (0, 1):
            raise ValueError("特徴は整数、ラベルは整数の0または1にしてください")
        ids.add(identifier)


def validate_splits(train, validation, test):
    """同じIDの使い回しを検出する。別IDの類似データ漏洩は別途点検が必要。"""
    seen = set()
    for rows in (train, validation, test):
        validate_rows(rows)
        ids = {row[0] for row in rows}
        if seen & ids:
            raise ValueError("学習・検証・テストで同じIDを使わないでください")
        seen.update(ids)


def fit_threshold(train):
    """学習誤り最小のしきい値を学習。同点は小さいしきい値を採用。"""
    validate_rows(train)
    values = sorted({x for _, x, _ in train})
    candidates = [Fraction(values[0] - 1)]
    candidates += [Fraction(a + b, 2) for a, b in zip(values, values[1:])]
    candidates += [Fraction(values[-1] + 1)]
    threshold = min(candidates, key=lambda t: (
        sum(int(x >= t) != label for _, x, label in train), t,
    ))
    return {"threshold": threshold}


def fit_memory(train):
    """特徴とラベルを記憶。未知の特徴は学習多数派、同数なら0。"""
    validate_rows(train)
    labels = {}
    for _, x, label in train:
        if x in labels and labels[x] != label:
            raise ValueError("記憶モデルでは同じ特徴に相反するラベルを記憶できません")
        labels[x] = label
    ones = sum(label for _, _, label in train)
    return {"labels": labels, "fallback": int(ones > len(train) - ones)}


def predict(model, feature):
    """入力の特徴だけから予測。正解ラベルは受け取らない。"""
    if type(feature) is not int:
        raise ValueError("予測する特徴は整数にしてください")
    if "threshold" in model:
        return int(feature >= model["threshold"])
    return model["labels"].get(feature, model["fallback"])


def evaluate(model, rows):
    """予測してからラベルと比較。正解数と総数をそのまま返す。"""
    validate_rows(rows)
    predictions = [predict(model, x) for _, x, _ in rows]
    correct = sum(prediction == row[2] for prediction, row in zip(predictions, rows))
    return {"predictions": predictions, "correct": correct, "total": len(rows)}


def choose_model(validation_scores):
    """検証結果で選択。同点ならthreshold。テスト結果は受け取らない。"""
    def accuracy(name):
        score = validation_scores[name]
        return Fraction(score["correct"], score["total"])
    return "threshold" if accuracy("threshold") >= accuracy("memory") else "memory"


def run_experiment(train=TRAIN, validation=VALIDATION, test=TEST):
    """学習→検証で選択→固定してテスト。原データは変更しない。"""
    validate_splits(train, validation, test)
    models = {"threshold": fit_threshold(train), "memory": fit_memory(train)}
    scores = {name: {
        "training": evaluate(model, train),
        "validation": evaluate(model, validation),
    } for name, model in models.items()}
    selected = choose_model({name: score["validation"] for name, score in scores.items()})
    # 選択を確定した後、比較教材として両モデルのテスト結果を表示する。
    # この表示を見てモデルや設定を選び直さない。
    for name, model in models.items():
        scores[name]["test"] = evaluate(model, test)
    scores["threshold"]["threshold"] = str(models["threshold"]["threshold"])
    scores["memory"]["fallback"] = models["memory"]["fallback"]
    return {
        "data": {"training": [list(row) for row in train],
                 "validation": [list(row) for row in validation],
                 "test": [list(row) for row in test]},
        "models": scores,
        "selected_model": selected,
        "selected_test": scores[selected]["test"],
    }


def print_result(result):
    names = {"threshold": "しきい値モデル", "memory": "記憶モデル"}
    print("架空の固定データ：学習8件・検証4件・テスト4件")
    print("学習したしきい値:", result["models"]["threshold"]["threshold"])
    for name, scores in result["models"].items():
        parts = [f"{title} {scores[key]['correct']}/{scores[key]['total']}"
                 for key, title in (("training", "学習"), ("validation", "検証"), ("test", "テスト"))]
        print(names[name] + ": " + " / ".join(parts))
    print("検証で選択:", names[result["selected_model"]])
    print("テスト結果を見て選び直さず、未知のデータでの限界を読みます。")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true", help="固定例を実行（通常実行も同じ）")
    parser.add_argument("--json", action="store_true", help="照合用のJSONを表示")
    arguments = parser.parse_args()
    baseline = run_experiment()
    if arguments.json:
        print(json.dumps(baseline, ensure_ascii=False, indent=2))
    else:
        print_result(baseline)
