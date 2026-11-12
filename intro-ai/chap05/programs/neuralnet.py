"""第6回：順方向計算・勾配・系列の状態・SOMの1回の更新を観察する。

実行: python neuralnet.py --demo
標準ライブラリのみ。入力は教材用の固定値で、外部データ・乱数なし。
旧chap05/neuralnet.pyの表5.Aを採用し、しきい値の処理位置を修正。
各処理は仕組みの最小例で、実データでの訓練・性能評価ではない。
"""
import argparse
import json
import math


INPUTS = ((0, 0), (0, 1), (1, 0), (1, 1))
HIDDEN_WEIGHTS = ((-2, 3), (-2, 1))
HIDDEN_THRESHOLDS = (-1, 0.5)
OUTPUT_WEIGHTS = (-60, 94)
OUTPUT_THRESHOLD = -1


def step(u):
    """本教材では境界u=0も1とする。"""
    return int(u >= 0)


def sigmoid(u):
    """大きな正負の値でもexpがオーバーフローしない形。"""
    if u >= 0:
        return 1 / (1 + math.exp(-u))
    e = math.exp(u)
    return e / (1 + e)


def relu(u):
    return max(0, u)


def softmax(scores):
    """最大値を引いてから指数関数を計算する。空列は受け付けない。"""
    if not scores:
        raise ValueError("scores must not be empty")
    maximum = max(scores)
    exponentials = [math.exp(score - maximum) for score in scores]
    total = sum(exponentials)
    return [value / total for value in exponentials]


def neuron(inputs, weights, threshold, record=None):
    """重み付き和を完成させてから、しきい値を一度だけ引く。"""
    if len(inputs) != len(weights):
        raise ValueError("input and weight lengths differ")
    products = []
    for index, (value, weight) in enumerate(zip(inputs, weights)):
        product = value * weight
        products.append(product)
        if record is not None:
            record.append((index, value, weight, product))
    u = sum(products) - threshold
    return u, step(u)


def forward(inputs, hidden_thresholds=HIDDEN_THRESHOLDS):
    """固定の2入力・中間2個・出力1個。途中の値も返す（学習なし）。"""
    if len(inputs) != 2 or len(hidden_thresholds) != 2:
        raise ValueError("this teaching network needs two inputs and thresholds")
    hidden_pairs = [neuron(inputs, weights, threshold)
                    for weights, threshold in zip(HIDDEN_WEIGHTS, hidden_thresholds)]
    hidden = [pair[1] for pair in hidden_pairs]
    output_u, output = neuron(hidden, OUTPUT_WEIGHTS, OUTPUT_THRESHOLD)
    return {"input": list(inputs), "hidden_u": [pair[0] for pair in hidden_pairs],
            "hidden": hidden, "output_u": output_u, "output": output}


def gradient_step(x=2, target=3, weight=2, rate=0.125):
    """o=w*x, L=(o-target)^2/2 の1回の勾配降下（バイアスなし）。"""
    output = weight * x
    gradient = (output - target) * x
    new_weight = weight - rate * gradient
    new_output = new_weight * x
    return {"weight_before": weight, "output_before": output,
            "loss_before": (output - target) ** 2 / 2,
            "gradient": gradient, "rate": rate, "weight_after": new_weight,
            "output_after": new_output, "loss_after": (new_output - target) ** 2 / 2}


def chain_step(x=1, target=4, a=2, b=3, rate=0.125):
    """h=a*x, o=b*h。両勾配を更新前のa,bから求めた後、同時更新する。"""
    hidden = a * x
    output = b * hidden
    error = output - target
    grad_b = error * hidden
    grad_a = error * b * x
    new_a, new_b = a - rate * grad_a, b - rate * grad_b
    new_output = new_b * (new_a * x)
    return {"hidden_before": hidden, "output_before": output,
            "loss_before": error ** 2 / 2, "grad_a": grad_a, "grad_b": grad_b,
            "a_after": new_a, "b_after": new_b, "output_after": new_output,
            "loss_after": (new_output - target) ** 2 / 2}


def recurrent_states(sequence, recurrent_weight=0.5, initial_state=0, record=None):
    """h_t=ReLU(x_t+r*h_(t-1))。呼び出すたび初期状態から開始する。"""
    state = initial_state
    states = []
    for time, x in enumerate(sequence):
        previous = state
        carried = recurrent_weight * previous
        total = x + carried
        state = relu(total)
        states.append(state)
        if record is not None:
            record.append((time, x, previous, recurrent_weight, carried, total, state))
    return states


def som_step(sample, prototypes, rate=0.5, neighbor_factor=0.5):
    """1次元の地図を1回更新。勝者と隣接ノードのみ入力へ近づける。

    入力空間は任意次元。地図上の隣接はリストの番号の差が1。
    同距離なら先の番号を勝者とする。元の配列を変更しない。
    """
    if not sample or not prototypes or any(len(p) != len(sample) for p in prototypes):
        raise ValueError("nonempty vectors of the same dimension are required")
    if not 0 <= rate <= 1 or not 0 <= neighbor_factor <= 1:
        raise ValueError("rate and neighbor_factor must be between 0 and 1")
    distances = [sum((x - w) ** 2 for x, w in zip(sample, p)) for p in prototypes]
    winner = min(range(len(prototypes)), key=lambda i: distances[i])
    updated = []
    for index, prototype in enumerate(prototypes):
        factor = 1 if index == winner else neighbor_factor if abs(index - winner) == 1 else 0
        updated.append([w + rate * factor * (x - w) for x, w in zip(sample, prototype)])
    return {"winner": winner, "squared_distances": distances, "updated": updated}


def demo_result():
    """照合用。超越関数の結果だけ小数6桁へ丸めて表示する。"""
    return {
        "forward": [forward(x) for x in INPUTS],
        "activations": [{"u": u, "step": step(u), "sigmoid": round(sigmoid(u), 6),
                         "relu": relu(u)} for u in (-2, 0, 2)],
        "softmax_equal": softmax([0, 0]),
        "gradient": gradient_step(),
        "gradient_large_rate": gradient_step(rate=1),
        "chain": chain_step(),
        "rnn_10": recurrent_states([1, 0]),
        "rnn_01": recurrent_states([0, 1]),
        "rnn_no_recurrence": recurrent_states([1, 0], recurrent_weight=0),
        "som": som_step([1, 0], [[0, 0], [2, 2], [4, 0]]),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true", help="固定例を実行する")
    parser.add_argument("--json", action="store_true", help="照合用JSONだけを表示する")
    args = parser.parse_args()
    result = demo_result()
    if args.json:
        print(json.dumps(result, ensure_ascii=False))
        return
    print("固定ネットワークの順方向計算（学習なし）")
    for row in result["forward"]:
        print(row["input"], "→ 中間", row["hidden"], "→ 出力", row["output"])
    print("1回の重み更新: 損失", result["gradient"]["loss_before"], "→", result["gradient"]["loss_after"])
    print("大きな学習率: 損失", result["gradient_large_rate"]["loss_after"])
    print("2段の計算の同時更新:", result["chain"])
    print("RNN [1,0]の状態:", result["rnn_10"], "/ [0,1]の状態:", result["rnn_01"])
    print("SOMの1回の更新:", result["som"])
    print("全結果を照合するには --demo --json を指定します。")



def lesson_forward(inputs=(0,1)):
    tables, rows = [],[]
    for index,(weights,threshold) in enumerate(zip(HIDDEN_WEIGHTS,HIDDEN_THRESHOLDS)):
        products=[]
        u,h=neuron(inputs,weights,threshold,record=products)
        tables.append((f'中間{index}への積',['入力番号','入力値','重み','積'],products))
        rows.append((f'中間{index}',sum(r[3] for r in products),threshold,u,h))
    result=forward(inputs)
    products=[]
    u,o=neuron(result['hidden'],OUTPUT_WEIGHTS,OUTPUT_THRESHOLD,record=products)
    tables.append(('中間から出力への積',['中間番号','中間の出力','重み','積'],products))
    rows.append(('出力',sum(r[3] for r in products),OUTPUT_THRESHOLD,u,o))
    return {'title':'入力×重み→合計−しきい値→出力','question':'しきい値は各入力で毎回引くか',
            'input':list(inputs),'columns':['ニューロン','積の合計','しきい値','引いた後u','u≥0なら1'],'rows':rows,'tables':tables,
            'result':result,'comparison':'入力(0,1)→(1,1)で中間の値と最終出力を比較する。',
            'explanation':'全入力の積を足してから、しきい値を一度だけ引く。この固定ネットワークの観察では重みは学習していない。',
            'reset':'inputs=(0,1)で再実行。'}


def lesson_activation(u=-2):
    rows = [(x,step(x),sigmoid(x),relu(x)) for x in [u,0,2]]
    return {'title':'同じuを異なる活性化関数へ渡す','question':'負の値は全ての関数で0になるか',
            'input':f'変更するu={u}。0と2を比較用に併記。',
            'columns':['u','step','sigmoid','ReLU'],'rows':rows,
            'result':{'選択u':u,'step':step(u),'sigmoid':sigmoid(u),'ReLU':relu(u)},
            'comparison':'uを−2→1へ変更。sigmoidは−2でも0より大きい。',
            'explanation':'このstepは境界0を1にする。ReLUは負を0、正をそのまま。sigmoidは滑らかに0〜1へ写す。',
            'reset':'u=-2で再実行。'}


def lesson_gradient(rate=0.125):
    r=gradient_step(rate=rate)
    rows=[('予測',2,2,'w×x',r['output_before']),('損失',r['output_before'],3,'(出力−正解)^2/2',r['loss_before']),('勾配',r['output_before']-3,2,'誤差×x',r['gradient']),('更新',2,rate,'w−学習率×勾配',r['weight_after']),('更新後予測',r['weight_after'],2,'新w×x',r['output_after']),('更新後損失',r['output_after'],3,'(出力−正解)^2/2',r['loss_after'])]
    return {'title':'1個の重みを1回だけ更新する','question':'学習率を大きくすると必ず良くなるか',
            'input':f'x=2、正解3、初期w=2、学習率={rate}',
            'columns':['段階','使う値1','使う値2','処理','結果'],'rows':rows,
            'result':r,'comparison':'学習率0.125では損失0.5→0.125、1では0.5→4.5。',
            'explanation':'勾配の符号と反対に重みを動かす。大きすぎる更新は目標を行き過ぎる。このセルを再実行しても初期wから1回だけ。',
            'reset':'rate=0.125で再実行。'}


def lesson_chain(rate=0.125):
    r=chain_step(rate=rate)
    return {'title':'2段の計算で勾配を伝える','question':'aを先に変えた値でbの勾配を求めてよいか',
            'input':f'x1、正解4、a2、b3、h=a×x、o=b×h、学習率{rate}',
            'columns':['重み','更新前','勾配の計算','勾配','更新後'],'rows':[('a',2,'(6−4)×3×1',r['grad_a'],r['a_after']),('b',3,'(6−4)×2',r['grad_b'],r['b_after'])],
            'result':r,'comparison':'rate=0ではa・bと損失が変わらない。',
            'explanation':'両勾配は更新前のa・bから求め、その後で同時に更新する。途中hが入力側の重みと出力側をつなぐ。',
            'reset':'rate=0.125で再実行。a2・b3から開始。'}


def lesson_rnn(recurrent_weight=0.5):
    rows=[]
    states=recurrent_states([1,0],recurrent_weight,record=rows)
    reverse=recurrent_states([0,1],recurrent_weight)
    return {'title':'前の状態を次の時刻へ渡す','question':'同じ0と1でも順序で変わるか',
            'input':f'系列[1,0]、初期状態0、再帰重み={recurrent_weight}',
            'columns':['時刻0始まり','今の入力','前の状態','再帰重み','残る値','合計','ReLU後の状態'],'rows':rows,
            'tables':[('順序比較',['入力列','各時刻の状態'],[('[1,0]',states),('[0,1]',reverse)])],
            'result':states,'comparison':'再帰重み0では、前の状態を次へ引き継がない。',
            'explanation':'同じ関数を時間順に使う。通常の層方向の計算と時間方向の状態更新を区別する。',
            'reset':'recurrent_weight=0.5で再実行。状態は毎回0に戻る。'}


def lesson_som(rate=0.5):
    sample=[1,0];prototypes=[[0,0],[2,2],[4,0]]
    r=som_step(sample,prototypes,rate=rate)
    rows=[]
    for i,(before,after,distance) in enumerate(zip(prototypes,r['updated'],r['squared_distances'])):
        role='勝者' if i==r['winner'] else '地図上の隣' if abs(i-r['winner'])==1 else '対象外'
        rows.append((i,before,distance,role,after))
    return {'title':'入力に近い代表点とその隣を動かす','question':'全ての代表点を同じだけ動かすか',
            'input':f'入力{sample}、代表点{prototypes}、学習率{rate}',
            'columns':['地図番号','更新前座標','距離の二乗','役割','更新後座標'],'rows':rows,
            'result':r,'comparison':'学習率0では勝者を選ぶが座標は変わらない。',
            'explanation':'距離は入力空間の座標で計算し、隣接は地図番号の差1で決める。勝者は率1、隣は率0.5を学習率へ掛けて入力へ近づける。',
            'reset':'rate=0.5で再実行。代表点を新しく作る。'}

STUDY_THEMES = {'forward': lesson_forward, 'activation': lesson_activation, 'gradient': lesson_gradient, 'chain': lesson_chain, 'rnn': lesson_rnn, 'som': lesson_som}

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
