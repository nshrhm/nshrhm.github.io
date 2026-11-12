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
        if 'ぁ' <= c <= 'ゖ':
            return 'ひらがな'
        if 'ァ' <= c <= 'ヺ' or c == 'ー':
            return 'カタカナ'
        if '一' <= c <= '鿿':
            return '漢字'
        return 'その他'
    groups = []
    for c in text:
        if groups and kind(groups[-1][-1]) == kind(c):
            groups[-1] += c
        else:
            groups.append(c)
    return groups


def analyze(text, lexicon=LEXICON):
    """先頭からのDP。接続コストなし。未知文字も常に候補に含める。"""
    char_split(text)
    if not isinstance(lexicon, list) or not 1 <= len(lexicon) <= 40:
        raise ValueError('辞書は1〜40項目')
    for word, pos, cost in lexicon:
        if not isinstance(word, str) or not word or (not isinstance(pos, str)) or (not pos):
            raise ValueError('辞書の表層形・品詞は非空文字列')
        finite(cost, 0, 20, '辞書コスト')
    best = [None] * (len(text) + 1)
    best[0] = (0.0, (), [])
    edges = []
    for start in range(len(text)):
        for order, (word, pos, cost) in enumerate([*lexicon, (text[start], '未知', 10)]):
            if not text.startswith(word, start):
                continue
            end = start + len(word)
            edges.append({'start': start, 'end': end, 'word': word, 'pos': pos, 'cost': cost})
            old_cost, old_order, old_tokens = best[start]
            candidate = (old_cost + cost, old_order + (order,), old_tokens + [[word, pos, cost]])
            if best[end] is None or candidate[:2] < best[end][:2]:
                best[end] = candidate
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
    """語を数える→文書内比率TF→出現文書数DF→IDF→掛け算。"""
    vocab = validate_corpus(corpus)
    counts, df, idf, tf, scores = [], [], [], [], []
    for sentence in corpus:
        counts.append([sentence.count(word) for word in vocab])
    for word in vocab:
        document_count = sum(word in sentence for sentence in corpus)
        df.append(document_count)
        idf.append(math.log(len(corpus) / document_count))
    for index, row in enumerate(counts):
        frequencies = []
        for count in row:
            frequencies.append(count / len(corpus[index]))
        tf.append(frequencies)
        scores.append([value * idf[j] for j,value in enumerate(frequencies)])
    return {'vocab': vocab, 'counts': counts, 'df': df, 'idf': idf, 'tf': tf, 'scores': scores}


def representations(corpus=CORPUS, window=1):
    vocab = validate_corpus(corpus)
    window = integer(window, 1, 3, '窓幅')
    counts = [[0] * len(vocab) for _ in vocab]
    for s in corpus:
        for i, word in enumerate(s):
            for j in range(max(0, i - window), min(len(s), i + window + 1)):
                if j != i:
                    counts[vocab.index(word)][vocab.index(s[j])] += 1
    return {'vocab': vocab, 'onehot': [[int(i == j) for j in range(len(vocab))] for i in range(len(vocab))], 'cooccurrence': counts}


def cosine(a, b):
    if not a or len(a) != len(b):
        raise ValueError('同じ非ゼロ次元を指定')
    for x in [*a, *b]:
        finite(x, -1000000.0, 1000000.0, 'ベクトル要素')
    dot = sum((x * y for x, y in zip(a, b)))
    na = math.sqrt(sum((x * x for x in a)))
    nb = math.sqrt(sum((x * x for x in b)))
    return {'dot': dot, 'norm_a': na, 'norm_b': nb, 'cosine': dot / (na * nb) if na and nb else None}


class RNG:
    def __init__(self, seed=65535): self.state = integer(seed, 0, 2**32-1, 'seed')
    def random(self):
        self.state = (1664525 * self.state + 1013904223) % 2**32
        return self.state / 2**32


def initial_vectors(size, seed=65535):
    size = integer(size, 1, 400, '語彙数'); rng = RNG(seed)
    return [[[rng.random() * .2 - .1 for _ in range(2)] for _ in range(size)] for _ in range(2)]


def pairs(corpus=CORPUS, window=1):
    """中心語と、指定した窓の周辺語を順番に組にする。"""
    vocab = validate_corpus(corpus)
    window = integer(window, 1, 3, '窓幅')
    training_pairs = []
    for sentence in corpus:
        for center in range(len(sentence)):
            left = max(0, center-window)
            right = min(len(sentence), center+window+1)
            for neighbor in range(left, right):
                if center != neighbor:
                    training_pairs.append([vocab.index(sentence[center]),vocab.index(sentence[neighbor])])
    return training_pairs


def objective(inputs, outputs, center, target):
    scores = [sum((a * b for a, b in zip(inputs[center], row))) for row in outputs]
    maximum = max(scores)
    exps = [math.exp(v - maximum) for v in scores]
    total = sum(exps)
    probabilities = [v / total for v in exps]
    loss = maximum + math.log(total) - scores[target]
    errors = [p - int(i == target) for i, p in enumerate(probabilities)]
    grad_in = [sum((errors[j] * outputs[j][k] for j in range(len(outputs)))) for k in range(2)]
    grad_out = [[e * v for v in inputs[center]] for e in errors]
    return {'probabilities': probabilities, 'loss': loss, 'grad_in': grad_in, 'grad_out': grad_out}


def update(inputs, outputs, center, target, rate=0.1):
    finite(rate, 0, 1, '学習率')
    result = objective(inputs, outputs, center, target)
    ni, no = (copy.deepcopy(inputs), copy.deepcopy(outputs))
    ni[center] = [x - rate * g for x, g in zip(inputs[center], result['grad_in'])]
    no = [[x - rate * g for x, g in zip(row, grad)] for row, grad in zip(outputs, result['grad_out'])]
    return (ni, no, result)


def train(corpus=CORPUS, epochs=20, rate=0.1, seed=65535, window=1):
    vocab = validate_corpus(corpus)
    epochs = integer(epochs, 0, 200, 'エポック')
    finite(rate, 0, 1, '学習率')
    training = pairs(corpus, window)
    if not training:
        raise ValueError('周辺語のある文が必要')
    inputs, outputs = initial_vectors(len(vocab), seed)

    def loss():
        return sum((objective(inputs, outputs, c, t)['loss'] for c, t in training)) / len(training)
    history = [loss()]
    for _ in range(epochs):
        for center, target in training:
            inputs, outputs, _ = update(inputs, outputs, center, target, rate)
        history.append(loss())
    return {'vocab': vocab, 'pairs': training, 'inputs': inputs, 'outputs': outputs, 'loss_history': history}


def recognize(acoustic=(0.6, 0.4), prior=(0.2, 0.8), weight=1):
    if len(acoustic) != 2 or len(prior) != 2:
        raise ValueError('候補は雨・飴の2件')
    for x in [*acoustic, *prior]:
        finite(x, 1e-12, 1, '尤度・事前確率')
    if not math.isclose(sum(prior), 1, rel_tol=1e-09, abs_tol=1e-09):
        raise ValueError('事前確率の合計は1')
    finite(weight, 0, 3, 'λ')
    scores = [math.log(a) + weight * math.log(p) for a, p in zip(acoustic, prior)]
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



def lesson_morph(cost=5):
    lexicon = copy.deepcopy(LEXICON)
    lexicon[-1] = ('活','名詞',cost)
    result = analyze('研究生活',lexicon)
    rows = [(edge['start'],edge['end'],edge['word'],edge['pos'],edge['cost']) for edge in result['edges']]
    chosen, cumulative = [], 0
    for word,pos,value in result['tokens']:
        cumulative += value
        chosen.append((word,pos,value,cumulative))
    return {'title':'切り分け：候補のコストから経路を選ぶ','question':'研究＋生活と研究生＋活のどちらを選ぶか',
            'input':f'研究生活、活のコスト={cost}','columns':['開始文字','終了文字','候補','品詞','コスト'],'rows':rows,
            'tables':[('選択された経路を順に足す',['語','品詞','コスト','ここまでの合計'],chosen)],
            'result':f"選択={result['tokens']}、合計={result['cost']}",
            'comparison':f"元の辞書では{analyze('研究生活')['tokens']}",
            'explanation':'未知の1文字もコスト10の候補。合計が小さい経路を選び、同点は辞書の順。字種で区切るだけでは品詞は分からない。',
            'reset':'cost=5で再実行。元の辞書は変更しない。'}


def lesson_bigram(alpha=1):
    result = bigram(alpha=alpha)
    rows = [(word,count,count+alpha,result['denominator'],probability) for word,count,probability in zip(result['vocab'],result['counts'],result['probabilities'])]
    return {'title':'出現回数から次の語の確率へ','question':'一度も出なかった語の確率はどうなるか',
            'input':f'4文書、直前の語=が、加算量α={alpha}','columns':['次の語','回数','回数＋α','全回数＋α×語彙数','割った確率'],'rows':rows,
            'result':f"分母={result['denominator']}、確率の合計={sum(result['probabilities'])}",
            'comparison':f"α=0の確率={bigram(alpha=0)['probabilities']}",
            'explanation':'がの次だけを数える。語彙には文末記号も含む。加算平滑化は観測されなかった語にも値を配る。',
            'reset':'alpha=1で再実行。固定コーパスは変更しない。'}


def lesson_tfidf(document=0):
    result = tfidf()
    rows = [(word,result['counts'][document][j],len(CORPUS[document]),result['tf'][document][j],result['df'][j],result['idf'][j],result['scores'][document][j]) for j,word in enumerate(result['vocab'])]
    other = (document+1)%len(CORPUS)
    return {'title':'語の回数→TF・IDF→文書の特徴量','question':'全部の文書にある「が」は強い特徴になるか',
            'input':f'文書{document}: {CORPUS[document]}、全4文書','columns':['語','文書内回数','文書語数','TF','DF','log(4/DF)','TF×IDF'],'rows':rows,
            'matrices':[('文書×語の回数',result['counts']),('文書×語のTF-IDF',result['scores'])],
            'result':result['scores'][document], 'comparison':f"隣の文書{other}の特徴量={result['scores'][other]}",
            'explanation':'TFの分母はその文書の語数、IDFは全体の文書数と出現文書数を使う。「が」はDF=4でIDF=0。',
            'reset':'document=0で再実行。語彙の並びは表の順。'}


def lesson_vectors(window=1):
    result = representations(window=window)
    a,b = result['cooccurrence'][0],result['cooccurrence'][3]
    similarity = cosine(a,b)
    rows = [(word,a[j],b[j],a[j]*b[j]) for j,word in enumerate(result['vocab'])]
    return {'title':'周辺の語を数え、ベクトルを比較する','question':'猫と犬の表記が違っても似たベクトルになるか',
            'input':f'中心語の左右{window}語を数える。猫と犬の行を比較。','columns':['周辺語','猫の回数','犬の回数','積'],'rows':rows,
            'matrices':[('語の順：'+str(result['vocab']),result['cooccurrence'])],
            'result':f'内積・長さ・cos類似度={similarity}',
            'comparison':f"窓幅2の猫の行={representations(window=2)['cooccurrence'][0]}",
            'explanation':'内積を二つの長さの積で割る。ゼロベクトルではcosは未定義。似た周辺語を持つことと同義語であることは同一ではない。',
            'reset':'window=1で再実行。'}


def lesson_update(rate=0.1):
    vocab = validate_corpus(CORPUS)
    inputs, outputs = initial_vectors(len(vocab))
    new_inputs,new_outputs,result = update(inputs,outputs,0,1,rate)
    rows = [(word,result['probabilities'][j],int(j==1),result['probabilities'][j]-int(j==1)) for j,word in enumerate(vocab)]
    changes = [(j,inputs[0][j],result['grad_in'][j],rate,new_inputs[0][j]) for j in range(2)]
    return {'title':'中心語から周辺語を予測し、ベクトルを更新する','question':'学習率0では損失やベクトルが変わるか',
            'input':'中心語=猫、正解の周辺語=が、固定seedの2次元ベクトル','columns':['候補語','予測出力','正解なら1','差'],'rows':rows,
            'tables':[('猫の入力ベクトルの更新',['次元','更新前','勾配','学習率','更新後'],changes)],
            'matrices':[('更新前の出力側ベクトル',outputs),('更新後の出力側ベクトル',new_outputs)],
            'result':f"1組の損失 {result['loss']} → {objective(new_inputs,new_outputs,0,1)['loss']}",
            'comparison':f"学習率0では入力ベクトル不変={update(inputs,outputs,0,1,0)[0]==inputs}",
            'explanation':'差を使って入力側と出力側を更新する。両方の勾配は更新前の同じ値から求める。単語を数える表とは別の学習方法。',
            'reset':'rate=0.1で再実行。同じ初期ベクトルから1更新する。'}


def lesson_speech(weight=1):
    acoustic,prior = (.6,.4),(.2,.8)
    result = recognize(acoustic,prior,weight)
    rows = [(word,acoustic[j],math.log(acoustic[j]),prior[j],weight*math.log(prior[j]),result['scores'][j]) for j,word in enumerate(result['candidates'])]
    return {'title':'音声候補：音の尤度と言語の事前確率を合わせる','question':'音だけの候補と文脈を使う候補は同じか',
            'input':f'架空の2候補、言語の重みλ={weight}','columns':['候補','音の尤度','log尤度','事前確率','λ×log事前','合計スコア'],'rows':rows,
            'result':f"大きいスコアの候補={result['winner']}",
            'comparison':f"λ=0（音だけ）なら{recognize(weight=0)['winner']}",
            'explanation':'録音を解析した結果ではなく、固定値で候補選択の仕組みを見る教材。スコアは確率そのものではない。',
            'reset':'weight=1で再実行。'}

STUDY_THEMES = {'morph': lesson_morph, 'bigram': lesson_bigram, 'tfidf': lesson_tfidf, 'vectors': lesson_vectors, 'update': lesson_update, 'speech': lesson_speech}

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
        parser.add_argument('--demo', action='store_true', help='固定入力の基準実行')
        parser.add_argument('--json', action='store_true', help='照合用JSON')
        args = parser.parse_args()
        print(json.dumps(demo(), ensure_ascii=False, indent=None if args.json else 2))
