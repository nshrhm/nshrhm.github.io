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



def lesson_environment(delayed_reward=10):
    rows = []
    for state in STATES:
        for action in ACTIONS:
            next_state,reward,terminal = transition(state,action,delayed_reward)
            rows.append((state,action,reward,next_state,terminal))
    return {'title':'環境：状態→行動→報酬→次状態','question':'右を選んだ直後の報酬が0でも、その先へ進む価値はあるか',
            'input':f'行動できる状態は0と2。終端は1・3・4。遅延報酬={delayed_reward}',
            'columns':['現在状態','行動','今の報酬','次状態','終端か'],'rows':rows,
            'tables':[('二つの経路を比較',['経路','報酬列','合計','γ=0.9の割引収益'],
                      [('0→1','[4]',4,path_return([4],.9)['discounted']),('0→2→4',str([0,delayed_reward]),delayed_reward,path_return([0,delayed_reward],.9)['discounted'])])],
            'result':'左は1回で終了、右は状態2でもう一度行動する。',
            'comparison':'遅延報酬を10→2にすると、右経路の割引収益は9→1.8。',
            'explanation':'報酬は環境から受け取り、Q値は経験から更新する。終端では次の行動がない。',
            'reset':'delayed_reward=10で再実行。'}


def lesson_update(alpha=0.5):
    result = update_value(2,1,6,False,alpha,.9)
    terminal = update_value(2,1,6,True,alpha,.9)
    rows = [('非終端',result['old'],result['reward'],result['next_max'],.9,result['target'],result['error'],alpha,result['new']),
            ('終端',terminal['old'],terminal['reward'],'使わない',.9,terminal['target'],terminal['error'],alpha,terminal['new'])]
    return {'title':'Q更新：目標値→差→更新後','question':'同じ数値でも次が終端なら目標はどう変わるか',
            'input':'式を確かめる手計算例：旧Q2、報酬1、次の最大Q6、γ0.9。実環境の報酬とは区別。',
            'columns':['条件','旧Q','報酬','次の最大Q','γ','目標','差','α','新Q'],'rows':rows,
            'result':f"2＋{alpha}×({result['target']}−2)={result['new']}",
            'comparison':f"α=0では{update_value(2,1,6,False,0,.9)['new']}、α=1では{update_value(2,1,6,False,1,.9)['new']}",
            'explanation':'非終端の目標は報酬＋γ×次の最大Q。終端なら報酬だけ。αは目標へ近づく割合。',
            'reset':'alpha=0.5で再実行。'}


def lesson_training(steps=6):
    trainer = Trainer()
    rows, tables = [], []
    for index in range(steps):
        before = deepcopy(trainer.q)
        record = trainer.step()
        if record is None:
            break
        rows.append((index+1,record['state'],record['action'],record['reward'],record['next_state'],record['terminal'],record['old'],record['target'],record['error'],record['new']))
        tables.append((f'経験{index+1}で変えたQ表',['状態','更新前の左','更新前の右','更新後の左','更新後の右'],
                       [(state,*before[i],*trainer.q[i]) for i,state in enumerate(STATES)]))
    return {'title':'実際の経験からQ表の1マスを更新する','question':'一つの行動でQ表の全部を書き換えるか',
            'input':f'初期Qは全0、固定seed、{steps}行動。行動数とエピソード数を区別。',
            'columns':['行動番号','状態','行動','報酬','次状態','終端','旧Q','目標','差','新Q'],'rows':rows,'tables':tables,
            'result':f'完了エピソード={trainer.completed}、Q表={trainer.q}',
            'comparison':'stepsを6→12にすると、同じ初期状態から12行動分を見直す。前の6行動の続きではない。',
            'explanation':'各経験の状態行と行動列の1マスだけを更新する。目標には更新前のQ表を使う。終端を経験すると1エピソードが完了する。',
            'reset':'steps=6で再実行。Trainerを新しく作り、Q表と乱数状態を戻す。'}


def lesson_exploration(epsilon=0.3):
    row = [4.,0.]
    rng = RNG(BASE['seed'])
    rows = []
    for index in range(8):
        choice = select_action(row,epsilon,rng)
        rows.append((index+1,*choice['draws'],choice['explore'],choice['action']))
    return {'title':'探索と活用：どの行動を選ぶか','question':'探索したとき必ず悪い方の行動になるか',
            'input':f'Qの左4・右0、探索率ε={epsilon}。Q表はこの比較では固定。',
            'columns':['回','探索判定の乱数','探索時の行動乱数','探索か','選んだ行動'],'rows':rows,
            'result':f'左・右の選択確率={probabilities(row,epsilon)}',
            'comparison':f'ε=0の確率={probabilities(row,0)}、ε=1の確率={probabilities(row,1)}',
            'explanation':'探索では左右から選ぶため、良い方を選ぶ場合もある。εは行動選択、αは更新量、γは将来価値の重み。',
            'reset':'epsilon=0.3で再実行。同じseedから8回選ぶ。'}


def lesson_evaluation(gamma=0.9):
    result = train({'gamma':gamma})
    evaluation = result['evaluation']
    rows = [(i,state,evaluation['actions'][i],evaluation['rewards'][i],gamma**i,evaluation['rewards'][i]*gamma**i) for i,state in enumerate(evaluation['path'][:-1])]
    return {'title':'学習した方策を、更新せず評価する','question':'報酬の合計と割引収益は同じか',
            'input':f'100エピソード後のQ表、γ={gamma}、評価時はε=0・Q更新なし。',
            'columns':['時刻','状態','行動','報酬','割引係数','割引した報酬'],'rows':rows,
            'tables':[('Q表：学習値と既知環境の参照値は別',['状態','学習した左','学習した右','参照の左','参照の右'],[(state,*result['q'][i],*optimal_q(gamma)[i]) for i,state in enumerate(STATES)])],
            'result':evaluation,'comparison':'γを0.9→0.2にすると、遠い報酬の重みが小さくなる。',
            'explanation':'学習中の探索経路を、そのまま評価経路と呼ばない。既知環境の最適Qを学習で得た値と混同しない。',
            'reset':'gamma=0.9で再実行。初期Q・seedから再学習して評価する。'}

STUDY_THEMES = {'environment': lesson_environment, 'update': lesson_update, 'training': lesson_training, 'exploration': lesson_exploration, 'evaluation': lesson_evaluation}

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
        main()
