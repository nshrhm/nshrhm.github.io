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


def neuron(inputs, weights, threshold):
    """重み付き和を完成させてから、しきい値を一度だけ引く。"""
    if len(inputs) != len(weights):
        raise ValueError("input and weight lengths differ")
    u = sum(x * w for x, w in zip(inputs, weights)) - threshold
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


def recurrent_states(sequence, recurrent_weight=0.5, initial_state=0):
    """h_t=ReLU(x_t+r*h_(t-1))。呼び出すたび初期状態から開始する。"""
    state = initial_state
    states = []
    for x in sequence:
        state = relu(x + recurrent_weight * state)
        states.append(state)
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


if __name__ == "__main__":
    main()
