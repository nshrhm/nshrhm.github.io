"""第14回: 架空の固定結果を比較する。AIの学習・生成・実測ではない。"""
from copy import deepcopy
import argparse
import json

DATA = {
    'A': {'normal': {'correct': [1,1,1,1,1,0], 'scores': [95,90,85,80,75,90]},
          'changed': {'correct': [1,1,0,0,0,0], 'scores': [95,80,75,65,55,45]}},
    'B': {'normal': {'correct': [1,1,1,1,0,0], 'scores': [90,85,80,75,70,60]},
          'changed': {'correct': [1,1,1,1,0,0], 'scores': [85,80,75,70,65,55]}},
}
BASE = dict(threshold=0, normal_percent=50, review_cost=4, cost_a=1,
            cost_b=3, min_accuracy=80, min_coverage=50)


def integer(value, name):
    if type(value) is not int or not 0 <= value <= 100:
        raise ValueError(f'{name}: 0〜100の整数を指定してください')
    return value


def configuration(config=None):
    if config is None:
        return deepcopy(BASE)
    if not isinstance(config, dict) or set(config) - set(BASE):
        raise ValueError('未知の設定です')
    result = dict(BASE, **config)
    for key, value in result.items():
        integer(value, key)
    return result


def records(method, group='all'):
    if method not in ('A', 'B') or group not in ('all', 'normal', 'changed'):
        raise ValueError('未知の方式または条件です')
    rows = []
    for kind in ('normal', 'changed'):
        if group not in ('all', kind):
            continue
        for index, (correct, score) in enumerate(zip(DATA[method][kind]['correct'], DATA[method][kind]['scores']), 1):
            rows.append(dict(id=('N' if kind == 'normal' else 'C') + str(index),
                             group=kind, correct=correct, score=score))
    return rows


def inspect_case(method, case_id):
    for row in records(method):
        if row['id'] == case_id:
            return row
    raise ValueError('未知のケースです')


def aggregate(method, threshold=0, group='all'):
    integer(threshold, 'threshold')
    rows = records(method, group)
    selected = [r for r in rows if r['score'] >= threshold]
    total, answered = len(rows), len(selected)
    correct = sum(r['correct'] for r in selected)
    return dict(total=total, correct=sum(r['correct'] for r in rows),
                answered=answered, correct_answered=correct, withheld=total-answered,
                accuracy=correct/answered if answered else None,
                coverage=answered/total, correct_per_total=correct/total,
                selected_ids=[r['id'] for r in selected])


def choose(candidates, min_accuracy, min_coverage):
    """固定候補の条件照合。丸め前の整数積で境界を比較する。"""
    integer(min_accuracy, 'min_accuracy')
    integer(min_coverage, 'min_coverage')
    eligible = [deepcopy(c) for c in candidates if c['answered'] > 0
                and c['correct_answered']*100 >= min_accuracy*c['answered']
                and c['answered']*100 >= min_coverage*c['total']]
    eligible.sort(key=lambda c: (c['cost'], -c['coverage'], -c['accuracy'], c['method'], c['threshold']))
    return eligible[0] if eligible else None


def evaluate(config=None):
    c = configuration(config)
    groups, mixture, answers, candidates = {}, {}, {}, []
    for method in ('A', 'B'):
        groups[method] = {kind: aggregate(method, 0, kind) for kind in ('all', 'normal', 'changed')}
        normal, changed = groups[method]['normal'], groups[method]['changed']
        mixture[method] = (normal['correct']*c['normal_percent'] + changed['correct']*(100-c['normal_percent']))/600
        cost = c['cost_a' if method == 'A' else 'cost_b']
        answers[method] = aggregate(method, c['threshold'])
        answers[method]['cost'] = 12*cost + answers[method]['withheld']*c['review_cost']
        for threshold in (0, 80, 100):
            row = dict(method=method, threshold=threshold, **aggregate(method, threshold))
            row['cost'] = 12*cost + row['withheld']*c['review_cost']
            row['eligible'] = (row['answered'] > 0 and row['correct_answered']*100 >= c['min_accuracy']*row['answered']
                               and row['answered']*100 >= c['min_coverage']*12)
            candidates.append(row)
    return dict(config=c, groups=groups, mixture=mixture, answers=answers,
                candidates=candidates, best=choose(candidates, c['min_accuracy'], c['min_coverage']))


def experiment_configs():
    cases = {}
    for name, field, value, base_threshold in (
        ('threshold', 'threshold', 80, 0), ('mixture', 'normal_percent', 75, 0),
        ('review', 'review_cost', 10, 80), ('cost_b', 'cost_b', 1, 80),
        ('coverage', 'min_coverage', 40, 0), ('accuracy', 'min_accuracy', 90, 0)):
        base = dict(BASE, threshold=base_threshold)
        changed = dict(base, **{field: value})
        cases[name] = dict(base=base, changed=changed)
    return cases


def rounded(value):
    if isinstance(value, dict):
        return {k: rounded(v) for k, v in value.items()}
    if isinstance(value, list):
        return [rounded(v) for v in value]
    return round(value, 6) if isinstance(value, float) else value


def demo():
    return rounded(dict(baseline=evaluate(), changes={name: dict(before=evaluate(case['base']), after=evaluate(case['changed']))
                                                    for name, case in experiment_configs().items()}))



def lesson_cases(method='A'):
    rows = [(r['id'],r['group'],r['score'],r['correct']) for r in records(method)]
    tables = []
    for group in ('normal','changed','all'):
        a = aggregate(method,0,group)
        tables.append((group,['正解数','対象数','正解数÷対象数'],[(a['correct'],a['total'],a['accuracy'])]))
    return {'title':'12事例を一つずつ数える','question':'高いスコアなら必ず正解か',
            'input':f'架空方式{method}の固定12事例。実サービスの測定結果ではない。',
            'columns':['事例ID','対象条件','方式のスコア','正解なら1'],'rows':rows,'tables':tables,
            'result':aggregate(method),'comparison':'AのN6はスコア90でも不正解。Bへ変更して各条件と全体を比較する。',
            'explanation':'N1〜N6は通常条件、C1〜C6は変化条件。スコアと正解ラベルは別。正解率の分母は対象事例数。',
            'reset':'method="A"で再実行。固定データを変更しない。'}


def lesson_mixture(normal_percent=50):
    result = evaluate({'normal_percent':normal_percent})
    rows = []
    for method in ('A','B'):
        n,c = result['groups'][method]['normal'],result['groups'][method]['changed']
        rows.append((method,n['correct'],c['correct'],normal_percent/100,1-normal_percent/100,n['accuracy']*normal_percent/100,c['accuracy']*(100-normal_percent)/100,result['mixture'][method]))
    return {'title':'対象集団の割合を変えて比べる','question':'通常条件が多い集団でも順位は同じか',
            'input':f'通常{normal_percent}%・変化{100-normal_percent}%。各群の6事例はそのまま。',
            'columns':['方式','通常の正解/6','変化の正解/6','通常の重み','変化の重み','通常の寄与','変化の寄与','加重正解率'],'rows':rows,
            'result':result['mixture'],'comparison':'通常割合50→75でAの加重正解率は7/12→17/24。Bは両群4/6なので変わらない。',
            'explanation':'新しい実測事例を作ったのではなく、固定した群別正解率を割合で重み付けした比較。',
            'reset':'normal_percent=50で再実行。'}


def lesson_abstention(threshold=80):
    a = aggregate('A',threshold)
    rows = [(r['id'],r['score'],r['correct'],'回答' if r['score']>=threshold else '保留') for r in records('A')]
    return {'title':'保留すると、三つの分母がどう変わるか','question':'回答内正解率が高ければ全事例を解決したと言えるか',
            'input':f'方式A、スコア≥{threshold}だけ回答。',
            'columns':['事例','スコア','正解','判定'],'rows':rows,
            'tables':[('集計の分子と分母',['指標','分子','分母','値'],[('回答内正解率',a['correct_answered'],a['answered'],a['accuracy']),('回答率',a['answered'],a['total'],a['coverage']),('全事例あたり正解',a['correct_answered'],a['total'],a['correct_per_total'])])],
            'result':a,'comparison':'しきい値80では6/7正解・7/12回答。100では回答0、回答内正解率はNone（定義できない）。',
            'explanation':'保留を正解にも誤答にも加えず、回答率と併記する。回答0の正解率を0%や100%と補わない。',
            'reset':'threshold=80で再実行。'}


def lesson_cost(review_cost=4):
    result = evaluate({'threshold':80,'review_cost':review_cost})
    rows = []
    for method,unit in [('A',BASE['cost_a']),('B',BASE['cost_b'])]:
        a=result['answers'][method]
        rows.append((method,12,unit,12*unit,a['withheld'],review_cost,a['withheld']*review_cost,a['cost']))
    return {'title':'全件の処理費用と保留の確認費用を足す','question':'安い方式でも人の確認が多いとどうなるか',
            'input':f'しきい値80、人の確認1件={review_cost}費用単位。架空の費用。',
            'columns':['方式','全件数','処理単価','処理費用','保留数','確認単価','確認費用','総費用'],'rows':rows,
            'result':result['answers'],'comparison':'確認単価4→10でAの総費用32→62、Bは64→106。',
            'explanation':'保留事例も先に方式を通しているため、方式の処理費用は回答数ではなく全12件にかかる。',
            'reset':'review_cost=4で再実行。'}


def lesson_choice(min_coverage=50):
    result = evaluate({'min_coverage':min_coverage})
    rows = []
    for c in result['candidates']:
        rows.append((c['method'],c['threshold'],c['correct_answered'],c['answered'],c['accuracy'],c['coverage'],c['cost'],c['eligible']))
    return {'title':'条件に合う候補だけで費用を比べる','question':'最安だけを見て決めてよいか',
            'input':f'回答内正解率80%以上、回答率{min_coverage}%以上。候補はA/B×しきい値0/80/100。',
            'columns':['方式','しきい値','回答中正解','回答数/12','回答内正解率','回答率','費用','適合'],'rows':rows,
            'result':result['best'] if result['best'] else '適合候補なし',
            'comparison':'回答率50→100では適合候補がなくなる。条件を黙って緩めない。',
            'explanation':'丸め前の整数積で条件判定し、適合候補の中で費用を比較する。架空12事例の範囲での選択であり、実製品の性能順位ではない。',
            'reset':'min_coverage=50で再実行。'}

STUDY_THEMES = {'cases': lesson_cases, 'mixture': lesson_mixture, 'abstention': lesson_abstention, 'cost': lesson_cost, 'choice': lesson_choice}

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
        parser.add_argument('--demo', action='store_true', help='基準結果と6変更例')
        parser.add_argument('--json', action='store_true', help='6桁に丸めた機械照合用JSON')
        args = parser.parse_args()
        result = demo()
        if not args.json:
            print('架空の固定結果。AIの学習・生成・実測ではありません。')
            print('A 7/12、B 8/12。基準の適合候補 A・しきい値80・費用32。')
        print(json.dumps(result, ensure_ascii=False, indent=None if args.json else 2, allow_nan=False))
