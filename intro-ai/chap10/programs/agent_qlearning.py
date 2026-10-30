"""第12回: 小さな分岐環境でQ学習を観察する。標準ライブラリのみ。"""
import argparse
from copy import deepcopy
import json
import math

BASE = {'alpha': 0.5, 'gamma': 0.9, 'epsilon': 0.3,
        'episodes': 100, 'seed': 65535, 'delayed_reward': 10.0}
CHANGES = {'alpha': 0.1, 'gamma': 0.2, 'epsilon': 0.0,
           'episodes': 10, 'delayed_reward': 2.0, 'seed': 1}
STATES = (0, 2)
ACTIONS = ('left', 'right')


def number(x, low, high, name='値'):
    if isinstance(x, bool) or not isinstance(x, (int, float)) or not math.isfinite(x) or not low <= x <= high:
        raise ValueError(f'{name}は{low}〜{high}の有限数です')
    return x


def integer(x, low, high, name='値'):
    number(x, low, high, name)
    if not isinstance(x, int):
        raise ValueError(f'{name}は整数です')
    return x


def settings(config=None):
    result = dict(BASE)
    if config is not None:
        if not isinstance(config, dict) or set(config) - set(BASE):
            raise ValueError('設定名を確認してください')
        result.update(config)
    for k in ('alpha', 'gamma', 'epsilon'):
        number(result[k], 0, 1, k)
    integer(result['episodes'], 0, 200, 'エピソード数')
    integer(result['seed'], 0, 2**32 - 1, 'シード')
    number(result['delayed_reward'], -100, 100, '遅延報酬')
    return result


class RNG:
    def __init__(self, seed):
        self.state = integer(seed, 0, 2**32 - 1, 'シード')

    def random(self):
        self.state = (1664525 * self.state + 1013904223) % 2**32
        return self.state / 2**32


def qtable(q):
    if not isinstance(q, list) or len(q) != 2:
        raise ValueError('Q表は状態0・2の2行です')
    for row in q:
        if not isinstance(row, list) or len(row) != 2:
            raise ValueError('各行は左・右の2列です')
        for value in row:
            number(value, -100, 100, 'Q値')
    return q


def state_index(state):
    integer(state, 0, 4, '状態')
    if state not in STATES:
        raise ValueError('終端では行動できません')
    return STATES.index(state)


def transition(state, action, delayed_reward=10):
    state_index(state)
    if action not in ACTIONS:
        raise ValueError('行動はleftまたはrightです')
    number(delayed_reward, -100, 100, '遅延報酬')
    if state == 0:
        return (1, 4.0, True) if action == 'left' else (2, 0.0, False)
    return (3, 0.0, True) if action == 'left' else (4, delayed_reward, True)


def greedy(row):
    if not isinstance(row, list) or len(row) != 2:
        raise ValueError('左右のQ値を指定してください')
    for value in row:
        number(value, -100, 100, 'Q値')
    return 0 if row[0] >= row[1] else 1


def probabilities(row, epsilon):
    number(epsilon, 0, 1, '探索率')
    best = greedy(row)
    return [epsilon / 2 + (1 - epsilon if a == best else 0) for a in range(2)]


def select_action(row, epsilon, rng):
    probabilities(row, epsilon)  # 乱数消費前に検証する。
    coin, choice = rng.random(), rng.random()  # 活用時にも必ず2個消費する。
    explore = coin < epsilon
    a = int(choice * 2) if explore else greedy(row)
    return {'action': ACTIONS[a], 'explore': explore, 'draws': [coin, choice]}


def update_value(old, reward, next_max, terminal, alpha, gamma):
    for name, value in [('旧Q値', old), ('報酬', reward), ('次の最大Q値', next_max)]:
        number(value, -100, 100, name)
    number(alpha, 0, 1, '学習率')
    number(gamma, 0, 1, '割引率')
    if not isinstance(terminal, bool):
        raise ValueError('終端条件はboolです')
    target = reward if terminal else reward + gamma * next_max
    return {'old': old, 'reward': reward, 'next_max': next_max, 'terminal': terminal,
            'target': target, 'error': target - old, 'new': old + alpha * (target - old)}


def learn(q, state, action, alpha=0.5, gamma=0.9, delayed_reward=10):
    qtable(q)
    i = state_index(state)
    nxt, reward, terminal = transition(state, action, delayed_reward)
    a = ACTIONS.index(action)
    future = 0.0 if terminal else max(q[state_index(nxt)])
    result = update_value(q[i][a], reward, future, terminal, alpha, gamma)
    changed = deepcopy(q)
    changed[i][a] = result['new']
    return changed, {'state': state, 'action': action, 'next_state': nxt, **result}


def path_return(rewards, gamma):
    number(gamma, 0, 1, '割引率')
    if not isinstance(rewards, list) or not 1 <= len(rewards) <= 2:
        raise ValueError('報酬列は1〜2個です')
    for r in rewards:
        number(r, -100, 100, '報酬')
    return {'sum': sum(rewards), 'discounted': sum(gamma**i * r for i, r in enumerate(rewards))}


def evaluate(q, gamma=0.9, delayed_reward=10):
    qtable(q)
    number(gamma, 0, 1, '割引率')
    number(delayed_reward, -100, 100, '遅延報酬')
    state, path, actions, rewards = 0, [0], [], []
    while state in STATES:
        a = ACTIONS[greedy(q[state_index(state)])]
        state, reward, _ = transition(state, a, delayed_reward)
        path.append(state)
        actions.append(a)
        rewards.append(reward)
    return {'path': path, 'actions': actions, 'rewards': rewards, **path_return(rewards, gamma)}


def optimal_q(gamma=0.9, delayed_reward=10):
    """既知環境の参照値。学習処理からは呼ばない。"""
    number(gamma, 0, 1, '割引率')
    number(delayed_reward, -100, 100, '遅延報酬')
    return [[4.0, gamma * max(0, delayed_reward)], [0.0, delayed_reward]]


class Trainer:
    def __init__(self, config=None):
        self.config = settings(config)
        self.q = [[0.0, 0.0], [0.0, 0.0]]
        self.rng = RNG(self.config['seed'])
        self.state, self.completed = 0, 0
        self.history = []

    def step(self):
        if self.completed >= self.config['episodes']:
            return None
        if self.state not in STATES:
            self.state = 0
        choice = select_action(self.q[state_index(self.state)], self.config['epsilon'], self.rng)
        self.q, record = learn(self.q, self.state, choice['action'], self.config['alpha'],
                               self.config['gamma'], self.config['delayed_reward'])
        record.update(episode=self.completed + 1, explore=choice['explore'], draws=choice['draws'])
        self.history.append(record)
        self.state = record['next_state']
        if record['terminal']:
            self.completed += 1
        return deepcopy(record)

    def episode(self):
        before = self.completed
        while self.completed == before and self.step() is not None:
            pass
        return self.result()

    def finish(self):
        while self.step() is not None:
            pass
        return self.result()

    def result(self):
        return {'config': dict(self.config), 'q': deepcopy(self.q), 'completed': self.completed,
                'state': self.state, 'rng_state': self.rng.state, 'history': deepcopy(self.history),
                'evaluation': evaluate(self.q, self.config['gamma'], self.config['delayed_reward'])}


def train(config=None):
    return Trainer(config).finish()


def summary(result):
    return {k: deepcopy(result[k]) for k in ('config', 'q', 'completed', 'rng_state', 'evaluation')}


def round6(value):
    if isinstance(value, float):
        return round(value, 6)
    if isinstance(value, list):
        return [round6(v) for v in value]
    if isinstance(value, dict):
        return {k: round6(v) for k, v in value.items()}
    return value


def demo():
    base = train()
    return round6({'baseline': summary(base), 'first_updates': base['history'][:6],
                   'optimal_reference': optimal_q(),
                   'changes': {k: summary(train({**BASE, k: v})) for k, v in CHANGES.items()}})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--demo', action='store_true')
    parser.add_argument('--json', action='store_true')
    parser.parse_args()
    print(json.dumps(demo(), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
