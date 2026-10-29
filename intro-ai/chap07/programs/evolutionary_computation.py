"""第9回：GA・ACO・人工魚群の教材用モデル。標準ライブラリのみ。

入力・実行方法・モデルの簡略化は同梱の guide.html を参照。
"""
import argparse
import copy
import json
import math

SEED = 65535
POPULATION = ['100000', '110000', '111000', '101010', '010101', '001111']
LENGTHS = [4.0, 6.0, 8.0]
POSITIONS = [[-1.5, -1.0], [-1.0, 1.0], [0.5, 1.5],
             [1.5, 0.5], [1.0, -1.5], [-0.5, -0.5]]


def finite(value, low, high, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not low <= value <= high:
        raise ValueError(f'{name}は{low}〜{high}の有限数です')
    return value


def integer(value, low, high, name):
    finite(value, low, high, name)
    if not isinstance(value, int):
        raise ValueError(f'{name}は整数です')
    return value


class RNG:
    """教材用32bit LCG。呼出しごとに状態を進め、[0,1)を返す。"""
    def __init__(self, seed=SEED):
        self.state = integer(seed, 0, 2**32 - 1, 'シード')

    def random(self):
        self.state = (1664525 * self.state + 1013904223) % 2**32
        return self.state / 2**32


def probabilities(weights):
    if not weights:
        raise ValueError('重みを1個以上指定してください')
    for w in weights:
        finite(w, 0, 1e12, '重み')
    total = sum(weights)
    return [w / total for w in weights] if total else [1 / len(weights)] * len(weights)


def choose(probs, rng):
    u, total = rng.random(), 0.0
    for i, p in enumerate(probs):
        total += p
        if u < total:
            return i
    return len(probs) - 1


def fitness(bits):
    if not isinstance(bits, str) or len(bits) != 6 or any(c not in '01' for c in bits):
        raise ValueError('個体は0と1からなる6文字です')
    return bits.count('1')


def ga_evaluate(population):
    if len(population) != 6:
        raise ValueError('集団は6個体です')
    values = [fitness(x) for x in population]
    return {'fitness': values, 'probabilities': probabilities(values),
            'current_best': max(values), 'mean': sum(values) / 6,
            'diversity': len(set(population))}


def crossover(a, b, cut):
    fitness(a)
    fitness(b)
    integer(cut, 1, 5, '交叉位置')
    return [a[:cut] + b[cut:], b[:cut] + a[cut:]]


def mutate(bits, rate, rng):
    fitness(bits)
    finite(rate, 0, 1, '突然変異率')
    return ''.join(str(1 - int(c)) if rng.random() < rate else c for c in bits)


def ga_step(population, rng, mutation=0.1):
    finite(mutation, 0, 1, '突然変異率')
    ev = ga_evaluate(population)
    elite = ev['fitness'].index(ev['current_best'])
    children, trace = [population[elite]], []
    while len(children) < 6:
        parents = [choose(ev['probabilities'], rng), choose(ev['probabilities'], rng)]
        cut = 1 + int(5 * rng.random())
        crossed = crossover(population[parents[0]], population[parents[1]], cut)
        # 最後の組でも2個体分の乱数を消費し、超過する子だけを捨てる。
        mutated = [mutate(x, mutation, rng) for x in crossed]
        trace.append({'parents': parents, 'cut': cut, 'crossed': crossed, 'mutated': mutated})
        children.extend(mutated[:6 - len(children)])
    return {'population': children, 'elite_index': elite, 'trace': trace, **ga_evaluate(children)}


def run_ga(steps=20, mutation=0.1, seed=SEED, population=None):
    integer(steps, 0, 200, '世代数')
    finite(mutation, 0, 1, '突然変異率')
    pop = list(POPULATION if population is None else population)
    rng = RNG(seed)
    history = [{'step': 0, **ga_evaluate(pop)}]
    for step in range(1, steps + 1):
        result = ga_step(pop, rng, mutation)
        pop = result['population']
        history.append({'step': step, **ga_evaluate(pop)})
    return {'population': pop, 'history': history, 'best_seen': max(h['current_best'] for h in history)}


def aco_probabilities(tau, lengths=LENGTHS):
    if len(tau) != 3 or len(lengths) != 3:
        raise ValueError('経路は3本です')
    for d in lengths:
        finite(d, 0.1, 100, '経路長')
    for t in tau:
        finite(t, 0, 1e6, 'フェロモン')
    return probabilities([t / d for t, d in zip(tau, lengths)])


def aco_update(tau, counts, evaporation=0.25, lengths=LENGTHS):
    aco_probabilities(tau, lengths)
    finite(evaporation, 0, 1, '蒸発率')
    if len(counts) != 3:
        raise ValueError('通過数は3本分です')
    for count in counts:
        integer(count, 0, 6, '通過数')
    if sum(counts) > 6:
        raise ValueError('蟻は最大6匹です')
    evaporated = [(1 - evaporation) * t for t in tau]
    deposits = [6 * n / d for n, d in zip(counts, lengths)]
    return {'evaporated': evaporated, 'deposits': deposits,
            'tau': [t + d for t, d in zip(evaporated, deposits)]}


def aco_step(tau, rng, evaporation=0.25, lengths=LENGTHS):
    finite(evaporation, 0, 1, '蒸発率')
    probs = aco_probabilities(tau, lengths)
    choices = [choose(probs, rng) for _ in range(6)]
    counts = [choices.count(i) for i in range(3)]
    return {'probabilities': probs, 'choices': choices, 'counts': counts,
            'current_best': min(lengths[i] for i in choices),
            **aco_update(tau, counts, evaporation, lengths)}


def run_aco(steps=20, evaporation=0.25, seed=SEED, tau=None, lengths=None):
    integer(steps, 0, 200, '反復数')
    finite(evaporation, 0, 1, '蒸発率')
    current = list([1.0] * 3 if tau is None else tau)
    lengths = list(LENGTHS if lengths is None else lengths)
    aco_probabilities(current, lengths)
    rng, history, best = RNG(seed), [], None
    for step in range(1, steps + 1):
        r = aco_step(current, rng, evaporation, lengths)
        best = r['current_best'] if best is None else min(best, r['current_best'])
        current = r['tau']
        history.append({'step': step, **r, 'best_seen': best})
    return {'tau': current, 'history': history, 'best_seen': best}


def objective(point):
    if len(point) != 2:
        raise ValueError('位置はx,yの2値です')
    for v in point:
        finite(v, -2, 2, '座標')
    return point[0] ** 2 + point[1] ** 2


def distance(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def move_toward(point, target, step=0.2):
    objective(point)
    objective(target)
    finite(step, 0, 1, '移動幅')
    d = distance(point, target)
    if d == 0:
        return list(point)
    scale = min(step, d) / d
    return [max(-2.0, min(2.0, a + scale * (b - a))) for a, b in zip(point, target)]


def random_target(point, visual, rng):
    # 半径→角度の順。半径一様（円内面積一様ではない）という教材仕様。
    radius, angle = visual * rng.random(), 2 * math.pi * rng.random()
    return [max(-2.0, min(2.0, point[0] + radius * math.cos(angle))),
            max(-2.0, min(2.0, point[1] + radius * math.sin(angle)))]


def fish_action(points, index, rng, visual=1.0, step=0.2, crowd=2):
    if not 1 <= len(points) <= 30:
        raise ValueError('魚は1〜30匹です')
    for point in points:
        objective(point)
    integer(index, 0, len(points) - 1, '魚番号')
    finite(visual, 0, 4, '視野')
    finite(step, 0, 1, '移動幅')
    integer(crowd, 0, 29, '混雑上限')
    p = points[index]
    neighbors = [j for j, q in enumerate(points) if j != index and distance(p, q) <= visual]
    candidates = []
    if neighbors:
        best = min(neighbors, key=lambda j: objective(points[j]))
        center = [sum(points[j][k] for j in neighbors) / len(neighbors) for k in range(2)]
        for action, target in [('follow', points[best]), ('swarm', center)]:
            density = sum(j != index and distance(target, q) <= visual for j, q in enumerate(points))
            moved = move_toward(p, target, step)
            accepted = density <= crowd and objective(target) < objective(p) and objective(moved) < objective(p)
            candidates.append({'action': action, 'target': list(target), 'density': density,
                               'accepted': accepted, 'position': moved})
    accepted = [c for c in candidates if c['accepted']]
    if accepted:
        chosen = min(accepted, key=lambda c: objective(c['position']))
        return {**chosen, 'neighbors': neighbors, 'candidates': candidates, 'trials': []}
    trials = []
    for _ in range(3):
        target = random_target(p, visual, rng)
        trials.append(target)
        if objective(target) < objective(p):
            return {'action': 'prey', 'position': move_toward(p, target, step),
                    'neighbors': neighbors, 'candidates': candidates, 'trials': trials}
    target = random_target(p, visual, rng)
    return {'action': 'random', 'position': move_toward(p, target, step),
            'neighbors': neighbors, 'candidates': candidates, 'trials': trials}


def fish_step(points, rng, visual=1.0, step=0.2, crowd=2):
    # 全魚の候補を同じ旧状態から作る。同一反復内の新位置を参照しない。
    actions = [fish_action(points, i, rng, visual, step, crowd) for i in range(len(points))]
    return {'positions': [a['position'] for a in actions], 'actions': actions}


def run_fish(steps=20, visual=1.0, step=0.2, crowd=2, seed=SEED, positions=None):
    integer(steps, 0, 200, '反復数')
    finite(visual, 0, 4, '視野')
    finite(step, 0, 1, '移動幅')
    integer(crowd, 0, 29, '混雑上限')
    points = copy.deepcopy(POSITIONS if positions is None else positions)
    if not 1 <= len(points) <= 30:
        raise ValueError('魚は1〜30匹です')
    values = [objective(p) for p in points]
    best, best_position = min(values), list(points[values.index(min(values))])
    rng = RNG(seed)
    history = [{'step': 0, 'current_best': best, 'best_seen': best}]
    for iteration in range(1, steps + 1):
        result = fish_step(points, rng, visual, step, crowd)
        points = result['positions']
        values = [objective(p) for p in points]
        current = min(values)
        if current < best:
            best, best_position = current, list(points[values.index(current)])
        history.append({'step': iteration, 'current_best': current, 'best_seen': best})
    return {'positions': points, 'history': history, 'best_seen': best, 'best_position': best_position}


def rounded(value):
    if isinstance(value, float):
        return round(value, 6)
    if isinstance(value, list):
        return [rounded(x) for x in value]
    if isinstance(value, dict):
        return {k: rounded(v) for k, v in value.items()}
    return value


def demo():
    return rounded({'ga_initial': ga_evaluate(POPULATION),
                    'ga_step': ga_step(POPULATION, RNG()), 'ga': run_ga(),
                    'aco_step': aco_step([1.0] * 3, RNG()), 'aco': run_aco(),
                    'fish_step': fish_step(POSITIONS, RNG()), 'fish': run_fish()})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--demo', action='store_true', help='固定条件で三手法を実行')
    parser.add_argument('--json', action='store_true', help='検証用JSONを表示')
    args = parser.parse_args()
    result = demo()
    if args.json:
        print(json.dumps(result, ensure_ascii=False))
    else:
        print('GA 初期最良4 →', result['ga']['best_seen'], '（大きいほどよい、既知最適6）')
        print('ACO 探索中の最短経路長:', result['aco']['best_seen'], '（既知最短4）')
        print('AFSA 初期最良0.5 →', result['fish']['best_seen'], '（小さいほどよい、既知最適0）')
        print('単一シードの教材例です。最適解への到達を保証しません。')
