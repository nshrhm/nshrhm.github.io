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


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--demo', action='store_true', help='基準結果と6変更例')
    parser.add_argument('--json', action='store_true', help='6桁に丸めた機械照合用JSON')
    args = parser.parse_args()
    result = demo()
    if not args.json:
        print('架空の固定結果。AIの学習・生成・実測ではありません。')
        print('A 7/12、B 8/12。基準の適合候補 A・しきい値80・費用32。')
    print(json.dumps(result, ensure_ascii=False, indent=None if args.json else 2, allow_nan=False))
