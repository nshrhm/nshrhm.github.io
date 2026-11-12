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


def window_terms(image, kernel, top, left, padding=0):
    """一つの窓。top/leftは余白を含む画像上の開始位置。"""
    height, width = len(image), len(image[0])
    terms = []
    for u, kernel_row in enumerate(kernel):
        for v, weight in enumerate(kernel_row):
            row = top + u - padding
            col = left + v - padding
            inside = 0 <= row < height and 0 <= col < width
            pixel = image[row][col] if inside else 0
            terms.append({'row': row, 'col': col, 'added_zero': not inside,
                          'pixel': pixel, 'weight': weight, 'product': weight * pixel})
    return terms


def convolve(image, kernel, stride=1, padding=0, *, record=None):
    """フィルターを反転しない積和。recordへ各出力の計算を渡せる。"""
    height, width = matrix(image)
    kh, kw = matrix(kernel)
    if not isinstance(stride, int) or stride < 1 or not isinstance(padding, int) or padding < 0:
        raise ValueError('strideは正の整数、paddingは非負整数')
    if height + 2 * padding < kh or width + 2 * padding < kw:
        raise ValueError('フィルターが入力より大きすぎます')
    row_starts = range(0, height + 2 * padding - kh + 1, stride)
    col_starts = range(0, width + 2 * padding - kw + 1, stride)
    output = []
    for out_row, top in enumerate(row_starts):
        output_row = []
        for out_col, left in enumerate(col_starts):
            terms = window_terms(image, kernel, top, left, padding)
            products = [term['product'] for term in terms]
            total = sum(products)
            output_row.append(total)
            if record is not None:
                record({'output': [out_row, out_col], 'start': [top, left],
                        'terms': terms, 'total': total})
        output.append(output_row)
    return output


def relu(image):
    """位置を変えず、負の値だけ0にする。"""
    matrix(image)
    output = []
    for row in image:
        output_row = []
        for value in row:
            output_row.append(max(0., value))
        output.append(output_row)
    return output


def pool(image, mode='max', size=2, stride=1, *, record=None):
    height, width = matrix(image)
    if mode not in ('max', 'mean') or size < 1 or stride < 1 or min(height, width) < size:
        raise ValueError('プーリング条件を確認してください')
    output = []
    for out_row, top in enumerate(range(0, height - size + 1, stride)):
        output_row = []
        for out_col, left in enumerate(range(0, width - size + 1, stride)):
            values = []
            for u in range(size):
                for v in range(size):
                    values.append(image[top + u][left + v])
            total = max(values) if mode == 'max' else sum(values) / len(values)
            output_row.append(total)
            if record is not None:
                record({'output': [out_row, out_col], 'start': [top, left],
                        'values': values, 'mode': mode, 'total': total})
        output.append(output_row)
    return output


def samples(positions):
    """0=縦線、1=横線。縦→横、それぞれ位置順。位置は0始まり。"""
    if any(position not in range(4) for position in positions):
        raise ValueError('位置は0〜3')
    data = []
    for label in range(2):
        for position in positions:
            image = []
            for row in range(4):
                pixels = []
                for col in range(4):
                    coordinate = col if label == 0 else row
                    pixels.append(float(coordinate == position))
                image.append(pixels)
            data.append((image, label))
    return data


def score_terms(weights, features, label):
    """8値とクラス別の8重みを対応させる。forwardもこの積を使う。"""
    terms = []
    for index, feature in enumerate(features):
        weight = weights[10 + label * 8 + index]
        name = ('a' if index < 4 else 'b') + str(index % 4 + 1)
        terms.append({'name': name, 'feature': feature,
                      'weight': weight, 'product': weight * feature})
    return terms


def forward(weights, image):
    if len(weights) != 28 or matrix(image) != (4, 4):
        raise ValueError('学習モデルは28パラメーター・4×4入力です')
    maps, activated, pooled, features = [], [], [], []
    for k in range(2):
        kernel = [weights[k * 4:k * 4 + 2], weights[k * 4 + 2:k * 4 + 4]]
        convolution = convolve(image, kernel)
        raw = []
        for row in convolution:
            raw.append([value + weights[8 + k] for value in row])
        act = relu(raw)
        small = pool(act)
        maps.append(raw)
        activated.append(act)
        pooled.append(small)
        for row in small:
            features.extend(row)  # aの左上→右上→左下→右下、その後b。
    logits = []
    for label in range(2):
        terms = score_terms(weights, features, label)
        products = [term['product'] for term in terms]
        logits.append(sum(products) + weights[26 + label])
    maximum = max(logits)
    exps = [math.exp(value - maximum) for value in logits]
    denominator = sum(exps)
    logsum = maximum + math.log(denominator)
    return {'maps': maps, 'relu': activated, 'pooled': pooled, 'features': features,
            'logits': logits, 'probabilities': [value / denominator for value in exps],
            'log_probabilities': [value - logsum for value in logits]}


def loss(weights, data):
    individual_losses = []
    for image, label in data:
        result = forward(weights, image)
        individual_losses.append(-result['log_probabilities'][label])
    return sum(individual_losses) / len(data)


def predict(weights, data):
    predictions = []
    for image, _ in data:
        probabilities = forward(weights, image)['probabilities']
        # 同値なら先にある0（縦線）を選ぶ。
        label = max(range(2), key=probabilities.__getitem__)
        predictions.append(label)
    return predictions


def gradient_term(weights, data, index):
    """一つの重みを±1e-6だけ試す。元の重みは変えない。"""
    plus, minus = list(weights), list(weights)
    plus[index] += 1e-6
    minus[index] -= 1e-6
    loss_plus = loss(plus, data)
    loss_minus = loss(minus, data)
    gradient = (loss_plus - loss_minus) / 2e-6
    return {'index': index, 'weight': weights[index], 'loss_plus': loss_plus,
            'loss_minus': loss_minus, 'gradient': gradient}


def train(rate=.1, steps=100, initial=INITIAL_WEIGHTS, *, record=None):
    """同じ初期値のコピーから全件一括更新。record(step, weights, loss)。"""
    if not math.isfinite(rate) or rate < 0 or not isinstance(steps, int) or not 0 <= steps <= 1000:
        raise ValueError('rateは非負の有限値、stepsは0〜1000の整数')
    weights = list(initial)
    data = samples([1, 2])
    history = [loss(weights, data)]
    if record is not None:
        record(0, weights.copy(), history[0])
    for step in range(1, steps + 1):
        gradients = []
        for index in range(28):
            term = gradient_term(weights, data, index)
            gradients.append(term['gradient'])
        # 全28個の勾配を同じ更新前の重みから求めてから、一括で更新。
        updated = []
        for value, gradient in zip(weights, gradients):
            updated.append(value - rate * gradient)
        weights = updated
        history.append(loss(weights, data))
        if record is not None:
            record(step, weights.copy(), history[-1])
    return {'weights': weights, 'history': history,
            'train_predictions': predict(weights, data),
            'heldout_predictions': predict(weights, samples([0, 3]))}


def training_run(rate=.1):
    """100回を一度実行し、指定した5時点を保存する。補間はしない。"""
    snapshots = {}
    def record(step, weights, value):
        if step in (0, 1, 10, 50, 100):
            snapshots[step] = {'weights': weights, 'loss': value}
    result = train(rate=rate, record=record)
    return {**result, 'snapshots': snapshots}


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


CLASS_NAMES = ('縦線', '横線')


def print_matrix(title, values):
    print(title)
    for row_number, row in enumerate(values):
        print(f'  行{row_number}:', '  '.join(f'{value:.6g}' for value in row))


def explain(theme):
    """実計算の記録を名前付きで読む。表示だけを丸める。"""
    if theme == 'all':
        for name in ('convolution', 'size', 'activation', 'classification', 'learning'):
            explain(name)
        return
    print('\nテーマ:', theme, '／位置は0始まり。表示は丸め、内部は丸めません。')
    print_matrix('入力画像', IMAGE)
    if theme in ('convolution', 'size'):
        print_matrix('手作りフィルター（学習モデルの初期重みとは別）', FILTER)
        conditions = [(1, 0)] if theme == 'convolution' else [(s, p) for s in (1, 2) for p in (0, 1)]
        for stride, padding in conditions:
            records = []
            output = convolve(IMAGE, FILTER, stride, padding, record=records.append)
            print(f'移動幅={stride} 余白={padding} 開始位置={list(range(0, 3 + 2*padding, stride))}')
            for item in records:
                print('窓開始', item['start'], '→ 出力', item['output'])
                for term in item['terms']:
                    origin = '追加した0' if term['added_zero'] else '元画像'
                    print(f"  {origin}[{term['row']},{term['col']}]: {term['pixel']} × {term['weight']} = {term['product']}")
                print('  合計 =', item['total'])
            print_matrix('計算結果', output)
    elif theme == 'activation':
        for position in range(4):
            image = samples([position])[0][0]
            raw = convolve(image, FILTER)
            active = relu(raw)
            print_matrix(f'縦線の列{position}：畳み込み', raw)
            print_matrix('負の値を0にするReLU', active)
            for mode in ('max', 'mean'):
                records = []
                output = pool(active, mode, record=records.append)
                for item in records:
                    operation = '最大' if mode == 'max' else '合計÷4'
                    print('出力', item['output'], '4値', item['values'], operation, '=', item['total'])
                print_matrix(mode, output)
    elif theme == 'classification':
        weights = INITIAL_WEIGHTS
        for image, label in samples(range(4)):
            print_matrix('正解=' + CLASS_NAMES[label], image)
            result = forward(weights, image)
            for k in range(2):
                print_matrix('フィルター' + 'ab'[k], [weights[k*4:k*4+2], weights[k*4+2:k*4+4]])
                print('畳み込みのバイアス', weights[8+k])
                for stage in ('maps', 'relu', 'pooled'):
                    print_matrix(stage + ' ' + 'ab'[k], result[stage][k])
            for c in range(2):
                print('分類先:', CLASS_NAMES[c])
                for term in score_terms(weights, result['features'], c):
                    print(term['name'], ':', round(term['feature'], 6), '×', round(term['weight'], 6), '=', round(term['product'], 6))
                print('バイアス', weights[26+c], 'スコア', result['logits'][c], 'softmax', result['probabilities'][c])
            print('予測=', CLASS_NAMES[predict(weights, [(image, label)])[0]])
    elif theme == 'learning':
        term = gradient_term(INITIAL_WEIGHTS, samples([1, 2]), 0)
        print('最初の重みの数値微分:', term)
        print('更新後 = 重み − 0.1 × 勾配 =', term['weight'] - .1 * term['gradient'])
        for rate in (0, .1):
            run = training_run(rate)
            for step, snapshot in run['snapshots'].items():
                weights = snapshot['weights']
                print('学習率', rate, '更新回数', step, '学習用平均損失', snapshot['loss'])
                for name, data in [('学習用', samples([1, 2])), ('確認用（更新には不使用）', samples([0, 3]))]:
                    predictions = predict(weights, data)
                    for (image, label), prediction in zip(data, predictions):
                        print_matrix(name, image)
                        probability = forward(weights, image)['probabilities'][label]
                        print('正解', CLASS_NAMES[label], '予測', CLASS_NAMES[prediction],
                              '正解クラスへの出力', probability, '正誤', prediction == label)
    print('戻す：同じコマンドを再実行。毎回、固定入力と初期重みから開始します。')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--demo', action='store_true')
    parser.add_argument('--json', action='store_true')
    parser.add_argument('--explain', choices=['convolution', 'size', 'activation', 'classification', 'learning', 'all'])
    args = parser.parse_args()
    if args.explain:
        if args.json or args.demo:
            parser.error('--explainは--demo、--jsonと同時に指定しません')
        explain(args.explain)
        return
    result = demo()
    if not args.json:
        print('0=縦線、1=横線。学習用と確認用の結果を分けて読みましょう。')
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
