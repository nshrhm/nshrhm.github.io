# 第10回 単回帰分析2：誤差を比べ、限界を説明する

## 1 今日の問いと準備

第9回は指定した稼働時間から電力量を予測しました。今回は**実測値がある行**へ予測し、どの程度ずれたかを調べます。第8回の訓練平均と、第9回の単回帰を、同じ行・同じ指標で比べましょう。

目標は、①実測値・予測値・残差の符号を説明する、②訓練／検証でMAE・RMSEを比較する、③両言語・手計算・図から結果と限界を説明する、の三つです。準備10分、概念15分、両言語主例25分、変更20分、照合・外挿10分、提出・質問10分で進めます。

教材ZIPを展開し、`lesson10`を`work/exercises/`へ置きます。VS Codeでは**work全体**を開きます。本文MarkdownはCtrl+Shift+Vでプレビューできます。

```text
work/
  .vscode/tasks.json
  exercises/lesson10/
    lecture_note_10.md / README.md
    lesson10.py / lesson10.R       ← 両言語の主例
    exercise10.py / exercise10.R   ← 主言語用
    verify.py / verify.R           ← 照合言語用
    data/equipment.csv
    review/                       ← 第8・9回などの復習
    output/                       ← 実行すると作成
```

`lesson10.py`を開き「授業: Pythonファイルを実行」、`lesson10.R`を開き「授業: Rファイルを実行」を選びます。ターミナルではworkを作業場所として次を実行します。

```sh
uv run --locked python exercises/lesson10/lesson10.py
Rscript exercises/lesson10/lesson10.R
```

両言語は同じCSV・PNG名を使い、後から実行した結果で出力が置き換わります。比較する数値はメモや別名コピーで残します。元のCSVは変更しません。

## 2 学習条件を固定する

実設備の測定値ではなく、第8・9回と同じ合成設備データです。80行、5列、欠損0。固定されたtrain60行で学習し、validation20行で検証します。最終確認20行は教員が保持します。言語ごとに再分割しません。

| 列 | 単位・意味 | 今回の扱い |
| --- | --- | --- |
| id | 記録ID | 行の対応の照合 |
| operating_hours | 時間 | 単回帰の説明変数一列 |
| throughput_units | 個 | 今回はモデルに入れない |
| energy_kwh | kWh | 目的変数・実測値 |
| split | train / validation | 学習・評価する行の選択 |

**平均予測**はtrainの電力量の平均を全行へ返します。**単回帰**はtrainだけで学習した切片ありの直線です。今回、平均を検証行から計算し直したり、検証行で直線を学習し直したりしてはいけません。

第8回の[平均予測と分割](review/lesson09/review/lesson08/lecture_note_08.md)と、第9回の[二次元入力・fit・lm・predict](review/lesson09/lecture_note_09.md)§4〜6を復習してください。Pythonのxは`train[["operating_hours"]]`という二次元の表、yは`train["energy_kwh"]`。Rは`lm(energy_kwh ~ operating_hours, data=train)`で学習し、予測時は`predict(model, newdata=...)`へ対象表を渡します。Rの`predict`はnewdataを省くと訓練行の当てはめ値を返すため、評価対象を明示します。

## 3 残差の符号と大きさ

この教材では、訓練・検証のどちらも **残差 = 実測値 − 予測値** と呼びます。検証行では予測誤差とも呼びます。

- 実測30kWh、予測26kWhなら残差は+4kWh。予測が4kWh小さかったことを表します。
- 実測30kWh、予測35kWhなら残差は−5kWh。予測が5kWh大きかったことを表します。
- 絶対誤差は残差の絶対値で、ずれの大きさです。

正負の残差をそのまま平均すると相殺します。残差の平均が0に近いだけでは、予測が正確だとはいえません。切片あり最小二乗の訓練残差では平均がほぼ0になっても、個々のずれは残ります。

## 4 MAEとRMSEを計算する

対象の件数をn、各行の残差をrとすると、次の順序で計算します。

| 指標 | 計算順序 | 単位と読み方 |
| --- | --- | --- |
| MAE | 各残差の絶対値 → 全行の平均 | kWh。ずれの大きさを平均したもの |
| RMSE | 各残差を二乗 → 全行の平均 → 平方根 | kWh。二乗するため大きいずれの影響が強い |

例えば残差が+3、−4なら、MAEは(3+4)/2=3.5、RMSEは√((9+16)/2)≒3.536kWhです。√9と√16を先に平均する計算ではありません。二乗誤差の単位はkWh²、最後に平方根を取るとkWhに戻ります。同じ対象のMAEとRMSEを比べるとRMSEはMAE以上になりますが、値の差だけでモデルの正しさを判定するものではありません。

分母は評価対象の件数nです。Rの`summary(model)`に出る残差標準誤差は自由度で割るため、このRMSEとは別の量です。今回はp値・検定・信頼区間を必修にしません。

平均予測をMAE最小の方法と説明することはできません。単回帰の最小二乗も、MAEを直接最小にする学習ではありません。指標と学習方法を区別します。

## 5 Pythonの主例を読む

全文は`lesson10.py`です。先に訓練平均と単回帰を一度だけ学習し、`training_result`で固定の訓練結果、`evaluation`で今回選択した評価結果を計算します。最初は両方とも訓練60行です。これは比較の出発点です。

```python
evaluation = train.copy()
evaluation["baseline_prediction_kwh"] = baseline
evaluation["regression_prediction_kwh"] = model.predict(evaluation[["operating_hours"]])
evaluation["regression_residual_kwh"] = evaluation["energy_kwh"] - evaluation["regression_prediction_kwh"]
evaluation["regression_absolute_error_kwh"] = evaluation["regression_residual_kwh"].abs()
```

| 構文・関数 | 目的・引数 | 戻り値・結果 |
| --- | --- | --- |
| `train.copy()` | 元表を保って計算列を追加する | 独立した表のコピー |
| 数値列の`-` | 同じIDの実測列から予測列を引く | 各行の残差のSeries |
| 列の`.abs()` | 残差列の絶対値を取る | 非負のSeries |
| 列の`** 2` | 各残差を二乗する | 二乗されたSeries。`^`は使わない |
| 列の`.mean()` | 全要素を平均する | 一つの数値 |
| `sqrt(x)` | `from math import sqrt`で読み込み、非負の数を渡す | 平方根の数値 |

RMSEは`sqrt((evaluation["regression_residual_kwh"] ** 2).mean())`です。丸括弧の内側から読みます。`pd.set_option("display.precision", 17)`は表示桁数を設定し、戻り値はNoneです。内部計算の精度を増やす操作ではありません。主例では平均予測にも同じ計算を行い、`pd.DataFrame`にmodel・n・mae_kwh・rmse_kwhの列をまとめます。`pd.DataFrame`は列名と値から表を返し、`to_string(index=False)`は行番号を省いた表示用文字列を返します。

`.isin(["E004", "E005", "E011"])`は各IDが指定リストにあるかを示す真偽列を返します。その真偽列で指定行を選びます。未変更の訓練表にはそのIDがないため、指定行表示は0行です。

## 6 Rの主例を読む

全文は`lesson10.R`です。同じ元CSVから訓練・検証を選び、独立して平均と回帰を学習します。

```r
evaluation <- train
evaluation$baseline_prediction_kwh <- baseline
evaluation$regression_prediction_kwh <- predict(model, newdata = evaluation)
evaluation$regression_residual_kwh <- evaluation$energy_kwh - evaluation$regression_prediction_kwh
evaluation$regression_absolute_error_kwh <- abs(evaluation$regression_residual_kwh)
```

| 構文・関数 | 目的・引数 | 戻り値・結果 |
| --- | --- | --- |
| 数値ベクトルの`-` | 対応する各行の実測値と予測値を引く | 残差の数値ベクトル |
| `abs(x)` | 残差のベクトルを渡す | 要素ごとの絶対値 |
| `x ^ 2` | 各残差を二乗する | 二乗されたベクトル |
| `mean(x)` | 数値ベクトルを平均する | 一つの数値 |
| `sqrt(x)` | 非負の数またはベクトルを渡す | 要素ごとの平方根 |
| `as.data.frame(x)` | tibbleを通常の表として表示するために変換 | data.frame |
| `id %in% c(...)` | IDを候補ベクトルと照合する | 各行の論理値 |

RMSEは`sqrt(mean(evaluation$regression_residual_kwh ^ 2))`です。`data.frame`へ同じ長さの列を渡して指標表を作ります。`filter`へ表と条件を渡して指定3行を選びます。`options(digits=17)`は表示桁数で、計算精度を増やす指定ではありません。Python/Rの計算途中で丸めず、最後の表示末尾の差と対象行の間違いを区別してください。

## 7 保存物と残差図

主言語の`exercise10`には描画コードを完成した状態で用意しています。自分で新しく描画処理を書く必要はありません。

`output/evaluation.csv`には次の10列を保存します。

```text
id,split,operating_hours,energy_kwh,
baseline_prediction_kwh,regression_prediction_kwh,
baseline_residual_kwh,regression_residual_kwh,
baseline_absolute_error_kwh,regression_absolute_error_kwh
```

`output/residuals.png`は左に平均予測、右に単回帰を並べます。横軸は時間、縦軸は残差kWh。両パネルの縦軸尺度を揃え、0の破線からの位置で過大・過小予測を読みます。点が0付近に集まるか、特定の時間帯で偏るかを確認します。図だけから因果関係や将来の性能は断定できません。

| 描画・保存の道具 | 引数と働き | 戻り値 |
| --- | --- | --- |
| Python `plt.subplots(1,2,sharey=True)` | 横に2つの座標を作り縦軸を共有 | FigureとAxesの配列 |
| `scatter(x,y)` / `axhline(0)` | 残差の点／0の水平線を描く | 点の集合／線オブジェクト |
| `set_ylim(-limit,limit)` | 共通の上下限を指定 | 設定後の上下限の組 |
| `set_xlabel` / `set_ylabel` / `set_title` | 単位付きラベル・見出しを付ける | 文字オブジェクト |
| R `rbind(a,b)` | 同じ列構成の2表を縦に結合 | 結合した表 |
| `facet_wrap(~ model,nrow=1)` | modelごとに横並びの図へ分ける | ggplotへ追加する分割設定 |
| `geom_hline(yintercept=0)` | 0の水平線 | 描画の層 |
| `coord_cartesian(ylim=c(-limit,limit))` | 表示範囲を共通に設定 | 座標設定 |

Pythonの`for`と`zip`は、2つのAxesに同じ設定を適用する完成済み部分です。`zip`はAxesと見出しを対応づける反復可能な組を返します。変更は不要です。`limit`は両モデルの絶対残差の最大値の1.1倍。Pythonの`max`、Rの`max(abs(...))`は数値の最大値を一つ返します。

CSV・フォルダー・画像保存は[第9回§7](review/lesson09/lecture_note_09.md)を参照してください。Pythonの`mkdir`・`to_csv`（保存先指定時）・`tight_layout`・`savefig`・`close`は通常Noneを返し、作成・保存などの処理を利用します。Rの`dir.create`は成否、`write_csv`は入力表、`ggsave`は保存先を非表示で返します。Rの`ggplot`は表と`aes`の列割当てから図を作り、`geom_point`・`labs`・`theme_minimal`等の設定を`+`で追加します。描画用に再学習はしません。

## 8 必須演習：評価対象を変更する

1. 主言語を選び、その`exercise10`と他方の`verify`を開きます。まず未変更で実行し、訓練60行の両モデルのMAE・RMSEをメモします。
2. 検証20行へ変更すると指標がどう変わると思うか、一文で予想します。
3. Pythonなら`evaluation = validation.copy()`、Rなら`evaluation <- validation`へ変更します。訓練平均・fit・lm・使用列は変えません。
4. 全体を実行し、固定の訓練結果と評価結果を比較します。評価IDが検証20行か、指定3行が表示されたか、両モデルを同じ行で比べているか確認します。
5. 主言語のCSVが20行、PNGの各パネルが同じ検証20行であることを確認します。照合言語では保存は不要です。
6. 他方の言語も同じ評価対象へ変更し、元CSVから独立計算します。訓練平均・切片・傾き、訓練／検証ID・件数、両モデルのMAE・RMSE、指定3行を照合します。主言語の出力CSVを読み込んではいけません。
7. E004・E005・E011について、表示した係数から予測、実測−予測、絶対値、二乗を電卓でも確認します。正負の意味も説明します。この3行だけの平均を、20行のMAEと取り違えないでください。

比較は「この検証20行では、どちらの指標がどれだけ小さかったか」と表現します。検証誤差が必ず訓練誤差より大きい、単回帰が常に平均予測より良い、とは限りません。検証行は今後も使うため、完全に未使用の最終確認データとも区別します。

Copilotは利用できます。利用自体は加点・減点しません。予想、小変更、独立計算、手計算、自分の説明は省かないでください。

## 9 外挿：計算できることと確かめられること

主例の最後では、同じ単回帰モデルへ12時間を入力します。これは訓練範囲1〜8時間の外側なので外挿です。予測値は計算できますが、12時間の実測値は配布データにありません。この例の誤差や精度は確認できません。1.9〜7.9時間の検証行で誤差が小さくても、12時間の正確さは保証されません。

この実演コードを提出用演習へ追加する必要はありません。振り返りで限界を説明します。予測値を架空の実測値にして誤差0とすることはできません。実設備の因果効果や待機電力量も、この合成データから断定しません。

## 10 確認問題・自己チェック・提出

確認問題：①残差が−4kWhなら予測は実測より大きいですか、小さいですか。②残差+3、−4からMAEとRMSEを計算してください。③検証誤差が小さくても12時間の精度を保証できないのはなぜですか。

- [ ] 訓練平均・回帰の学習条件を固定し、評価対象だけを変更した。
- [ ] 訓練60行と検証20行のID・件数を区別した。
- [ ] 残差の符号、MAE・RMSEの順序と単位を確認した。
- [ ] 独立した両言語・指定3行・主言語のCSVと図を確認した。
- [ ] 比較の結論と外挿の限界を自分の言葉で説明できる。

Formsへ主言語、Pythonコード全文、Rコード全文、実行状況、短い振り返りを提出します。振り返りには予想と計算結果、指定行の符号、両モデルの比較、学習条件を固定する理由、外挿の限界を含めます。コード全文を貼り、Markdownの囲みや結果だけの提出にしません。PDF・CSV・PNGの添付はありません。未完成でもコードと実行状況を伝えます。締切・提出先は教員の正式案内に従います。

エラー時は保存場所、work全体、列名、Pythonの二重角括弧と`**`、Rのnewdataと`^`を確認します。環境の依存不足を定数表示で補わず、教員へ相談してください。

次回は、説明変数に処理量を追加するとどうなるかを調べます。今回は一列の単回帰を保ちます。

参考：[scikit-learnの回帰指標](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics)、[LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html)、[R predict.lm](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/predict.lm.html)。2026年10月31日参照。オンライン資料の版と実行環境の版は区別します。
