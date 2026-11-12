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


def dense_layer(values, rows, record=None):
    """入力×重みを順に並べ、バイアスを足してsigmoidへ渡す。"""
    output = []
    for unit, weights in enumerate(rows):
        products = []
        for index, value in enumerate(values):
            products.append(weights[index] * value)
        bias = weights[-1]
        total = sum(products) + bias
        activated = sigmoid(total)
        output.append(activated)
        if record is not None:
            record({'unit': unit, 'values': list(values), 'weights': list(weights[:-1]),
                    'products': products, 'bias': bias, 'total': total, 'output': activated})
    return output


def reconstruct(x, weights):
    """5値→3値→5値。目標は入力自身で、誤差は5個の二乗差の平均。"""
    if len(x) != 5:
        raise ValueError("入力は5個の数値です")
    hidden = dense_layer(x, weights['enc'])
    output = dense_layer(hidden, weights['dec'])
    errors = []
    for index, value in enumerate(output):
        errors.append((value - x[index]) ** 2)
    return {'hidden': hidden, 'output': output, 'mse': sum(errors) / 5}


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



def lesson_autoencoder(position=0):
    """入力の1の位置を選び、最初の中間ユニットと再構成を追う。"""
    x = DATA[position][:]
    weights = initial_autoencoder()
    records = []
    hidden = dense_layer(x, weights['enc'], records.append)
    first = records[0]
    before = reconstruct(x, weights)
    fitted = train_autoencoder()
    after = reconstruct(x, fitted['weights'])
    rows = [(j,x[j],first['weights'][j],first['products'][j]) for j in range(5)]
    errors = [(j,x[j],before['output'][j],(before['output'][j]-x[j])**2,after['output'][j]) for j in range(5)]
    return {'title':'自己符号化器：5→3→5', 'question':'5値を3値にまとめても元の1の位置へ戻せるか',
            'input':x,'columns':['入力番号','入力','中間0への重み','積'],'rows':rows,
            'tables':[('中間0：積の合計→バイアス→sigmoid',['積の合計','バイアス','合計','出力'],[(sum(first['products']),first['bias'],first['total'],first['output'])]),
                      ('5個の二乗誤差を平均する',['位置','正解=入力','初期再構成','二乗差','1000回後'],errors)],
            'matrices':[('入力5値',[x]),('中間3値',[hidden]),('初期再構成5値',[before['output']]),('学習後5値',[after['output']])],
            'plots':[('100回ごとの実測MSE／横軸=更新回数',[(r['step'],r['mse']) for r in fitted['history']])],
            'result':f"この入力のMSE={before['mse']}; 全5入力の平均MSE={fitted['history'][0]['mse']}",
            'comparison':f"同じ入力で重みを1000回学習→MSE={after['mse']}",
            'explanation':'1入力は5出力の平均、学習全体は5入力・25出力の平均。入力を変えることと学習を分ける。',
            'reset':'position=0で再実行。毎回、同じ初期重みのコピーから学習する。'}


def lesson_lstm(forget=0.8):
    """手動ゲートの記憶と、固定重みLSTMの時刻別計算を区別する。"""
    candidates = [1.,0.,0.,0.]
    states = memory_sequence(candidates, forget)
    previous, rows = 0., []
    for time, (candidate, state) in enumerate(zip(candidates, states)):
        rows.append((time,previous,forget,state['kept'],candidate,state['written'],state['cell'],state['hidden']))
        previous = state['cell']
    fixed, cell, hidden = [], 0., 0.
    for time, x in enumerate([1.,0.,0.,0.]):
        result = fixed_lstm_step(x,cell,hidden)
        fixed.append((time,x,cell,result['forget'],result['input_gate'],result['candidate'],result['cell'],result['hidden']))
        cell, hidden = result['cell'], result['hidden']
    return {'title':'LSTM：前の記憶を残し、新しい情報を書く','question':'入力後に0が続くと記憶はどうなるか',
            'input':'候補[1,0,0,0]。手動例は入力・出力ゲート=1。固定重み例は生入力から各ゲートを計算。',
            'columns':['時刻','前のc','忘却f','残す量','候補g','書く量','新しいc','h'],'rows':rows,
            'tables':[('別のモデル：固定重みの1次元LSTM',['時刻','入力x','前のc','f','i','g','c','h'],fixed)],
            'result':f"手動例の最後の記憶={states[-1]['cell']}",
            'comparison':f"忘却を0にすると最後の記憶={memory_sequence(candidates,0)[-1]['cell']}",
            'explanation':'c=f×前のc+i×g。h=o×tanh(c)。時刻を進めるだけでは重みを学習していない。',
            'reset':'forget=0.8で再実行。時刻0のcとhは0から始まる。'}


def lesson_gan(rate=0.1):
    """Dだけ更新→更新後Dを固定してGだけ更新、という1往復。"""
    initial = dict(GAN_INITIAL)
    d_gradient = gan_gradient(initial,'d')
    after_d = gan_step(initial,'d',rate)
    g_gradient = gan_gradient(after_d,'g')
    after_g = gan_step(after_d,'g',rate)
    rows = [(key,initial[key],d_gradient.get(key,'固定'),after_d[key],g_gradient.get(key,'固定'),after_g[key]) for key in ('a','b','w','d')]
    generated = [(z,generate(z,initial),generate(z,after_d),generate(z,after_g)) for z in NOISE]
    return {'title':'GAN：更新する側と固定する側','question':'Dを更新した直後、Gが作る値は変わるか',
            'input':f'実データ{REAL}、ノイズ{NOISE}、学習率{rate}',
            'columns':['重み','初期','D更新の勾配','D更新後','G更新の勾配','G更新後'],'rows':rows,
            'tables':[('G(z)=a×z+b。D更新中はa,bを固定',['z','初期G(z)','D更新後G(z)','G更新後G(z)'],generated)],
            'result':f'1往復後の損失 {gan_losses(after_g)}',
            'comparison':f"学習率0なら両更新後も初期値と同じ：{gan_step(gan_step(initial,'d',0),'g',0)==initial}",
            'explanation':'a,bはG、w,dはD。D更新中はGを固定し、その後のG更新では更新後のDを固定する。',
            'reset':'rate=0.1で再実行。既存の学習結果を引き継がずGAN_INITIALのコピーから始める。'}

STUDY_THEMES = {'autoencoder': lesson_autoencoder, 'lstm': lesson_lstm, 'gan': lesson_gan}

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
        parser.add_argument("--demo", action="store_true")
        parser.add_argument("--json", action="store_true")
        args = parser.parse_args()
        result = demo()
        if not args.json:
            print("自己符号化器は全25出力のMSE、LSTMは手動ゲートと固定重み、GANはD→Gの1巡です。")
        print(json.dumps(result, ensure_ascii=False, indent=2))
