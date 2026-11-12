"""昨年度 doctor.py を基にした学習用の簡易ELIZA。外部通信・学習は行わない。"""
import argparse
import re

LIMIT = 20
CYCLE = 5
GREETING = "私はDoctor、お話を伺います"
FAREWELL = "それではそろそろ終了しましょう。おつかれさまでした。"

# 上から調べ、最初に一致した規則だけを使う。順序もプログラムの一部。
RULES = [
    ("先生", "私のことでなくあなたのことを話しましょう"),
    ("母", "あなたのお母さんについて話してください"),
    ("父", "あなたのお父さんについて話してください"),
    ("意見", "私の意見を聞きたいのですか？"),
    ("が心配です", "{question}"),
]

DEMO_INPUTS = [
    "先生に相談したいです", "母が心配です", "父について話します",
    "あなたの意見を聞きたいです", "試験が心配です", "今日は晴れです",
    "こんにちは", "先生と母について", "父と母について", "母校の話です",
    "試験が心配です", "意見と父について", "授業が心配です",
    "父が心配です", "母が心配です", "先生について", "意見があります",
    "締切が心配です", "こんにちは", "最後の入力です",
]


class Doctor:
    """応答の状態を持つ。rules・cycle・limit を変更して比較できる。"""

    def __init__(self, rules=None, cycle=CYCLE, limit=LIMIT):
        if cycle < 1 or limit < 1:
            raise ValueError("cycle と limit は1以上にしてください")
        self.rules = list(RULES if rules is None else rules)
        self.cycle = cycle
        self.limit = limit
        self.count = 0
        self.turns = 0
        self.last_rule = ""

    @property
    def finished(self):
        return self.turns >= self.limit

    def respond(self, text):
        if self.finished:
            raise StopIteration("対話は終了しました")
        self.last_checks = []
        # 昨年度と同じ更新順。既定では6・11・16回目にオウム返しする。
        if self.count >= self.cycle:
            response = text + " 、ですか・・・"
            self.count = 0
            self.last_rule = "オウム返し"
        else:
            response = "続けてください"
            self.last_rule = "既定応答"
            for pattern, template in self.rules:
                matched = bool(re.search(pattern, text))
                self.last_checks.append((pattern, matched))
                if matched:
                    response = template.format(
                        question=text.replace("が心配です", "は心配ですか？")
                    )
                    self.last_rule = pattern
                    break
        self.count += 1
        self.turns += 1
        return response


def demo_responses(inputs=DEMO_INPUTS):
    doctor = Doctor()
    responses = []
    for text in inputs:
        if doctor.finished:
            break
        responses.append(doctor.respond(text))
    return responses


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", action="store_true", help="固定入力20件を実行する")
    args = parser.parse_args(argv)
    doctor = Doctor()
    print("Dr> " + GREETING)
    if args.demo:
        for text in DEMO_INPUTS:
            if doctor.finished:
                break
            print("あなた> " + text)
            print("Dr> " + doctor.respond(text))
    else:
        while not doctor.finished:
            try:
                text = input("あなた> ")
            except (EOFError, KeyboardInterrupt):
                print()
                break
            print("Dr> " + doctor.respond(text))
    print("Dr> " + FAREWELL)
    return 0



def lesson_rule(text='母が心配です'):
    doctor = Doctor()
    response = doctor.respond(text)
    rows = [(i+1,pattern,matched,'採用して停止' if matched else '次の規則へ') for i,(pattern,matched) in enumerate(doctor.last_checks)]
    return {'title':'入力→規則を上から照合→応答','question':'心配という語があれば必ず質問へ置き換わるか',
            'input':text,'columns':['順番','調べた規則','一致','次の処理'],'rows':rows,
            'result':{'採用規則':doctor.last_rule,'応答':response},'comparison':'母が心配です→試験が心配ですで、採用される規則が変わる。',
            'explanation':'最初に一致した規則だけを採用する。未確認の後続規則を不一致と扱わない。意味理解や学習をしているわけではない。',
            'reset':'text="母が心配です"で再実行。新しいDoctorなので対話回数も0から。'}


def lesson_order(reverse=False):
    rules = list(RULES)
    if reverse:
        rules.reverse()
    doctor = Doctor(rules=rules)
    text = '先生と母について'
    response = doctor.respond(text)
    return {'title':'同じ入力でも規則の順序で変わる','question':'先生と母の両方があると何を選ぶか',
            'input':f'入力={text}、規則を逆順={reverse}',
            'columns':['確認順','規則','一致'],'rows':[(i+1,p,m) for i,(p,m) in enumerate(doctor.last_checks)],
            'tables':[('今回の規則順',['順','規則','応答ひな型'],[(i+1,*rule) for i,rule in enumerate(rules)])],
            'result':response,'comparison':'通常順は先生、逆順では母が先に一致する。',
            'explanation':'応答の変化は規則を人が並べ替えた結果。データから重みを学習した結果ではない。',
            'reset':'reverse=Falseで再実行。RULES自体は変更しない。'}


def lesson_cycle(cycle=5):
    doctor = Doctor(cycle=cycle)
    rows = []
    for text in DEMO_INPUTS[:8]:
        before = doctor.count
        response = doctor.respond(text)
        rows.append((doctor.turns,text,before,doctor.last_rule,response,doctor.count))
    return {'title':'対話回数という状態を追う','question':'同じ入力でも直前までの回数で変わるか',
            'input':f'固定入力の先頭8件、cycle={cycle}。limit=20。',
            'columns':['対話番号','入力','判定前count','採用規則','応答','更新後count'],'rows':rows,
            'result':f'8件後のcount={doctor.count}、turns={doctor.turns}',
            'comparison':'cycle=5では6回目、cycle=2では3回目からオウム返しになる。',
            'explanation':'先にcount≥cycleを判定し、オウム返しでは0へ戻してから1を足す。countと全対話数turnsは別。',
            'reset':'cycle=5で再実行。新しいDoctorから同じ8件を処理する。'}

STUDY_THEMES = {'rule': lesson_rule, 'order': lesson_order, 'cycle': lesson_cycle}

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
        raise SystemExit(main())
