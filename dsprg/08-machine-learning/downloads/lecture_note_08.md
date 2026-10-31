# 第8回 機械学習：平均で予測し、別のデータで確かめる

## 1 今日の問いと準備

「まだ消費電力量を知らない設備記録に、いくつと予測するか」。今日は複雑なモデルを作る前に、**訓練データの平均を全行の予測値にする基準モデル**を作ります。第7回までの「記録を要約する」から「知らない値を予測して確かめる」へ進みます。

到達目標は、①列とデータ分割の役割を区別する、②訓練平均を固定して訓練・検証のMAEを求める、③両言語と具体的な行で確認して説明する、の三つです。

ZIPを展開し、`lesson08` フォルダーを `work/exercises/` に置きます。VS Codeでは **work全体** を開きます。ノートはCtrl+Shift+Vでプレビューできます。

```text
work/
  .vscode/tasks.json
  exercises/lesson08/
    README.md
    lecture_note_08.md
    lesson08.py / lesson08.R       ← 両言語の主例
    exercise08.py / exercise08.R   ← 主言語用。どちらか一つ
    verify.py / verify.R           ← 照合言語用。もう一方
    data/equipment.csv
    output/                       ← 主言語の実行で作成
```

`lesson08.py` を開いて授業のPython実行タスク、`lesson08.R` を開いてRファイル実行タスクを選びます。ターミナルからはworkで `uv run --locked python exercises/lesson08/lesson08.py` または `Rscript exercises/lesson08/lesson08.R` と実行します。リポジトリ制作用の環境や、ファイルだけを開いた別フォルダーでの実行とは区別します。

時間配分：準備・復習10分／概念15分／両言語の主例25分／変更演習20分／照合・説明10分／提出・質問10分。必修は§1〜9、RMSEの§10は補足です。

## 2 機械学習と列の役割

| 種類 | 知りたいこと | 例 |
| --- | --- | --- |
| 回帰（教師あり） | 数値はいくつか | 消費電力量を予測する。今回はこちら |
| 分類（教師あり） | どの種類か | 設備が正常か故障かを予測する |
| 教師なし学習 | どんなまとまり・特徴があるか | 似た設備記録をまとめる |

教師あり学習では、過去の入力と目的変数を使って予測の規則を決めます。今回の規則は「訓練平均を使う」だけです。比較の出発点を作る意味があり、学習ライブラリは不要です。

データは教材用に作った架空の100記録です。実設備の測定データではありません。今回配布するのは80記録で、欠損値はありません。

| 列 | 意味・単位 | 役割 |
| --- | --- | --- |
| `id` | 記録ID（文字列） | 行を照合する鍵。予測の説明変数にはしない |
| `operating_hours` | 稼働時間（時間） | 将来使う説明変数候補 |
| `throughput_units` | 処理量（個） | 将来使う説明変数候補 |
| `energy_kwh` | 消費電力量（kWh） | 予測したい目的変数 |
| `split` | `train` または `validation` | 行の役割。説明変数にはしない |

説明変数は予測時に利用できる入力、目的変数は予測したい値です。第8回の基準モデルは説明変数を使わず、全行に同じ値を返します。目的変数そのものを入力に混ぜると、予測したい答えを先に教えたことになります。

## 3 何に使ったデータかを区別する

| 区分 | 行数 | 今回の扱い |
| --- | ---: | --- |
| 訓練 `train` | 60 | 平均という予測規則を決める。訓練MAEも確認 |
| 検証 `validation` | 20 | 規則を変えずに予測し、MAEを確認 |
| 最終確認 `final` | 20 | 今回は配布しない。第12回で候補決定後に使う |

分割ラベルは配布CSVに固定されています。PythonとRで乱数を使って分け直しません。同じseed番号だけでは、異なる言語で同じ行になるとは限りません。

第8〜11回の検証行は第12回でも候補比較に使う予定です。何度も見た検証行を「完全に未使用のテスト」と呼びません。予測規則や前処理に検証・最終確認の答えを混ぜることは、データ漏洩につながります（[公式解説](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)）。

## 4 主例：読む、分ける、平均を固定する

主例の全文は `lesson08.py` と `lesson08.R` にあります。最初は両方を実行し、行数・型・欠損数を確認してください。Pythonの `shape` は行数と列数、`dtypes` は列の型、`isna().sum()` は列別の欠損数です。Rの `dim()`、`sapply(records, class)`、`colSums(is.na(records))` も同じ目的で使います。

既習事項の詳しい説明は[第6回学生ノート](review/lecture_note_06.md)のCSV読込・型と欠損・抽出・保存、第4回の[学生ノート](review/lecture_note_04.md)の平均と列の取り出しを参照してください。

```python
train = records[records["split"] == "train"].copy()
validation = records[records["split"] == "validation"].copy()
baseline = train["energy_kwh"].mean()
```

`==` は一致の判定です。各行について真偽を返し、外側の `records[...]` が真の行を選びます。`.copy()` は抽出結果を別の表にします。`train["energy_kwh"]` は60行の目的変数の列、`.mean()` の戻り値は一つの平均です。`baseline` は以降、訓練行にも検証行にも同じ値を使います。

```r
train <- filter(records, split == "train")
validation <- filter(records, split == "validation")
baseline <- mean(train$energy_kwh)
```

`filter(表, 条件)` は条件に合う行の表を返します。`train$energy_kwh` は数値ベクトル、`mean(数値ベクトル)` は一つの平均を返します。列全体を平均する前に、どの行を選んだかを確認します。

両言語の平均関数は欠損値の既定の扱いが異なります。今回は欠損0件を確認して使います。欠損が見つかったら勝手に補完・除外せず、配布ファイルを確認してください。

## 5 絶対誤差とMAEを読む

行ごとの誤差を「実測値 − 予測値」とします。符号が違う誤差をそのまま足すと相殺されるので、今回は絶対値を取り、その平均を使います。

\[
\hat y_i = \bar y_{\mathrm{train}},\qquad
\mathrm{MAE} = \frac{1}{n}\sum_{i=1}^{n}|y_i-\hat y_i|
\]

`n` は**評価する行の件数**です。訓練では60、検証では20です。MAEも消費電力量と同じkWhで、「1行当たりの絶対的なずれ」を表します。同じ行で比較するなら、小さいほど絶対的なずれが小さいと読めます。

```python
train_error = (train["energy_kwh"] - baseline).abs()
train_mae = train_error.mean()
```

引き算は列の各値から同じ数を引きます。括弧は引き算を先にする指定です。`.abs()` は引数なしで、その列の各値の絶対値を返します。元の値は変更しません。最後の `.mean()` が誤差20個または60個を一つにまとめます（[abs](https://pandas.pydata.org/docs/reference/api/pandas.Series.abs.html)、[mean](https://pandas.pydata.org/docs/reference/api/pandas.Series.mean.html)）。

```r
train_error <- abs(train$energy_kwh - baseline)
train_mae <- mean(train_error)
```

`abs(数値ベクトル)` は各要素の絶対値を返します。要素数は変わりません。`mean(train_error)` はその平均です（[abs](https://stat.ethz.ch/R-manual/R-devel/library/base/html/MathFun.html)、[mean](https://stat.ethz.ch/R-manual/R-devel/library/base/html/mean.html)）。

小例：訓練値が10と14なら平均は12です。検証値9と16の予測はどちらも12、絶対誤差は3と4、MAEは3.5です。この小例は配布データの期待値ではありません。

**注意：平均による一定予測はMAEを最小にするとは限りません。** 今回は第9回以降との比較の出発点として平均を使います。また、検証MAEが訓練MAEより必ず大きいわけではありません。

## 6 必須演習：評価する行を変更する

主言語をPythonまたはRから一つ選び、その `exercise08` を編集します。ひな形は訓練MAEまで動きます。主例を参考にして、次を完成してください。

1. 実行前に検証MAEが訓練MAEより大きそうか小さそうか、理由とともに予想する。
2. `baseline` の計算は変えず、検証行の絶対誤差とMAEを追加する。
3. 両区分のID・件数、訓練平均、両MAEを表示する。
4. 検証行の `id`, `energy_kwh`, `prediction_kwh`, `absolute_error_kwh` を保存する。

保存する表の作り方は次の小さな部品を参考にします。`validation_error` は自分で計算した検証行の絶対誤差です。

```python
result = validation[["id", "energy_kwh"]].copy()
result["prediction_kwh"] = baseline
result["absolute_error_kwh"] = validation_error
output = Path("exercises/lesson08/output")
output.mkdir(parents=True, exist_ok=True)
result.to_csv(output / "validation_predictions.csv", index=False)
```

二重の角括弧の内側は列名のリストです。結果は2列の表です。新しい列への一つの数の代入は全行に同じ予測を入れ、列の代入は対応する行に値を入れます。`Path` はパス、`/` はパスの連結、`mkdir` の `parents=True` は親も作る指定、`exist_ok=True` は既存フォルダーを許す指定です。`to_csv` は指定先へ保存し、`index=False` は余分な行番号を出しません。戻り値を使う処理ではなく、ファイルが成果物です。

```r
result <- select(validation, id, energy_kwh)
result$prediction_kwh <- baseline
result$absolute_error_kwh <- validation_error
dir.create("exercises/lesson08/output", recursive = TRUE, showWarnings = FALSE)
write_csv(result, "exercises/lesson08/output/validation_predictions.csv")
```

`select(表, 列名...)` は選んだ列の表を返します。`$列名 <- 値` で列を追加します。一つの予測値は全行に繰り返されます。`dir.create` は保存先を作り、`recursive=TRUE` は親も作ります。`showWarnings=FALSE` は既にある場合などの警告を表示しない指定です。`write_csv(表, パス)` は表を保存します。保存後にファイルがあることを確認します。

元の `data/equipment.csv` に保存してはいけません。出力は繰り返し実行すると更新されるため、残したい実験結果は別名で保持してください。

## 7 他方の言語と指定行で照合する

Pythonが主言語なら `verify.R`、Rが主言語なら `verify.py` を完成します。照合側も**元CSVを読むところから**始めます。図やCSV保存の重複実装は不要です。

| 確認項目 | 確認方法 |
| --- | --- |
| 訓練・検証のID | 同じ集合か。表示順が違う場合はIDで対応づける |
| 両件数 | 60件・20件か |
| 訓練平均 | 同じ訓練行から計算したか |
| 訓練・検証のMAE | 同じ平均と同じ評価行を使ったか |

表示の末尾の丸め差は内部計算の違いとは限りません。途中で平均を丸めず、表示は小数第3位程度を目安に読んでください。固定した答えを表示するだけでは照合になりません。

**E004・E005・E011** の実測値を元CSVで探し、自分で求めた訓練平均との差の絶対値を電卓などで求めて、保存CSVの行と比較します。この3行の平均だけを、20行の検証MAEと混同しないでください。

Copilotを使っても使わなくても評価条件は同じです。AIの提案を採用する前に予想し、小変更の後にこの独立確認を行い、自分の言葉で説明します。使えない場合は主例と§4〜6を参考に進められます。

## 8 提出と振り返り

Formsに主言語、Python・Rのコード全文、実行状況、短い振り返りを入力します。コードはファイル全体を貼り、実行結果やMarkdownの囲みを貼らないでください。Python主なら `exercise08.py` と `verify.R`、R主なら `verify.py` と `exercise08.R` です。PDFやCSVの添付提出は今回要求しません。CSVは手元で確認し、コードから再生成できるようにします。

振り返りには次の三つを含めます。

- 予想と、訓練・検証それぞれの件数／MAE／単位を示し、結果をどう読んだか。
- 指定3行の実測値・予測値・絶対誤差と、他言語で一致した項目または残る相違。
- 検証平均で予測を作り直さず、訓練平均を固定する理由。

配点・締切・再提出期限・回答URLは担当教員の正式案内に従います。未確定の値はこの資料に設定しません。送信直後に自動確定点は出ません。実行できなかった場合も、その状態と支援が必要な箇所を伝えます。

## 9 確認問題と自己チェック

確認問題：①検証行から平均を計算し直すと、何を先に使ったことになるか。②誤差が−3と4のとき、平均誤差とMAEはそれぞれいくつか。③両言語で同じ値が出たら、対象行の確認を省いてよいか。

- [ ] ID・分割ラベル・目的変数を説明変数と区別した。
- [ ] 訓練平均を固定し、訓練60行・検証20行を確認した。
- [ ] 絶対値を取ってから平均し、kWhで説明した。
- [ ] 他言語と指定3行で独立に確認した。
- [ ] 保存して最初から実行し、両コードと自分の説明を提出できる。

## 10 補足：RMSEと次回

RMSEは「誤差を二乗→平均→平方根」の順で計算します。単位はkWhに戻り、大きいずれをMAEより強く反映します。MAEとRMSEの数値を直接比較して優劣を決めません。第10回で詳しく扱います。

第9回は同じ訓練行と検証行を使い、稼働時間から一本の回帰直線で予測します。今回の基準予測を保存しておくと、直線を使う意味を比較できます。今回の合成データの結果から、実設備の性能や因果関係は主張できません。
