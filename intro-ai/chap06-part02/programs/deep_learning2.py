"""第8回：再構成・記憶・生成を小さな数値で観察する。標準ライブラリのみ。"""
import argparse
import copy
import json
import math

SEED = 65535
DATA = [[float(i == j) for j in range(5)] for i in range(5)]
REAL = [1.0, 2.0, 3.0]
NOISE = [-1.0, 0.0, 1.0]
GAN_INITIAL = {"a": 0.5, "b": -1.0, "w": 1.0, "d": 0.0}


def sigmoid(x):
    if x >= 0:
        return 1 / (1 + math.exp(-x))
    e = math.exp(x)
    return e / (1 + e)


def initial_autoencoder(seed=SEED):
    """JSでも再現できる32bit LCG。教材用で暗号用途ではない。"""
    state = seed
    def value():
        nonlocal state
        state = (1664525 * state + 1013904223) % (2 ** 32)
        return 2 * state / (2 ** 32) - 1
    return {"enc": [[value() for _ in range(6)] for _ in range(3)],
            "dec": [[value() for _ in range(4)] for _ in range(5)]}


def reconstruct(x, weights):
    if len(x) != 5:
        raise ValueError("入力は5個の数値です")
    hidden = [sigmoid(sum(w[j] * x[j] for j in range(5)) + w[5])
              for w in weights["enc"]]
    output = [sigmoid(sum(w[j] * hidden[j] for j in range(3)) + w[3])
              for w in weights["dec"]]
    return {"hidden": hidden, "output": output,
            "mse": sum((output[j] - x[j]) ** 2 for j in range(5)) / 5}


def ae_loss(weights, data=DATA):
    return sum(reconstruct(x, weights)["mse"] for x in data) / len(data)


def ae_gradient(weights, data=DATA):
    grad = {k: [[0.0 for _ in row] for row in rows] for k, rows in weights.items()}
    for x in data:
        r = reconstruct(x, weights)
        h, y = r["hidden"], r["output"]
        dy = [2 * (y[k] - x[k]) * y[k] * (1 - y[k]) / (5 * len(data))
              for k in range(5)]
        # 出力側も中間層側も、更新前の同じ重みから勾配を計算する。
        dh = [sum(dy[k] * weights["dec"][k][j] for k in range(5)) * h[j] * (1 - h[j])
              for j in range(3)]
        for k in range(5):
            for j in range(4):
                grad["dec"][k][j] += dy[k] * (h[j] if j < 3 else 1)
        for j in range(3):
            for i in range(6):
                grad["enc"][j][i] += dh[j] * (x[i] if i < 5 else 1)
    return grad


def train_autoencoder(steps=1000, rate=4.0, data=DATA, initial=None):
    if not isinstance(steps, int) or not 0 <= steps <= 4000 or not 0 <= rate <= 4:
        raise ValueError("学習回数は0〜4000の整数、学習率は0〜4です")
    weights = copy.deepcopy(initial if initial is not None else initial_autoencoder())
    history = [{"step": 0, "mse": ae_loss(weights, data)}]
    for step in range(1, steps + 1):
        grad = ae_gradient(weights, data)
        for key, rows in weights.items():
            for i, row in enumerate(rows):
                for j in range(len(row)):
                    row[j] -= rate * grad[key][i][j]
        if step % 100 == 0 or step == steps:
            history.append({"step": step, "mse": ae_loss(weights, data)})
    return {"weights": weights, "history": history,
            "reconstructions": [reconstruct(x, weights) for x in data]}


def gate_step(previous=1.0, forget=0.8, input_gate=0.5, candidate=0.6, output_gate=0.75):
    """ゲートを手動指定したセル計算。ゲートの学習実験ではない。"""
    if not all(0 <= v <= 1 for v in (forget, input_gate, output_gate)) or not -1 <= candidate <= 1:
        raise ValueError("ゲートは0〜1、候補は-1〜1です")
    kept = forget * previous
    written = input_gate * candidate
    cell = kept + written
    return {"kept": kept, "written": written, "cell": cell,
            "hidden": output_gate * math.tanh(cell)}


def fixed_lstm_step(x, previous_cell=0.0, previous_hidden=0.0):
    """固定した重みからゲートを計算する1次元LSTM（未学習）。"""
    f = sigmoid(0.5 * x + 0.2 * previous_hidden + 1)
    i = sigmoid(x - 0.1 * previous_hidden)
    g = math.tanh(x + 0.3 * previous_hidden)
    o = sigmoid(0.4 * x + 0.1 * previous_hidden)
    return dict(gate_step(previous_cell, f, i, g, o), forget=f, input_gate=i,
                candidate=g, output_gate=o)


def memory_sequence(candidates=(1.0, 0.0, 0.0, 0.0), forget=0.8):
    """入力・出力ゲートを1とした理想化例。候補値は生の入力とは区別する。"""
    cell = 0.0
    result = []
    for candidate in candidates:
        step = gate_step(cell, forget, 1, candidate, 1)
        cell = step["cell"]
        result.append(step)
    return result


def generate(z, params):
    return params["a"] * z + params["b"]


def discriminate(x, params):
    return sigmoid(params["w"] * x + params["d"])


def softplus(x):
    return max(x, 0) + math.log1p(math.exp(-abs(x)))


def gan_losses(params):
    real_logits = [params["w"] * x + params["d"] for x in REAL]
    fake_logits = [params["w"] * generate(z, params) + params["d"] for z in NOISE]
    return {"d_loss": sum(softplus(-s) for s in real_logits) / len(REAL)
            + sum(softplus(s) for s in fake_logits) / len(NOISE),
            "g_loss": sum(softplus(-s) for s in fake_logits) / len(NOISE)}


def gan_gradient(params, target):
    if target == "d":
        grad = {"w": 0.0, "d": 0.0}
        for xs, label in ((REAL, 1), ([generate(z, params) for z in NOISE], 0)):
            for x in xs:
                delta = (discriminate(x, params) - label) / len(xs)
                grad["w"] += delta * x
                grad["d"] += delta
        return grad
    if target == "g":
        grad = {"a": 0.0, "b": 0.0}
        for z in NOISE:
            delta = (discriminate(generate(z, params), params) - 1) * params["w"] / len(NOISE)
            grad["a"] += delta * z
            grad["b"] += delta
        return grad
    raise ValueError("更新対象はdまたはgです")


def gan_step(params, target, rate=0.1):
    if not 0 <= rate <= 1:
        raise ValueError("学習率は0〜1です")
    updated = dict(params)
    for key, value in gan_gradient(params, target).items():
        updated[key] -= rate * value
    return updated


def rounded(value):
    if isinstance(value, float):
        return round(value, 6)
    if isinstance(value, list):
        return [rounded(v) for v in value]
    if isinstance(value, dict):
        return {k: rounded(v) for k, v in value.items()}
    return value


def demo():
    trained = train_autoencoder()
    after_d = gan_step(GAN_INITIAL, "d")
    after_g = gan_step(after_d, "g")
    return rounded({
        "autoencoder": {"before": ae_loss(initial_autoencoder()),
                        "after": trained["history"][-1]["mse"],
                        "first": trained["reconstructions"][0]},
        "gates": gate_step(), "sequence": memory_sequence(),
        "fixed_lstm": fixed_lstm_step(1),
        "gan": {"initial": dict(GAN_INITIAL), "after_d": after_d, "after_g": after_g,
                "generated": [generate(z, after_g) for z in NOISE], "losses": gan_losses(after_g)}})


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    result = demo()
    if not args.json:
        print("自己符号化器は全25出力のMSE、LSTMは手動ゲートと固定重み、GANはD→Gの1巡です。")
    print(json.dumps(result, ensure_ascii=False, indent=2))
