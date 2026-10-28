"""第7回: 自作4×4画像でCNNの計算と小さな学習を観察する。

python cnn_basics.py --demo (--json は検証用)
入力は人工画像だけ。外部データ・GPU・追加ライブラリは不要。
学習率0.1・100更新と、未学習の端の画像の予測を比較する。
数値微分は28パラメーター限定の教育用。大規模学習向けではない。
"""
import argparse
import json
import math
import random
from copy import deepcopy

# Python Random(42): フィルター8値、バイアス2値、出力重み16値、バイアス2値。
_rng = random.Random(42)
INITIAL_WEIGHTS = tuple([_rng.uniform(-.5, .5) for _ in range(8)] + [.1, .1]
                        + [_rng.uniform(-.5, .5) for _ in range(16)] + [0., 0.])
IMAGE = [[0, 1, 0, 0] for _ in range(4)]
FILTER = [[1, -1], [1, -1]]


def matrix(a):
    if not a or not a[0] or any(len(row) != len(a[0]) for row in a):
        raise ValueError('空でない長方形の配列にしてください')
    if any(not math.isfinite(v) for row in a for v in row):
        raise ValueError('値は有限の数にしてください')
    return len(a), len(a[0])


def convolve(image, kernel, stride=1, padding=0):
    """フィルターを反転しない積和。padding は周囲に加えるゼロの幅。"""
    h, w = matrix(image)
    kh, kw = matrix(kernel)
    if not isinstance(stride, int) or stride < 1 or not isinstance(padding, int) or padding < 0:
        raise ValueError('strideは正の整数、paddingは非負整数')
    if h + 2 * padding < kh or w + 2 * padding < kw:
        raise ValueError('フィルターが入力より大きすぎます')
    def pixel(i, j):
        return image[i][j] if 0 <= i < h and 0 <= j < w else 0
    return [[sum(kernel[u][v] * pixel(i + u - padding, j + v - padding)
                 for u in range(kh) for v in range(kw))
             for j in range(0, w + 2 * padding - kw + 1, stride)]
            for i in range(0, h + 2 * padding - kh + 1, stride)]


def relu(image):
    matrix(image)
    return [[max(0., value) for value in row] for row in image]


def pool(image, mode='max', size=2, stride=1):
    h, w = matrix(image)
    if mode not in ('max', 'mean') or size < 1 or stride < 1 or min(h, w) < size:
        raise ValueError('プーリング条件を確認してください')
    def value(i, j):
        values = [image[i + u][j + v] for u in range(size) for v in range(size)]
        return max(values) if mode == 'max' else sum(values) / len(values)
    return [[value(i, j) for j in range(0, w - size + 1, stride)]
            for i in range(0, h - size + 1, stride)]


def samples(positions):
    """0=縦線、1=横線。位置は0始まり。並びは縦→横、それぞれ位置順。"""
    if any(p not in range(4) for p in positions):
        raise ValueError('位置は0〜3')
    return [([[float((j if label == 0 else i) == pos) for j in range(4)]
              for i in range(4)], label) for label in range(2) for pos in positions]


def forward(weights, image):
    if len(weights) != 28 or matrix(image) != (4, 4):
        raise ValueError('学習モデルは28パラメーター・4×4入力です')
    maps, activated, pooled, features = [], [], [], []
    for k in range(2):
        kernel = [weights[k * 4:k * 4 + 2], weights[k * 4 + 2:k * 4 + 4]]
        raw = [[v + weights[8 + k] for v in row] for row in convolve(image, kernel)]
        act = relu(raw)
        small = pool(act)
        maps.append(raw); activated.append(act); pooled.append(small)
        features.extend(v for row in small for v in row)
    logits = [sum(weights[10 + c * 8 + t] * features[t] for t in range(8))
              + weights[26 + c] for c in range(2)]
    maximum = max(logits)
    exps = [math.exp(v - maximum) for v in logits]
    logsum = maximum + math.log(sum(exps))
    return {'maps': maps, 'relu': activated, 'pooled': pooled, 'features': features,
            'logits': logits, 'probabilities': [v / sum(exps) for v in exps],
            'log_probabilities': [v - logsum for v in logits]}


def loss(weights, data):
    return sum(-forward(weights, image)['log_probabilities'][label] for image, label in data) / len(data)


def predict(weights, data):
    return [max(range(2), key=forward(weights, image)['probabilities'].__getitem__) for image, _ in data]


def train(rate=.1, steps=100, initial=INITIAL_WEIGHTS):
    """同じ初期値のコピーから全件一括更新。中央差分幅は1e-6。"""
    if not math.isfinite(rate) or rate < 0 or not isinstance(steps, int) or not 0 <= steps <= 1000:
        raise ValueError('rateは非負の有限値、stepsは0〜1000の整数')
    weights = list(initial)
    data = samples([1, 2])
    history = [loss(weights, data)]
    for _ in range(steps):
        gradients = []
        for j in range(28):
            plus, minus = weights.copy(), weights.copy()
            plus[j] += 1e-6; minus[j] -= 1e-6
            gradients.append((loss(plus, data) - loss(minus, data)) / 2e-6)
        weights = [v - rate * d for v, d in zip(weights, gradients)]
        history.append(loss(weights, data))
    return {'weights': weights, 'history': history,
            'train_predictions': predict(weights, data),
            'heldout_predictions': predict(weights, samples([0, 3]))}


def rounded(value):
    if isinstance(value, float):
        return round(value, 6)
    if isinstance(value, (tuple, list)):
        return [rounded(v) for v in value]
    if isinstance(value, dict):
        return {k: rounded(v) for k, v in value.items()}
    return value


def demo():
    raw = convolve(IMAGE, FILTER)
    fit = train()
    return rounded({'convolution': raw, 'relu': relu(raw),
                    'stride2': convolve(IMAGE, FILTER, stride=2),
                    'padding_shape': [len(convolve(IMAGE, FILTER, padding=1))] * 2,
                    'max_pool': pool(relu(raw)), 'mean_pool': pool(relu(raw), 'mean'),
                    'parameter_count': len(INITIAL_WEIGHTS),
                    'loss_before': fit['history'][0], 'loss_after': fit['history'][-1],
                    'train_before': predict(INITIAL_WEIGHTS, samples([1, 2])),
                    'train_after': fit['train_predictions'], 'heldout_after': fit['heldout_predictions'],
                    'labels': [0, 0, 1, 1]})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--demo', action='store_true')
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    result = demo()
    if not args.json:
        print('0=縦線、1=横線。学習用と確認用の結果を分けて読みましょう。')
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
