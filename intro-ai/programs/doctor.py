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
        # 昨年度と同じ更新順。既定では6・11・16回目にオウム返しする。
        if self.count >= self.cycle:
            response = text + " 、ですか・・・"
            self.count = 0
            self.last_rule = "オウム返し"
        else:
            response = "続けてください"
            self.last_rule = "既定応答"
            for pattern, template in self.rules:
                if re.search(pattern, text):
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


if __name__ == "__main__":
    raise SystemExit(main())
