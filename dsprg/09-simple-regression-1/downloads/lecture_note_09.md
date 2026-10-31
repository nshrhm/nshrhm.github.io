# 第9回 単回帰分析1：一本の直線で予測する

## 1 今日の問いと準備

稼働時間が長い設備記録には、消費電力量をいくつと予測するでしょうか。第8回は全ての記録に訓練平均を返しました。今日は稼働時間を一つの説明変数にして、入力に応じて予測値が変わる直線を学習します。

目標は、①何を入力と答えにしてどの行で学習したか説明する、②係数を読み、予測入力を変更する、③両言語・手計算・図で確認する、の三つです。

教材ZIPを展開し、`lesson09` を `work/exercises/` に置きます。VS Codeでは **work全体** を開き、ノートはCtrl+Shift+Vでプレビューします。

```text
work/
  .vscode/tasks.json
  exercises/lesson09/
    README.md
    lecture_note_09.md
    lesson09.py / lesson09.R       ← 両言語の主例
    exercise09.py / exercise09.R   ← 主言語用
    verify.py / verify.R           ← 他方の照合言語用
    data/equipment.csv
    review/                       ← 復習資料
    output/                       ← 実行すると作成
```

`lesson09.py`を開き「授業: Pythonファイルを実行」、`lesson09.R`を開き「授業: Rファイルを実行」を選びます。ターミナルならworkで次を実行します。

```sh
uv run --locked python exercises/lesson09/lesson09.py
Rscript exercises/lesson09/lesson09.R
```

準備10分、直線の説明15分、両言語25分、変更20分、照合10分、提出と質問10分です。主例の全体を保存して実行します。PythonとRの主例は同じ出力名を使うので、後から実行した言語の結果に置き換わります。比較するときは、値をメモするか別名で控えてください。元CSVは書き換えません。

## 2 同じデータ、同じ分割を使う

第8回と同じ合成設備データです。実設備の測定値ではありません。80行のうち、`split == "train"`の60行で学習します。検証20行は第10回以降の評価に残し、今回の学習には使いません。最終確認20行は配布しません。言語ごとに再分割しないでください。

| 列 | 意味 | 今回の役割 |
| --- | --- | --- |
| id | 記録ID | 行の照合。モデル入力に含めない |
| operating_hours | 稼働時間（時間） | 説明変数 x |
| throughput_units | 処理量（個） | 今回は使わない |
| energy_kwh | 消費電力量（kWh） | 目的変数 y |
| split | train / validation | 行を選ぶラベル |

入力確認は80行5列、欠損0、訓練60行、訓練の稼働時間は1〜8時間です。CSV・行抽出は[第6回](review/lesson08/review/lecture_note_06.md)、分割と一定予測は[第8回](review/lesson08/lecture_note_08.md)§2〜5を復習できます。図の基礎は[第4回](review/lesson08/review/lecture_note_04.md)を参照してください。

## 3 直線の読み方

予測値を ŷ、切片を a、傾きを b とすると、**ŷ = a + b × x** です。

- aの単位はkWh。xが0のときの直線上の予測値です。
- bの単位はkWh/時間。xが1時間増えたとき、直線上で予測値が何kWh増えるかを表します。
- 例えば a=10、b=2なら、3時間の予測は16kWh、5時間は20kWhです。この数は説明用で、配布データの答えではありません。

学習では、訓練60点と直線との縦方向のずれを二乗して足した量が小さくなるようにaとbを決めます（最小二乗法）。MAEを最小化する方法という説明ではありません。公式の導出やp値一覧は今回は必修にしません。

今回の訓練範囲には0時間がありません。切片を「設備を動かさないときの実消費電力量」と断定できません。また、傾きは合成データ中の関係を表す値であり、実設備で時間だけを変更した際の因果効果を保証しません。

## 4 Pythonで学習する

主例全文は`lesson09.py`です。初めに表・欠損数・訓練ID・件数・範囲を表示します。Pythonの列の`.min()`・`.max()`、Rの`min(x)`・`max(x)`は対象の数値列を受け取り、最小値・最大値を一つ返します。角括弧が二重であることに注意してください。

```python
x = train[["operating_hours"]]
y = train["energy_kwh"]
model = LinearRegression()
model.fit(x, y)
print("切片 kWh", model.intercept_)
print("傾き kWh/h", model.coef_[0])
```

| 構文・関数 | 目的・入力 | 戻り値と読み方 |
| --- | --- | --- |
| `train[["operating_hours"]]` | 列名のリストで一列を選ぶ | 60行1列のDataFrame。学習のxは二次元の表 |
| `train["energy_kwh"]` | 目的変数一列を選ぶ | 60個のSeries。xと行の対応を保つ |
| `LinearRegression()` | 切片ありの線形回帰モデルを用意 | 未学習のモデル。呼んだだけでは係数は決まらない |
| `model.fit(x, y)` | 同じ60行の入力表と答えを渡す | 学習済みのmodel自身。内部の係数も更新される |
| `model.intercept_` | 学習結果を取り出す属性 | 切片a。関数ではないので括弧を付けない |
| `model.coef_[0]` | 一つ目の係数を取り出す | 傾きb。Pythonの添字は0から始まる |

`train["operating_hours"]`は一次元、`train[["operating_hours"]]`は二次元です。説明変数が一つでも、学習と予測には列名を保った表を渡します。目的変数をxへ追加すると、予測したい答えを先に渡してしまいます。

## 5 Rで学習する

主例全文は`lesson09.R`です。同じCSVから同じ訓練60行を選びます。

```r
model <- lm(energy_kwh ~ operating_hours, data = train)
coefficients <- coef(model)
cat("切片 kWh", coefficients[[1]], "\n")
cat("傾き kWh/h", coefficients[[2]], "\n")
```

| 構文・関数 | 目的・入力 | 戻り値と読み方 |
| --- | --- | --- |
| `energy_kwh ~ operating_hours` | 左に目的変数、右に説明変数を書く式 | モデルの関係を表すformula。引き算ではない |
| `lm(..., data=train)` | 式の列を訓練表から読み学習 | 学習済みlmオブジェクト。標準では切片を含む |
| `coef(model)` | 学習済みモデルを渡す | 名前付き係数ベクトル。`(Intercept)`と`operating_hours` |
| `coefficients[[1]]` / `[[2]]` | 一要素を取り出す | 切片／傾き。Rの添字は1から始まる |
| `cat(..., "\n")` | ラベル・値・改行を表示 | 表示を確認するための出力。モデルは変更しない |
| `options(digits=17)` | 表示桁数を設定する | R全体の表示設定。計算精度を上げる指定ではない |

`summary(model)`には多くの統計量がありますが、今回は`coef`で必要な係数だけを確認します。`~ 0 + operating_hours`などとすると切片なしの別モデルになるため、この課題では変更しません。

## 6 学習済みモデルで予測する

学習と予測は別の操作です。新しい入力の表には、学習時と同じ説明変数名を用意します。今回の指定入力には実測の消費電力量がありません。予測値を実測値と呼ばないでください。

```python
queries = pd.DataFrame({"operating_hours": [2.0, 4.0, 6.0]})
queries["prediction_kwh"] = model.predict(queries[["operating_hours"]])
print(queries.to_string(index=False))
```

```r
queries <- data.frame(operating_hours = c(2.0, 4.0, 6.0))
queries$prediction_kwh <- predict(model, newdata = queries)
print(queries)
```

Pythonの`pd.DataFrame`は列名と値の対応から表を作ります。`predict`は学習済みモデルに3行1列の入力表を渡し、3個の予測値を返します。`to_string(index=False)`は行番号を省いた表示用文字列を返します。

Rの`data.frame`は同じ長さの列から表を作り、`c`は値を一つのベクトルにまとめます。`predict(model, newdata=queries)`はモデルと新しい入力表を受け取り、各行の予測値を返します。`newdata`を省くと訓練行への当てはめ値になるため、指定します。両言語とも右辺の予測結果を新しい`prediction_kwh`列へ入れています。

入力表を変えるだけならaとbは変わりません。`fit`や`lm`を予測対象の答えでやり直す処理を追加しないでください。

## 7 散布図と保存を読む

描画コードはひな形に完成した状態で入っています。まず実行し、`output/regression.png`をVS Codeで開いてください。横軸は稼働時間（hours）、縦軸は消費電力量（kWh）。通常の点が訓練60行、紺の線が学習済み直線、赤い×が指定入力の予測です。

直線用の入力は訓練表を稼働時間の順に並べて、同じmodelの`predict`へ渡します。並べ替えは線を左から右へ描くためで、学習をやり直す操作ではありません。点が全て直線に重なる必要はありません。

| 道具 | 引数・役割 | 結果 |
| --- | --- | --- |
| Python `sort_values("operating_hours")` | 並べ替える列名 | 並べ替えた表。学習済みmodelは不変 |
| `plt.subplots(figsize=(8,5))` | 図の幅・高さ（インチ） | FigureとAxesの組 |
| `ax.scatter(x,y,...)` / `ax.plot(x,y,...)` | 対応するx・yと見た目の指定 | 点／線の描画要素 |
| `set_xlabel` / `set_ylabel` / `legend` | 軸の文字列／系列名 | 軸ラベル／凡例。単位を省かない |
| `tight_layout()` / `savefig(..., dpi=120)` | 余白調整／保存先と解像度 | 図の配置を整えてPNG保存 |
| R `arrange(train, operating_hours)` | 表と並べ替える列 | 並べ替えた表 |
| `ggplot(train, aes(x=...,y=...))` | 表と軸への列の割当て | ggplotオブジェクト |
| `geom_point` / `geom_line` | 必要ならdataとaesで別の表・列を指定 | 点／線の層。`+`で図へ追加 |
| `labs(x=...,y=...)` / `theme_minimal()` | 軸の文字列／基本デザイン | 表示設定の層 |
| `ggsave(...,plot=fig,width=8,height=5,dpi=120)` | 保存先、図、インチ、解像度 | PNGを保存 |

Pythonの`Path(...).mkdir(parents=True, exist_ok=True)`、Rの`dir.create(..., recursive=TRUE, showWarnings=FALSE)`で出力先を作ります。Pythonは`to_csv(..., index=False)`、Rは`write_csv`へ表と保存先を渡してCSVを保存します。Rの`file.path`はフォルダーとファイル名を結合します。戻り値も区別します。Pythonの`scatter`は点の集合、`plot`は線の要素のリスト、軸ラベル設定は文字オブジェクト、`legend`は凡例オブジェクトを返します。`tight_layout`・`savefig`・`plt.close(fig)`は通常`None`で、配置調整・保存・図を閉じる処理そのものを利用します。Rの`aes`は列と見た目の対応、`geom_*`は描画の層、`labs`はラベル設定、`theme_minimal`はテーマを返し、`+`で図へ追加します。`ggsave`は保存先を非表示で返します。ディレクトリ作成はPythonでは`None`、Rでは作成成否の論理値を非表示で返します。CSV保存はPythonでは保存先指定時は`None`、Rでは入力表を非表示で返します。どの表を渡し、何が表示・保存されたかと合わせて読みましょう。

## 8 必須演習：予測入力を変える

1. 主言語をPythonかRから選び、その`exercise09`を使います。実行前に、2・4・6時間から3・5・7時間へ変えたとき、予測値がどう変わるか一文で予想します。
2. 主言語の予測入力だけを3・5・7時間に変更します。学習行・式・説明変数・切片の設定は保ちます。
3. ファイル全体を実行し、訓練ID・件数・範囲、切片・傾き、予測表を確認します。`output/predictions.csv`と`output/regression.png`を開きます。CSVは3行、列は`operating_hours,prediction_kwh`です。
4. 他方の言語の`verify`も指定入力を3・5・7時間に変え、元CSVから独立に実行します。照合側でCSVや図を保存する必要はありません。
5. 両言語の訓練ID・件数・切片・傾き・3予測値を照合します。表示末尾の違いと、計算対象の違いを区別します。
6. 自分で得た係数を使い、5時間の予測を `a+b×5`、3時間から5時間の増分を `b×2` で電卓などにより確認します。係数を先に小数1桁へ丸めないでください。
7. 赤い3点が直線上にあること、訓練点が全て直線上とは限らないことを、自分の図で説明します。

Copilotは利用できます。ただし入力を変える前の予想、両言語の独立実行、手計算、自分の説明は省きません。AIを利用しなくても主例とこのノートで取り組めます。AI利用自体を加点・減点の条件にしません。

## 9 確認問題・自己チェック・提出

確認問題：①予測入力を変更しても係数が同じなのはなぜですか。②傾き3kWh/時間のモデルで入力が2時間増えると、予測値はいくら増えますか。③切片を実設備の待機電力量と断定できない理由は何ですか。

- [ ] 元CSVのtrain60行だけで学習した。
- [ ] xは稼働時間一列、yは消費電力量、切片ありと確認した。
- [ ] 指定3入力の予測と主言語のCSV・PNGを開いた。
- [ ] 他言語の元CSVからの計算と手計算で照合した。
- [ ] 両コード全文と、自分の言葉の振り返りを用意した。

Formsには、主言語、Pythonコード全文、Rコード全文、実行状況、短い振り返りを提出します。実行結果だけやMarkdownの囲みは貼りません。振り返りに予想と実測、切片と傾きの意味・単位、5時間と増分の手計算、入力を変えても係数を固定する理由を含めます。PDF・CSV・PNGの添付提出はありません。保存物は自分で確認するために使います。締切・提出先は教員の正式案内に従います。

未完成でもコードと実行状況を伝えてください。エラー時は、CSVの保存位置、work全体を開いているか、列名、Pythonの二重角括弧、Rのnewdata、パッケージの順に確認します。環境の依存不足を固定した答えの表示で補わず、教員に相談してください。

## 10 第10回への接続と参考資料

今回は直線を学習して指定入力を予測しました。この3入力には実測値がないため、ここから予測誤差は計算できません。次回は検証20行の実測値と予測値を比べ、残差、MAE/RMSE、平均基準モデルとの比較、外挿の限界を扱います。検証行は繰り返し使うため、完全に未使用の最終確認とは区別します。

- [scikit-learn LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html)
- [R lm](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/lm.html)
- [R predict.lm](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/predict.lm.html)

公式資料は2026年10月31日に参照しました。オンライン資料の版と実行環境の版は区別します。
