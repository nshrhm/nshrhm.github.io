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


def fit_threshold(train, record=None):
    """学習誤り最小のしきい値を学習。同点は小さいしきい値を採用。"""
    validate_rows(train)
    values = sorted({x for _, x, _ in train})
    candidates = [Fraction(values[0] - 1)]
    candidates += [Fraction(a + b, 2) for a, b in zip(values, values[1:])]
    candidates += [Fraction(values[-1] + 1)]
    scored = []
    for candidate in candidates:
        errors = 0
        for _, feature, label in train:
            predicted = int(feature >= candidate)
            errors += predicted != label
        scored.append((errors, candidate))
        if record is not None:
            record.append((candidate, errors, len(train)-errors))
    _, threshold = min(scored)
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



def lesson_splits(part='training'):
    splits = {'training':TRAIN,'validation':VALIDATION,'test':TEST}
    roles = {'training':'モデルを作る','validation':'モデルを選ぶ','test':'選択後に評価する'}
    rows = [(part,*row,roles[part]) for row in splits[part]]
    return {'title':'どの事例を何に使うか','question':'テストを見てモデルを選び直してよいか',
            'input':part,'columns':['区分','ID','特徴','正解','使い道'],'rows':rows,
            'tables':[('全体の分割',['区分','件数','ID','役割'],[(key,len(value),[r[0] for r in value],roles[key]) for key,value in splits.items()])],
            'result':'学習8件→検証4件で選択→テスト4件で評価。IDに重複なし。',
            'comparison':'partをtraining→testで、モデルを作る事例と未知評価の事例を比べる。',
            'explanation':'ラベルは学習や答え合わせに使う。predictへ渡すのは特徴だけ。IDが異なるだけで漏洩が完全に防げるわけではない。',
            'reset':'part="training"で再実行。'}


def lesson_threshold(label_tr03=1):
    train = [tuple(row) for row in TRAIN]
    train[2] = (train[2][0],train[2][1],label_tr03)
    trace = []
    model = fit_threshold(train,record=trace)
    rows = [(str(t),errors,correct,'採用' if t==model['threshold'] else '') for t,errors,correct in trace]
    return {'title':'候補のしきい値を実際に比較する','question':'学習データを全部正解にできるか',
            'input':train,'columns':['しきい値候補','誤り数/8','正解数/8','選択'],'rows':rows,
            'result':str(model['threshold']),'comparison':'tr03の正解を1→0に変えると、学習誤りは1→0。原データは保持。',
            'explanation':'予測は特徴≥しきい値なら1。隣り合う特徴の中点と両端の候補を調べ、誤りが最少、同点なら小さいしきい値を選ぶ。',
            'reset':'label_tr03=1で再実行。TRAINのコピーから開始。'}


def lesson_predictions(model_name='threshold'):
    model = fit_threshold(TRAIN) if model_name=='threshold' else fit_memory(TRAIN)
    rows = []
    for part,data in [('学習',TRAIN),('検証',VALIDATION),('テスト',TEST)]:
        score = evaluate(model,data)
        for row,predicted in zip(data,score['predictions']):
            rows.append((part,row[0],row[1],predicted,row[2],predicted==row[2]))
    return {'title':'予測してから正解と照合する','question':'記憶した事例での全問正解は未知にも通じるか',
            'input':f'モデル={model_name}、学習データのみから作成。',
            'columns':['区分','ID','渡す特徴','予測','正解','一致'],'rows':rows,
            'result':{name:evaluate(model,data) for name,data in [('学習',TRAIN),('検証',VALIDATION),('テスト',TEST)]},
            'comparison':'threshold→memoryで学習は7/8→8/8、検証は3/4→2/4。',
            'explanation':'未知の特徴を記憶モデルは多数派1で予測する。学習の正解数だけで良さを判断しない。',
            'reset':'model_name="threshold"で再実行。'}


def lesson_selection(validation_label=0):
    validation = list(VALIDATION)
    validation[0] = (validation[0][0],validation[0][1],validation_label)
    result = run_experiment(validation=validation)
    rows = []
    for name,scores in result['models'].items():
        for part in ('training','validation','test'):
            s=scores[part]
            rows.append((name,part,s['correct'],s['total'],s['correct']/s['total']))
    return {'title':'検証で選択を確定してからテスト','question':'どの正解数を選択に使ったか',
            'input':f'検証va01のラベル={validation_label}、テストは固定。',
            'columns':['モデル','区分','正解数','分母','正解率'],'rows':rows,
            'result':{'選んだモデル':result['selected_model'],'選択後のテスト':result['selected_test']},
            'comparison':'検証ラベルを変えてもテストデータを使ってモデルを選び直さない。',
            'explanation':'両モデルのテスト結果は比較教材として表示するが、選択処理choose_modelは検証スコアだけを受け取る。',
            'reset':'validation_label=0で再実行。検証データをコピーから戻す。'}

STUDY_THEMES = {'splits': lesson_splits, 'threshold': lesson_threshold, 'predictions': lesson_predictions, 'selection': lesson_selection}

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
        parser = argparse.ArgumentParser(description=__doc__)
        parser.add_argument('--demo', action='store_true', help='固定例を実行（通常実行も同じ）')
        parser.add_argument('--json', action='store_true', help='照合用のJSONを表示')
        arguments = parser.parse_args()
        baseline = run_experiment()
        if arguments.json:
            print(json.dumps(baseline, ensure_ascii=False, indent=2))
        else:
            print_result(baseline)
