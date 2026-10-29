"""第10回：人工的な小規模データで自然言語処理の計算を観察する。
python natural_language_processing.py --demo
実用解析器・録音の認識器ではない。Python標準ライブラリのみ。
"""
import argparse
import copy
import json
import math

CORPUS = [['猫', 'が', '眠る'], ['犬', 'が', '眠る'],
          ['猫', 'が', '走る'], ['犬', 'が', '走る']]
# (表層形, 品詞, 教材用コスト)。この順で同点候補を優先する。
LEXICON = [('猫', '名詞', 1), ('犬', '名詞', 1), ('が', '助詞', 1),
           ('眠る', '動詞', 1), ('走る', '動詞', 1), ('研究', '名詞', 1),
           ('研究生', '名詞', 1), ('生活', '名詞', 1), ('活', '名詞', 5)]
BOS, EOS = '<s>', '</s>'


def finite(value, low, high, label):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not low <= value <= high:
        raise ValueError(f'{label}: {low}〜{high}の有限数を指定')
    return value


def integer(value, low, high, label):
    finite(value, low, high, label)
    if int(value) != value:
        raise ValueError(f'{label}: 整数を指定')
    return int(value)


def validate_corpus(corpus):
    if not isinstance(corpus, list) or not 1 <= len(corpus) <= 20:
        raise ValueError('文書数は1〜20')
    for sentence in corpus:
        if not isinstance(sentence, list) or not 1 <= len(sentence) <= 20:
            raise ValueError('各文書の語数は1〜20（空文書不可）')
        if any(not isinstance(w, str) or not w or len(w) > 20 or any(c.isspace() for c in w) or w in (BOS, EOS) for w in sentence):
            raise ValueError('語は空白・予約記号を含まない1〜20文字')
    return list(dict.fromkeys(w for s in corpus for w in s))


def char_split(text):
    """字種の変わり目で区切る比較用処理。品詞は分からない。"""
    if not isinstance(text, str) or len(text) > 80:
        raise ValueError('入力は80文字以内')
    def kind(c):
        if '\u3041' <= c <= '\u3096': return 'ひらがな'
        if '\u30a1' <= c <= '\u30fa' or c == 'ー': return 'カタカナ'
        if '\u4e00' <= c <= '\u9fff': return '漢字'
        return 'その他'
    groups = []
    for c in text:
        if groups and kind(groups[-1][-1]) == kind(c): groups[-1] += c
        else: groups.append(c)
    return groups


def analyze(text, lexicon=LEXICON):
    """先頭からのDP。接続コストなし。未知文字も常に候補に含める。"""
    char_split(text)
    if not isinstance(lexicon, list) or not 1 <= len(lexicon) <= 40:
        raise ValueError('辞書は1〜40項目')
    for word, pos, cost in lexicon:
        if not isinstance(word, str) or not word or not isinstance(pos, str) or not pos:
            raise ValueError('辞書の表層形・品詞は非空文字列')
        finite(cost, 0, 20, '辞書コスト')
    best = [None] * (len(text) + 1)
    best[0] = (0.0, (), [])
    edges = []
    for start in range(len(text)):
        for order, (word, pos, cost) in enumerate([*lexicon, (text[start], '未知', 10)]):
            if not text.startswith(word, start): continue
            end = start + len(word)
            edges.append({'start': start, 'end': end, 'word': word, 'pos': pos, 'cost': cost})
            old_cost, old_order, old_tokens = best[start]
            candidate = (old_cost + cost, old_order + (order,), old_tokens + [[word, pos, cost]])
            if best[end] is None or candidate[:2] < best[end][:2]: best[end] = candidate
    return {'tokens': best[-1][2], 'cost': best[-1][0], 'edges': edges}


def bigram(corpus=CORPUS, context='が', alpha=1):
    vocab = validate_corpus(corpus) + [EOS]
    finite(alpha, 0, 5, 'α')
    if context not in [BOS, *vocab] or context == EOS:
        raise ValueError('文脈は文頭またはコーパス内の語（文末以外）')
    counts = [0] * len(vocab)
    for sentence in corpus:
        seq = [BOS, *sentence, EOS]
        for before, after in zip(seq, seq[1:]):
            if before == context: counts[vocab.index(after)] += 1
    total = sum(counts)
    denominator = total + alpha * len(vocab)
    return {'vocab': vocab, 'context': context, 'counts': counts, 'total': total,
            'denominator': denominator, 'probabilities': [((n + alpha) / denominator) for n in counts]}


def tfidf(corpus=CORPUS):
    vocab = validate_corpus(corpus)
    counts = [[s.count(w) for w in vocab] for s in corpus]
    df = [sum(w in s for s in corpus) for w in vocab]
    idf = [math.log(len(corpus) / n) for n in df]
    tf = [[n / len(corpus[i]) for n in row] for i, row in enumerate(counts)]
    return {'vocab': vocab, 'counts': counts, 'df': df, 'idf': idf, 'tf': tf,
            'scores': [[v * idf[j] for j, v in enumerate(row)] for row in tf]}


def representations(corpus=CORPUS, window=1):
    vocab = validate_corpus(corpus)
    window = integer(window, 1, 3, '窓幅')
    counts = [[0] * len(vocab) for _ in vocab]
    for s in corpus:
        for i, word in enumerate(s):
            for j in range(max(0, i-window), min(len(s), i+window+1)):
                if j != i: counts[vocab.index(word)][vocab.index(s[j])] += 1
    return {'vocab': vocab, 'onehot': [[int(i == j) for j in range(len(vocab))] for i in range(len(vocab))], 'cooccurrence': counts}


def cosine(a, b):
    if not a or len(a) != len(b): raise ValueError('同じ非ゼロ次元を指定')
    for x in [*a, *b]: finite(x, -1e6, 1e6, 'ベクトル要素')
    dot = sum(x*y for x, y in zip(a, b))
    na = math.sqrt(sum(x*x for x in a)); nb = math.sqrt(sum(x*x for x in b))
    return {'dot': dot, 'norm_a': na, 'norm_b': nb, 'cosine': dot / (na*nb) if na and nb else None}


class RNG:
    def __init__(self, seed=65535): self.state = integer(seed, 0, 2**32-1, 'seed')
    def random(self):
        self.state = (1664525 * self.state + 1013904223) % 2**32
        return self.state / 2**32


def initial_vectors(size, seed=65535):
    size = integer(size, 1, 400, '語彙数'); rng = RNG(seed)
    return [[[rng.random() * .2 - .1 for _ in range(2)] for _ in range(size)] for _ in range(2)]


def pairs(corpus=CORPUS, window=1):
    vocab = validate_corpus(corpus); window = integer(window, 1, 3, '窓幅')
    return [[vocab.index(s[i]), vocab.index(s[j])] for s in corpus for i in range(len(s))
            for j in range(max(0, i-window), min(len(s), i+window+1)) if i != j]


def objective(inputs, outputs, center, target):
    scores = [sum(a*b for a, b in zip(inputs[center], row)) for row in outputs]
    maximum = max(scores)
    exps = [math.exp(v - maximum) for v in scores]; total = sum(exps)
    probabilities = [v / total for v in exps]
    loss = maximum + math.log(total) - scores[target]
    errors = [p - int(i == target) for i, p in enumerate(probabilities)]
    grad_in = [sum(errors[j] * outputs[j][k] for j in range(len(outputs))) for k in range(2)]
    grad_out = [[e * v for v in inputs[center]] for e in errors]
    return {'probabilities': probabilities, 'loss': loss, 'grad_in': grad_in, 'grad_out': grad_out}


def update(inputs, outputs, center, target, rate=.1):
    finite(rate, 0, 1, '学習率')
    result = objective(inputs, outputs, center, target)
    ni, no = copy.deepcopy(inputs), copy.deepcopy(outputs)
    ni[center] = [x-rate*g for x, g in zip(inputs[center], result['grad_in'])]
    no = [[x-rate*g for x, g in zip(row, grad)] for row, grad in zip(outputs, result['grad_out'])]
    return ni, no, result


def train(corpus=CORPUS, epochs=20, rate=.1, seed=65535, window=1):
    vocab = validate_corpus(corpus); epochs = integer(epochs, 0, 200, 'エポック')
    finite(rate, 0, 1, '学習率')
    training = pairs(corpus, window)
    if not training: raise ValueError('周辺語のある文が必要')
    inputs, outputs = initial_vectors(len(vocab), seed)
    def loss(): return sum(objective(inputs, outputs, c, t)['loss'] for c, t in training) / len(training)
    history = [loss()]
    for _ in range(epochs):
        for center, target in training: inputs, outputs, _ = update(inputs, outputs, center, target, rate)
        history.append(loss())
    return {'vocab': vocab, 'pairs': training, 'inputs': inputs, 'outputs': outputs, 'loss_history': history}


def recognize(acoustic=(.6, .4), prior=(.2, .8), weight=1):
    if len(acoustic) != 2 or len(prior) != 2: raise ValueError('候補は雨・飴の2件')
    for x in [*acoustic, *prior]: finite(x, 1e-12, 1, '尤度・事前確率')
    if not math.isclose(sum(prior), 1, rel_tol=1e-9, abs_tol=1e-9): raise ValueError('事前確率の合計は1')
    finite(weight, 0, 3, 'λ')
    scores = [math.log(a) + weight*math.log(p) for a, p in zip(acoustic, prior)]
    return {'candidates': ['雨', '飴'], 'scores': scores, 'winner': ['雨', '飴'][scores.index(max(scores))]}


def rounded(value):
    if isinstance(value, float): return round(value, 6)
    if isinstance(value, list): return [rounded(v) for v in value]
    if isinstance(value, dict): return {k: rounded(v) for k, v in value.items()}
    return value


def demo():
    vectors = representations(); trained = train(); a, b = initial_vectors(5)
    return rounded({'morph': analyze('研究生活'), 'chars': char_split('猫が眠る'),
                    'bigram': bigram(), 'tfidf': tfidf(), 'vectors': vectors,
                    'similarity': cosine(vectors['cooccurrence'][0], vectors['cooccurrence'][3]),
                    'first_update': update(a, b, 0, 1)[2], 'training': trained,
                    'speech': recognize(), 'speech_no_prior': recognize(weight=0)})


def experiments():
    lex = copy.deepcopy(LEXICON); lex[-1] = ('活', '名詞', 0)
    docs = copy.deepcopy(CORPUS); docs.append(['猫', 'が', '眠る'])
    return {'dictionary': analyze('研究生活', lex), 'alpha': bigram(alpha=0),
            'document': tfidf(docs), 'window': representations(window=2),
            'learning_rate': train(rate=0), 'language_weight': recognize(weight=0)}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--demo', action='store_true', help='固定入力の基準実行')
    parser.add_argument('--json', action='store_true', help='照合用JSON')
    args = parser.parse_args()
    print(json.dumps(demo(), ensure_ascii=False, indent=None if args.json else 2))
