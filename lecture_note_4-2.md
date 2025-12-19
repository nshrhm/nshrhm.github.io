# 4-2 データの可視化

## 概要

**重要概念・用語**
1. データフレーム（列＝変数、行＝観測）
2. ヒストグラム（階級・ビン・右閉/左閉）
3. スタージェスの公式（階級数の自動決定）
4. 散布図（2変数の関係）
5. 箱ひげ図（四分位数・IQR・外れ値・ひげ）
6. 棒グラフ（平均）とエラーバー（標準誤差）
7. 分割表（クロス集計）とモザイクプロット
8. 関数のグラフ（$y = f(x)$）
9. Rの標準関数 vs `ggplot2`
10. Pythonの `DataFrame` メソッド / `plt` / `fig-ax` の3流儀

> 本節では、統計量だけでなく可視化で理解を深めること、そして R と Python で同じ可視化を再現する際に「設定（階級・範囲・閉区間）」が結果に影響することを学びます。

**学習目標**
- 1次元データをヒストグラムで可視化し、階級（`bins/breaks`）の意味を説明できる。
- 2次元データを散布図で可視化し、「2次元＝列の数」であることを説明できる。
- 4変数程度のデータを箱ひげ図で一度に確認し、四分位数と外れ値を言葉で説明できる。
- 平均と標準誤差を計算し、棒グラフ＋エラーバーで可視化できる。
- 分割表を作り、モザイクプロットでカテゴリ×カテゴリの関係を可視化できる。
- Rの ggplot2 と Python の fig/ax を使い、「統一的な書き方」で図を作れる。

**つまずきポイント仮説（3〜6個）**
- 「グラフは見えればOK」と思い、階級数や範囲の設定が意味を変えることに気づかない（特にヒストグラム）。
- Rの `iris` は最初からあるが、Python側の `iris` の用意（読み込み）で止まる。
- Rは「右端が閉じる/開く」、Pythonは「左端が閉じる/開く」の違いを混同する。
- 箱ひげ図の「ひげ＝最大最小」と誤解し、外れ値やIQRの意味が曖昧になる。
- エラーバーを「ばらつき」だと思い、標準偏差（sd）と標準誤差（se）を混同する。
- WSL2環境で図が表示されず、保存（PNG出力）に切り替えられない。

---

## Step B: 章立て（見出し案）

- 4.2.0 準備：データと作業フォルダの確認（到達目標：図をファイルとして保存できる）
- 4.2.1 ヒストグラム（到達目標：bins/breaksを明示して再現性のあるヒストグラムを描ける）
- 4.2.2 散布図（到達目標：2変数の関係を散布図で確認できる）
- 4.2.3 箱ひげ図（到達目標：複数変数の分布を1枚で比較できる）
- 4.2.4 棒グラフとエラーバー（到達目標：平均と標準誤差を計算し可視化できる）
- 4.2.5 モザイクプロット（到達目標：分割表を可視化し「面積＝件数」を説明できる）
- 4.2.6 関数のグラフ（到達目標：数式で定義された関数を可視化できる）
- 4.2.7 統一的な可視化：ggplot2 と fig/ax（到達目標：統一的な書き方で図を整える）

---

## 4.2.0 準備：データと作業フォルダの確認

**到達目標（1行）**：R/Pythonで同じデータ（iris）を読み込み、図を `png` として保存できる。

### 1) 概念説明（平易に / なぜ必要か）
この回は「図を描く」回ですが、初心者が最初に詰まるのは **図が出ない** ことです。WSL2では環境によってGUI表示がうまくいかない場合があるため、まずは **図をファイル（PNG）に保存する** ところから始めます。

本節ではアヤメ（iris）データを使います。Rでは `iris` が最初から用意されています。Pythonでは例として `statsmodels` から読み込みます。

### 2) 基本文法（Python/Rの両方）

### R（iris の確認）
- `head(iris)`：先頭6行を表示
- `nrow(iris)`：行数
- `names(iris)`：列名

### Python（iris の確認）
- `iris.head()`：先頭5行
- `len(iris)`：行数
- `iris.columns`：列名

### 3) サンプルプログラム（ファイル単位で実行可能：基本版）

### my4-2-00_prepare.R
```r
# my4-2-00_prepare.R
# 目的: irisデータを確認し、作業フォルダにCSVとして保存する（図の保存準備）

setwd("/home/datasci/work")          # 作業ディレクトリ（固定）
print(getwd())

print(head(iris))                    # データの先頭を確認
print(nrow(iris))                    # 行数
print(names(iris))                   # 列名

write.csv(iris, "iris.csv", row.names = FALSE)
print("saved: iris.csv")
```

期待される出力（例）
```text
#> [1] "/home/datasci/work"
#> ...（irisの先頭が表示）...
#> [1] 150
#> [1] "Sepal.Length" "Sepal.Width" "Petal.Length" "Petal.Width" "Species"
#> [1] "saved: iris.csv"
```

### my4-2-00_prepare.py
```python
# my4-2-00_prepare.py
# 目的: irisデータを読み込み、作業フォルダにCSVとして保存する（図の保存準備）

import pandas as pd
import statsmodels.api as sm

iris = sm.datasets.get_rdataset("iris", "datasets").data

print("cwd: /home/datasci/work")   # ここでは表示だけ（実際の作業はcdで行う）
print(iris.head())
print(len(iris))
print(list(iris.columns))

iris.to_csv("iris.csv", index=False)
print("saved: iris.csv")
```

期待される出力（例）
```text
#> cwd: /home/datasci/work
#> ...（irisの先頭が表示）...
#> 150
#> ['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width', 'Species']
#> saved: iris.csv
```

### 4) 実行手順（WSL2 + VS Code前提の具体コマンド）

```bash
cd /home/datasci/work
venvc
Rscript my4-2-00_prepare.R
python my4-2-00_prepare.py
ls -l iris.csv
```

### 5) よくあるミスとデバッグ（初心者向けに3〜6個）
- `setwd()` しないまま `write.csv()` を実行し、どこに保存されたかわからない
  - 対策：`getwd()` を必ず表示する。
- Pythonで `ModuleNotFoundError: statsmodels`
  - 対策：`pip install statsmodels`（環境によっては既に入っています）。
- VS CodeのターミナルがWSL2になっていない
  - 対策：左下の緑のWSL表示、または「WSL: New Window」で開く。

### 6) 💡 GitHub Copilot活用ガイド（必須）
導入（200〜300字）
この節では「実行できる最小のスクリプト」を作り、データ確認と保存までを自力で通すことが目的です。Copilotは“雛形を速く書く”のに便利ですが、出力先（作業フォルダ）やファイル名はあなたが管理する必要があります。生成結果をそのまま走らせず、必ず `print()`（Rは`print()`）で途中確認しながら進めてください。丸投げは禁止です。

プロンプト例
- ★☆☆（そのままコピペ可）
  - Copilot Chatに入力：
    「/home/datasci/work で動く最小の Python スクリプトを書いて。statsmodels で iris を読み込み、先頭5行と列名と行数を表示し、iris.csvに保存して」
  - 期待される動作：読み込み→表示→CSV保存の雛形が生成される
  - やってみよう（3ステップ）：(1) 生成コードを貼る (2) `python ...` で実行 (3) `ls -l iris.csv` で確認
- ★★☆
  - Copilot Chatに入力：
    「Rで iris を /home/datasci/work に iris.csv として保存し、保存先パスと行数・列名を表示するスクリプトにして」
  - 期待される動作：`setwd()` 付きのRスクリプトが生成される
  - やってみよう（3ステップ）：(1) `getwd()` を追加 (2) `Rscript ...` 実行 (3) ファイルができたら中身を `head` で確認

コツ（最低3つ）
- 「目的」「入力」「出力ファイル名」を1行で書いてから依頼する。
- 生成されたコードは、まず `print/head` を足して“途中が見える”ようにする。
- パッケージが無い前提も書く（例：statsmodelsが無ければpipで入れる）。

注意（最低3つ）
- 丸投げ禁止：生成コードの意図を説明できないまま提出しない。
- Copilotの提案が“別のデータ”を使うことがあるので、必ず iris を指定する。
- 保存先がズレると後工程が崩れる。作業フォルダは固定で運用する。

---

## 4.2.1 ヒストグラム

**到達目標（1行）**：RとPythonで bins/breaks を明示し、再現性のあるヒストグラムを描ける。

### 1) 概念説明（平易に / なぜ必要か）
ヒストグラムは1次元データ（例：身長、点数）の分布を見る基本の図です。重要なのは「階級（ビン）をどう切るか」で、切り方が違うと“違う形”に見えてしまいます。教科書では、RとPythonで結果が違う主因として **(1)右閉/左閉 (2)階級数 (3)範囲** の3点が挙げられています。

- R：階級は通常「右端が閉じる」扱いになりやすい（境界値がどちらに入るかに影響）。必要なら `right=FALSE` で変更できる。
- 階級数：Rは未指定だとスタージェスの公式で決まる。Python（pandas）は未指定だと概ね10になりやすい。
- 「同じ階級数」でも一致しない：範囲が違うと一致しません。そこで境界（breaks/bins）を **配列として明示** します。

### 2) 基本文法（Python/Rの両方）

### R
- `hist(x)`：基本
- `hist(x, breaks=..., right=FALSE)`：階級境界を明示＋左閉
- `seq(min(x), max(x), length.out=10)`：等間隔の境界を作る

### Python
- `iris.hist('Sepal.Length')`：基本
- `np.linspace(min(x), max(x), 10)`：等間隔の境界
- `bins=tmp.round(2)`：丸めて境界を揃える

### 3) サンプルプログラム（ファイル単位で実行可能：基本版）

### my4-2-01_hist.R
```r
# my4-2-01_hist.R
# 目的: ヒストグラムの階級境界を明示してPNGに保存する

setwd("/home/datasci/work")

x <- iris$Sepal.Length
tmp <- seq(min(x), max(x), length.out = 10)  # 境界を明示（10個=9区間）

png("my4-2-01_hist_R.png", width = 800, height = 600)
hist(x, breaks = tmp, right = FALSE, main = "Sepal.Length のヒストグラム", xlab = "Sepal.Length")
dev.off()

print(tmp)
print("saved: my4-2-01_hist_R.png")
```

期待される出力（例）
```text
#> [1] 4.3 4.7 5.1 5.5 5.9 6.3 6.7 7.1 7.5 7.9
#> [1] "saved: my4-2-01_hist_R.png"
```

### my4-2-01_hist.py
```python
# my4-2-01_hist.py
# 目的: ヒストグラムのbinsを明示してPNGに保存する

import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm

iris = sm.datasets.get_rdataset("iris", "datasets").data
x = iris["Sepal.Length"]

tmp = np.linspace(min(x), max(x), 10)   # 10個=9区間
bins = tmp.round(2)                     # 境界を丸めて揃える

iris.hist("Sepal.Length", bins=bins)
plt.title("Sepal.Length のヒストグラム")
plt.xlabel("Sepal.Length")
plt.savefig("my4-2-01_hist_P.png", dpi=150)
print(list(bins))
print("saved: my4-2-01_hist_P.png")
```

期待される出力（例）
```text
#> [4.3, 4.7, 5.1, 5.5, 5.9, 6.3, 6.7, 7.1, 7.5, 7.9]
#> saved: my4-2-01_hist_P.png
```

### 4) 実行手順
```bash
Rscript my4-2-01_hist.R
python my4-2-01_hist.py
ls -l my4-2-01_hist_*.png
```

### 5) よくあるミスとデバッグ
- `breaks=10` と書いて「境界を10個」と誤解する（Rは“階級数”扱いにもなる）
  - 対策：今回は **境界ベクトル（tmp）** を渡す。
- Pythonで `plt.savefig()` し忘れて、実行してもファイルが増えない
  - 対策：最後に `ls -l` で確認する習慣をつける。
- `right=FALSE` の意味が曖昧
  - 対策：境界値がどちらに入るか（20の例）を思い出す。

### 6) 💡 GitHub Copilot活用ガイド

ヒストグラムは“描けたら終わり”ではなく、階級の切り方がメッセージを左右します。Copilotには「`bins/breaks`を明示」「PNGに保存」「境界配列を`print`する」の3点を必ず指定してください。提案コードのまま実行すると、階級が自動になってR/Pythonで形が揃いません。丸投げせず、境界値（tmp）が自分の意図どおりか確認しましょう。

プロンプト例
- ★☆☆
  - Copilot Chatに入力：
    「Rで `iris$Sepal.Length` のヒストグラムを描きたい。`breaks`を `seq(min,max,length.out=10)` にして `right=FALSE` で、PNGに保存するスクリプトを作って」
  - 期待される動作：`png()`〜`dev.off()` まで含む最小コードが出る
  - やってみよう：(1) 生成コードを貼る (2) `Rscript ...` (3) `ls -l *.png`
- ★★☆
  - Copilot Chatに入力：
    「Pythonで `pandas` の `DataFrame hist` を使い、 `bins` を `np.linspace` で明示して丸め、PNG保存まで行う例を書いて」
  - 期待される動作： `np.linspace` と `plt.savefig` を含む例が出る
  - やってみよう：(1) `bins`を `print` (2) ファイル名を自分の命名に合わせる (3) 画像を開いて確認

コツ
- 「RとPythonで同じ境界を使う」と明示する。
- “境界配列の`print`”を必須にするとバグが減る。
- 画像ファイル名に節番号（4-2-01）を入れて迷子を防ぐ。

注意
- 丸投げ禁止： `bins` の意味を説明できないなら作り直す。
- 自動階級のまま比較すると誤解が生まれる。
- Pythonの `bins='sturges'` など“別解”を提案されても、まずは配列で揃える。

---

## 4.2.2 散布図

**到達目標（1行）**：2変数の関係を散布図で可視化し、軸が何を表すか説明できる。

### 1) 概念説明
散布図は「2つの数値列の関係」を見るための基本図です。ここでいう「2次元」は空間の次元ではなく、**変数（列）の数** を指します。

### 2) 基本文法

### R
- `plot(x, y)`：散布図

### Python
- `iris.plot(x, y, kind='scatter')`：DataFrameから散布図

### 3) サンプルプログラム（基本版）

### my4-2-02_scatter.R
```r
# my4-2-02_scatter.R
# 目的: 散布図をPNGに保存する（Sepal.Length vs Sepal.Width）

setwd("/home/datasci/work")

x <- iris$Sepal.Length
y <- iris$Sepal.Width

png("my4-2-02_scatter_R.png", width = 800, height = 600)
plot(x, y,
     main = "Sepal.Length と Sepal.Width の散布図",
     xlab = "Sepal.Length", ylab = "Sepal.Width")
dev.off()

print("saved: my4-2-02_scatter_R.png")
```

### my4-2-02_scatter.py
```python
# my4-2-02_scatter.py
# 目的: 散布図をPNGに保存する（Sepal.Length vs Sepal.Width）

import matplotlib.pyplot as plt
import statsmodels.api as sm

iris = sm.datasets.get_rdataset("iris", "datasets").data

ax = iris.plot("Sepal.Length", "Sepal.Width", kind="scatter")
ax.set_title("Sepal.Length と Sepal.Width の散布図")
ax.set_xlabel("Sepal.Length")
ax.set_ylabel("Sepal.Width")

plt.savefig("my4-2-02_scatter_P.png", dpi=150)
print("saved: my4-2-02_scatter_P.png")
```

### 4) 実行手順
```bash
cd /home/datasci/work
venvc
Rscript my4-2-02_scatter.R
python my4-2-02_scatter.py
ls -l my4-2-02_scatter_*.png
```

### 5) よくあるミスとデバッグ
- 軸を逆にして解釈が混乱する（どちらが説明変数か）
  - 対策：ファイル名・タイトルに「X vs Y」を書く。
- Pythonで `ax = ...` を受け取らずにラベル設定ができない
  - 対策：戻り値（axes）を変数に入れる。
- 外れ値っぽい点だけ見て結論を出す
  - 対策：箱ひげ図やヒストグラムも併用する。

### 6) 💡 GitHub Copilot活用ガイド（必須）
導入（200〜300字）
散布図は「関係がある/ない」を雑に判断しがちです。Copilotには“タイトル・軸ラベル・保存”の3点を必ず指示し、何を描いた図かを明確にしましょう。また、同じ列名を使ってR/Python両方で描くと比較が簡単になります。生成されたコードが別の列名に変えてしまうことがあるので、必ず `Sepal.Length` と `Sepal.Width` を明示して依頼してください。丸投げは禁止です。

プロンプト例
- ★☆☆
  - Copilot Chatに入力：
    「Rで iris の Sepal.Length と Sepal.Width の散布図をPNG保存する最小スクリプトを書いて。main/xlab/ylabも入れて」
  - 期待される動作：`png()`→`plot()`→`dev.off()` の雛形
  - やってみよう：(1) ファイル名を my4-2-02 に合わせる (2) 実行 (3) 画像を開いて軸を確認
- ★★☆
  - Copilot Chatに入力：
    「Pythonで pandas.DataFrame.plot(kind='scatter') を使って散布図を作り、タイトルと軸ラベルを付けてPNG保存する例を書いて」
  - 期待される動作：axesにラベル設定し `plt.savefig` する例
  - やってみよう：(1) kindがscatterか確認 (2) 保存先を確認 (3) dpiを変えて見やすさ比較

コツ
- 「軸ラベルは列名そのまま」を徹底すると混乱が減る。
- 生成コードの“列名の綴り”を必ず確認する（ドットの有無など）。
- `ls -l` でファイルが増えたかを毎回確認する。

注意
- 丸投げ禁止：散布図が何を表すか説明できるまで確認する。
- Copilotが seaborn を提案しても、まずは DataFrame.plot で統一する（本節方針）。
- 見た目の調整に時間を使いすぎない（学習目標は“描ける・読める”）。

---

## 4.2.3 箱ひげ図

**到達目標（1行）**：箱ひげ図で複数変数の分布（中央値・四分位・外れ値）を比較できる。

### 1) 概念説明
データが3次元（列が3本以上）になると、すべてのヒストグラムや散布図を作るのは大変です。箱ひげ図なら、**複数の列の分布** を1枚でざっと比較できます。

箱ひげ図の基本：
- 箱：第1四分位数〜中央値〜第3四分位数
- ひげ：IQR（四分位範囲）の1.5倍以内の最小・最大
- それ以外：点で描かれる（外れ値）

### 2) 基本文法

### R
- `boxplot(iris[, -5])`：数値列だけ描く（Species列を除外）

### Python
- `iris.boxplot()`：DataFrameの箱ひげ図

### 3) サンプルプログラム（基本版）

### my4-2-03_boxplot.R
```r
# my4-2-03_boxplot.R
# 目的: 数値列だけの箱ひげ図をPNGに保存する

setwd("/home/datasci/work")

png("my4-2-03_boxplot_R.png", width = 900, height = 600)
boxplot(iris[, -5],
        main = "iris（数値4列）の箱ひげ図",
        ylab = "値")
dev.off()

print("saved: my4-2-03_boxplot_R.png")
```

### my4-2-03_boxplot.py
```python
# my4-2-03_boxplot.py
# 目的: 数値列だけの箱ひげ図をPNGに保存する

import matplotlib.pyplot as plt
import statsmodels.api as sm

iris = sm.datasets.get_rdataset("iris", "datasets").data
numeric = iris.drop(columns=["Species"])

ax = numeric.boxplot()
ax.set_title("iris（数値4列）の箱ひげ図")
ax.set_ylabel("値")

plt.savefig("my4-2-03_boxplot_P.png", dpi=150)
print("saved: my4-2-03_boxplot_P.png")
```

### 4) 実行手順
```bash
cd /home/datasci/work
venvc
Rscript my4-2-03_boxplot.R
python my4-2-03_boxplot.py
ls -l my4-2-03_boxplot_*.png
```

### 5) よくあるミスとデバッグ
- Rで `boxplot(iris)` として `Species` が混ざりエラー/変な結果
  - 対策：`iris[, -5]` の意味（5列目を除外）を理解する。
- Pythonで `iris.boxplot()` の前に `Species` を落とさず警告が出る/期待と違う
  - 対策：`drop(columns=["Species"])` を入れる。
- ひげを最大最小だと思い込む
  - 対策：IQR×1.5 のルールを必ず言葉で説明してみる。

### 6) 💡 GitHub Copilot活用ガイド（必須）

箱ひげ図は「分布の要約」を一枚で見せる強力な道具ですが、読み方を誤ると誤解が生まれます。Copilotには“数値列だけを対象にする”“タイトルと軸ラベルを付ける”“PNG保存する”を明示して依頼してください。生成コードがカテゴリ列（Species）を含めてしまうと失敗します。外れ値（点）の意味を自分で説明できるかを確認し、丸投げせず理解と検証を優先しましょう。

プロンプト例
- ★☆☆
  - Copilot Chatに入力：
    「Rで iris の数値4列だけを箱ひげ図にしてPNG保存するコードを、10〜15行でコメント付きで書いて」
  - 期待される動作：`iris[, -5]` を使う例が生成される
  - やってみよう：(1) 保存名を指定 (2) 実行 (3) 外れ値が出る列を口頭で説明
- ★★☆
  - Copilot Chatに入力：
    「Pythonで iris の Species を除いた箱ひげ図を作り、matplotlibでPNG保存する最小例を書いて」
  - 期待される動作：`drop` → `boxplot` → `savefig` の流れ
  - やってみよう：(1) numeric列数=4を確認 (2) 画像を開く (3) どの列が散らばるか記録

コツ
- 「数値列だけ」を必ず依頼文に書く。
- `print(numeric.columns)` を一時的に入れて対象を確認する。
- 画像ファイル名に節番号を含め、後で比較しやすくする。

注意
- 丸投げ禁止：IQRと外れ値の意味が説明できないと点数にならない。
- Copilotが平均線の追加を提案しても、まずは標準の箱ひげ図に集中する。
- 箱ひげ図だけで結論を出さず、必要に応じて散布図やヒストグラムと併用する。

---

## 4.2.4 棒グラフとエラーバー

**到達目標（1行）**：平均・標準偏差・標準誤差を計算し、棒グラフ＋エラーバーで可視化できる。

### 1) 概念説明
棒グラフは「代表値（平均など）」を比較するのに向いています。ただし棒だけだと“ばらつき”が見えないので、標準誤差（se）などを **エラーバー** で付けます。教科書でも、平均・標準偏差・標準誤差を求め、その後に棒グラフ＋エラーバーを描く流れが示されています。

- 標準偏差（sd）：データの散らばり
- 標準誤差（se）：平均の不確かさ（おおよそ `sd / sqrt(n)`）

### 2) 基本文法（両方）

### R（基本：自分で計算 → 描画）
- `mean(x)`, `sd(x)`, `nrow(df)`
- `barplot()` と `arrows()` でエラーバー

### Python（基本：describe → se → 描画）
- `iris.describe()` → 転置して `mean/std`
- `my_df.plot(kind='bar', yerr=..., capsize=...)`

### 3) サンプルプログラム（基本版）

### my4-2-04_bar_error.R
```r
# my4-2-04_bar_error.R
# 目的: 各列の平均と標準誤差を計算し、棒グラフ＋エラーバーをPNGに保存する

setwd("/home/datasci/work")

cols <- c("Sepal.Length", "Sepal.Width", "Petal.Length", "Petal.Width")
n <- nrow(iris)

m  <- sapply(iris[, cols], mean)
sd <- sapply(iris[, cols], sd)
se <- sd / sqrt(n)

print(data.frame(mean = m, sd = sd, se = se))

png("my4-2-04_bar_error_R.png", width = 900, height = 600)
bp <- barplot(m, names.arg = cols, las = 2, ylim = c(0, max(m + se) * 1.2),
              main = "各変数の平均（エラーバー=標準誤差）", ylab = "平均")
arrows(bp, m - se, bp, m + se, angle = 90, code = 3, length = 0.05)
dev.off()

print("saved: my4-2-04_bar_error_R.png")
```

### my4-2-04_bar_error.py
```python
# my4-2-04_bar_error.py
# 目的: 各列の平均と標準誤差を計算し、棒グラフ＋エラーバーをPNGに保存する

import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm

pd.options.display.float_format = "{:.2f}".format

iris = sm.datasets.get_rdataset("iris", "datasets").data
cols = ["Sepal.Length", "Sepal.Width", "Petal.Length", "Petal.Width"]

my_df = iris[cols].describe().transpose()[["mean", "std"]]
my_df["se"] = my_df["std"] / (len(iris) ** 0.5)

print(my_df)

ax = my_df.plot(y="mean", kind="bar", yerr="se", capsize=10)
ax.set_title("各変数の平均（エラーバー=標準誤差）")
ax.set_xlabel("")
ax.set_ylabel("平均")

plt.savefig("my4-2-04_bar_error_P.png", dpi=150)
print("saved: my4-2-04_bar_error_P.png")
```

### 4) 実行手順
```bash
cd /home/datasci/work
venvc
Rscript my4-2-04_bar_error.R
python my4-2-04_bar_error.py
ls -l my4-2-04_bar_error_*.png
```

### 5) よくあるミスとデバッグ
- sd と se を混同する（エラーバーが大きすぎ/小さすぎに見える）
  - 対策：`se = sd / sqrt(n)` を手で計算してみる。
- `ylim` を調整せず、エラーバーの上が切れる（R）
  - 対策：`ylim` を `max(m+se)` で少し上げる。
- Pythonで `yerr="se"` としても `se` 列が無い
  - 対策：`print(my_df.columns)` で確認し、列名を揃える。

### 6) 💡 GitHub Copilot活用ガイド（必須）
導入（200〜300字）
棒グラフ＋エラーバーは「比較」には便利ですが、誤用が多い図でもあります。Copilotには“エラーバーは標準誤差（se）”“seは sd/sqrt(n) で計算”“平均・sd・seの表をprintして確認”まで明示して依頼してください。生成コードがsdをそのままエラーバーにしてしまうことがあります。まず数値表が妥当かを確認し、丸投げせず理解と検証を最優先に進めましょう。

プロンプト例
- ★☆☆
  - Copilot Chatに入力：
    「Pythonで iris の4列の mean/std を計算し、se=std/sqrt(n) を追加して、棒グラフ＋エラーバー（se）をPNG保存する最小例を書いて」
  - 期待される動作：`describe().transpose()` を使う雛形が出る
  - やってみよう：(1) print表を確認 (2) 画像を保存 (3) seとsdの違いを説明
- ★★☆
  - Copilot Chatに入力：
    「Rで4列の平均と標準誤差を計算し、barplotとarrowsでエラーバーを付けてPNG保存するコードを書いて」
  - 期待される動作：`sapply` → `barplot` → `arrows` の流れが出る
  - やってみよう：(1) 列名をcolsに固定 (2) `ylim` を調整 (3) 最もseが大きい変数を答える

コツ
- “計算結果の表（mean/sd/se）を必ず出力”と依頼する。
- 画像だけでなく数値も確認する（「数値の確認には使えない」ケースに注意）。
- エラーバーの意味（sdなのかseなのか）を図タイトルに書く。

注意
- 丸投げ禁止：seの式と意味を説明できないなら作り直す。
- 棒グラフは分布を隠す。箱ひげ図やヒストグラムも併用する。
- Copilotが“きれいな図”に寄せて複雑化しがち。基本はシンプルに。

---

## 4.2.5 モザイクプロット

**到達目標（1行）**：分割表を作り、モザイクプロットでカテゴリ×カテゴリの関係を可視化できる。

### 1) 概念説明
モザイクプロットは、分割表（クロス集計）を **長方形の面積で表す** 可視化です。積み上げ棒グラフと違い、「面積がサンプルサイズに比例」します。

例として、`Sepal.Width > 3` かどうかの真偽値（TRUE/FALSE）を `w_Sepal` とし、`Species` と組み合わせた分割表を可視化します。

### 2) 基本文法

### R
- `table(df)`：分割表
- `mosaicplot(~ Species + w_Sepal, data=df)`：モザイク

### Python
- `pd.crosstab(...)`：分割表
- `mosaic(df, index=[...])`：モザイク（statsmodels）

### 3) サンプルプログラム（基本版）

### my4-2-05_mosaic.R
```r
# my4-2-05_mosaic.R
# 目的: 分割表を作り、モザイクプロットをPNGに保存する

setwd("/home/datasci/work")

my_df <- data.frame(
  Species = iris$Species,
  w_Sepal = iris$Sepal.Width > 3
)

print(table(my_df))

png("my4-2-05_mosaic_R.png", width = 900, height = 600)
mosaicplot(~ Species + w_Sepal, data = my_df,
           main = "Species × (Sepal.Width > 3) のモザイクプロット")
dev.off()

print("saved: my4-2-05_mosaic_R.png")
```

### my4-2-05_mosaic.py
```python
# my4-2-05_mosaic.py
# 目的: 分割表を作り、モザイクプロットをPNGに保存する

import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.graphics.mosaicplot import mosaic

iris = sm.datasets.get_rdataset("iris", "datasets").data

my_df = pd.DataFrame({
    "Species": iris["Species"],
    "w_Sepal": iris["Sepal.Width"] > 3
})

my_table = pd.crosstab(my_df["Species"], my_df["w_Sepal"])
print(my_table)

plt.figure(figsize=(8, 5))
mosaic(my_df, index=["Species", "w_Sepal"])
plt.title("Species × (Sepal.Width > 3) のモザイクプロット")
plt.savefig("my4-2-05_mosaic_P.png", dpi=150)
print("saved: my4-2-05_mosaic_P.png")
```

### 4) 実行手順
```bash
cd /home/datasci/work
venvc
Rscript my4-2-05_mosaic.R
python my4-2-05_mosaic.py
ls -l my4-2-05_mosaic_*.png
```

### 5) よくあるミスとデバッグ
- まず分割表を作らずに図だけ描いて、何が何だかわからなくなる
  - 対策：必ず `table/crosstab` を `print` してから図を見る。
- TRUE/FALSE の意味を取り違える（条件が逆）
  - 対策：条件式をコメントに書く（例：`Sepal.Width > 3`）。
- Pythonで `statsmodels` が無い
  - 対策：`pip install statsmodels`。

### 6) 💡 GitHub Copilot活用ガイド（必須）
導入（200〜300字）
モザイクプロットは“面積＝件数”という直感的な図ですが、分割表を見ずに眺めると誤解します。Copilotには「まず分割表をprint」「次にモザイクプロットを描く」「タイトルに条件を書く」「PNG保存」の順番まで指定してください。提案コードが積み上げ棒グラフに置き換わることもあるので、必ず mosaicplot（R）/ statsmodels.mosaic（Python）を明示します。丸投げは禁止です。

プロンプト例
- ★☆☆
  - Copilot Chatに入力：
    「Rで iris の Species と (Sepal.Width > 3) の分割表を table で表示して、mosaicplotで可視化し、PNG保存するコードを書いて」
  - 期待される動作：`data.frame`→`table`→`mosaicplot` の例が出る
  - やってみよう：(1) 条件を変えてみる（>3.5など）(2) 分割表がどう変わるか確認 (3) 図の面積も変わるか確認
- ★★☆
  - Copilot Chatに入力：
    「Pythonで pandas crosstab を表示してから、statsmodels の mosaicplot で同じ分割表を可視化しPNG保存する例を書いて」
  - 期待される動作：`pd.crosstab` と `mosaic` を含む例が出る
  - やってみよう：(1) 表と図の対応を説明 (2) TRUE/FALSEの比率を口頭で説明 (3) ファイル名を節番号に揃える

コツ
- “表→図”の順番を固定する（可視化の基本）。
- 条件式を1文字も変えずにR/Pythonで揃える。
- 図タイトルに条件を書くと、後で見返しても理解できる。

注意
- 丸投げ禁止：分割表のどこが大きいか（数値）を説明できる必要がある。
- Copilotが別ライブラリ（seaborn等）を提案しても、本節では mosaic を優先する。
- 図の装飾より、まず「何を数えているか」を優先する。

---

## 4.2.6 関数のグラフ

**到達目標（1行）**：指定範囲で y = x^3 - x を描き、保存できる。

### 1) 概念説明
統計とは直接関係しませんが、モデル式や損失関数など、**関数を描きたい場面** はよくあります。教科書でも例として `y = x^3 - x` を `-2 ≤ x ≤ 2` で描く方法が示されています。

### 2) 基本文法

### R
- `curve(x^3 - x, -2, 2)`：関数をそのまま描く

### Python
- `np.linspace(start, stop, num)`：xの点列
- `plt.plot(x, y)`：折れ線

### 3) サンプルプログラム（基本版）

### my4-2-06_function.R
```r
# my4-2-06_function.R
# 目的: y = x^3 - x を -2 から 2 で描き、PNG保存する

setwd("/home/datasci/work")

png("my4-2-06_function_R.png", width = 800, height = 600)
curve(x^3 - x, from = -2, to = 2,
      main = "y = x^3 - x（-2 ≤ x ≤ 2）",
      xlab = "x", ylab = "y")
dev.off()

print("saved: my4-2-06_function_R.png")
```

### my4-2-06_function.py
```python
# my4-2-06_function.py
# 目的: y = x^3 - x を -2 から 2 で描き、PNG保存する

import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-2, 2, 100)
y = x**3 - x

plt.plot(x, y)
plt.title("y = x^3 - x（-2 ≤ x ≤ 2）")
plt.xlabel("x")
plt.ylabel("y")

plt.savefig("my4-2-06_function_P.png", dpi=150)
print("saved: my4-2-06_function_P.png")
```

### 4) 実行手順
```bash
cd /home/datasci/work
venvc
Rscript my4-2-06_function.R
python my4-2-06_function.py
ls -l my4-2-06_function_*.png
```

### 5) よくあるミスとデバッグ
- Pythonで `x^3` と書いてしまう（`^` はべき乗ではない）
  - 対策：`x**3` を使う。
- Rで `curve` の範囲指定を忘れる
  - 対策：`from/to` を明示して、意図した範囲を描く。
- 点の数が少なくガタガタに見える
  - 対策：`linspace` の点数（100）を増やす。

### 6) 💡 GitHub Copilot活用ガイド（必須）
導入（200〜300字）
関数のグラフは「xの範囲」「点の細かさ（解像度）」「保存形式」がポイントです。Copilotには“範囲は-2から2”“点数は100以上”“タイトルと軸ラベル”“PNG保存”を明示して依頼してください。Pythonではべき乗演算子のミス（^）が起こりやすいので、生成コードでも `**` を確認します。丸投げせず、自分で式と範囲を説明できる状態で進めましょう。

プロンプト例
- ★☆☆
  - Copilot Chatに入力：
    「Pythonで y = x^3 - x を -2〜2 で描く。np.linspaceで100点、plt.plot、タイトル・軸ラベル、PNG保存までの最小例を書いて」
  - 期待される動作：`linspace`→`plot`→`savefig` の例が出る
  - やってみよう：(1) 点数を200に増やす (2) 形が滑らかになるか確認 (3) y=0 になる点がどこか読む
- ★★☆
  - Copilot Chatに入力：
    「Rで curve を使って y=x^3-x を -2〜2 で描き、png()で保存するスクリプトを書いて」
  - 期待される動作：`png`→`curve`→`dev.off` の雛形
  - やってみよう：(1) mainに式を書く (2) xlab/ylab を付ける (3) 画像を確認

コツ
- 式をそのままタイトルに入れると、図の意味が明確になる。
- まずは“保存できる”ことを確認し、次に見た目を調整する。
- Pythonは `**`、Rは `^` と、言語差を意識する。

注意
- 丸投げ禁止：生成された数式が違っていないか必ず確認する。
- Copilotが関数定義（def/function）を提案しても、基本版では不要。
- 目的は「描けること」。最初から凝ったスタイルにしない。

---

## 4.2.7 統一的な可視化：ggplot2 と fig/ax

**到達目標（1行）**：Rはggplot2、Pythonはfig/axで、同じ設計思想で図を整えられる。

### 1) 概念説明
Rでは可視化に「標準関数」と「ggplot2」の2系統があり、見栄えや統一性の面で ggplot2 を推奨する、と教科書にあります。
Pythonでは可視化方法として「DataFrameメソッド」「plt.xxx」「figとax」の3系統が紹介され、データフレーム中心ならまず1を使い、必要に応じて3に移る方針が示されています。

ここでは「統一的に書く」練習として、
- R：ggplot2（= “書き方の統一”）
- Python：fig/ax（= “構造の統一”）
で、同じ散布図を整えて保存します。

### 2) 基本文法

### R（ggplot2）
基本形：
`データ %>% ggplot(aes(...)) + geom_... + ...`

### Python（fig/ax）
基本形：
`fig, ax = plt.subplots()` → `ax.plot(...)` / `ax.scatter(...)` → `fig.savefig(...)`

### 3) サンプルプログラム（基本版）

### my4-2-07_ggplot_scatter.R
```r
# my4-2-07_ggplot_scatter.R
# 目的: ggplot2で散布図を描き、PNG保存する（色=Species）

setwd("/home/datasci/work")

library(tidyverse)

p <- iris %>%
  ggplot(aes(x = Sepal.Length, y = Sepal.Width, color = Species)) +
  geom_point() +
  xlab("Sepal.Length") +
  ylab("Sepal.Width") +
  ggtitle("ggplot2: 散布図（色=Species）")

ggsave("my4-2-07_ggplot_scatter_R.png", plot = p, width = 7, height = 5, dpi = 150)
print("saved: my4-2-07_ggplot_scatter_R.png")
```

### my4-2-07_figax_scatter.py
```python
# my4-2-07_figax_scatter.py
# 目的: fig/axで散布図を描き、PNG保存する（色=Species）

import matplotlib.pyplot as plt
import statsmodels.api as sm

iris = sm.datasets.get_rdataset("iris", "datasets").data

fig, ax = plt.subplots(figsize=(7, 5))

for sp in iris["Species"].unique():
    tmp = iris[iris["Species"] == sp]
    ax.scatter(tmp["Sepal.Length"], tmp["Sepal.Width"], label=sp)

ax.set_title("fig/ax: 散布図（色=Species）")
ax.set_xlabel("Sepal.Length")
ax.set_ylabel("Sepal.Width")
ax.legend()

fig.savefig("my4-2-07_figax_scatter_P.png", dpi=150)
print("saved: my4-2-07_figax_scatter_P.png")
```

### 4) 実行手順
```bash
cd /home/datasci/work
venvc
Rscript my4-2-07_ggplot_scatter.R
python my4-2-07_figax_scatter.py
ls -l my4-2-07_*_scatter_*.png
```

### 5) よくあるミスとデバッグ
- Rで `library(tidyverse)` が無い
  - 対策：`install.packages("tidyverse")`（環境により不要）。
- Pythonで `ax.legend()` を忘れて色の意味が分からない
  - 対策：カテゴリを色分けしたら凡例を付ける。
- Rで `ggsave()` の保存先が分からない
  - 対策：`setwd` で作業フォルダを固定する。

### 6) 💡 GitHub Copilot活用ガイド（必須）
導入（200〜300字）
統一的な可視化は「見た目の好み」ではなく、再利用と説明のしやすさを高めます。Copilotには“Rはggplot2、Pythonはfig/axで書く”と明示し、同じ列名・同じタイトル構成・同じ保存形式（PNG）に揃えるよう依頼してください。生成コードが標準関数やDataFrame.plotに戻ってしまうことがあるので、今回の目的（統一性の練習）を必ず書きましょう。丸投げは禁止です。

プロンプト例
- ★☆☆
  - Copilot Chatに入力：
    「Rで ggplot2 を使い、iris の散布図（Sepal.Length vs Sepal.Width）を Species で色分けし、PNG保存する例を書いて」
  - 期待される動作：`ggplot` + `geom_point` + `ggsave` の雛形
  - やってみよう：(1) タイトルを自分の言葉に変更 (2) 実行 (3) 凡例が出るか確認
- ★★☆
  - Copilot Chatに入力：
    「Pythonで matplotlib の fig, ax = plt.subplots() を使い、Speciesごとに散布図を重ね、legend付きでPNG保存する最小例を書いて」
  - 期待される動作：forループでカテゴリ別に描く例
  - やってみよう：(1) unique() の順を確認 (2) 凡例の位置を変える (3) 保存ファイル名を節番号に揃える

コツ
- “何を統一するか（列名・図の種類・保存形式）”を依頼文に列挙する。
- 生成されたコードが長い場合は、まず保存まで動く最小に削る。
- 図タイトル・軸ラベル・凡例の3点を標準装備にする。

注意
- 丸投げ禁止：ggplot2の「aes」とmatplotlibの「ax」の役割を説明できる必要がある。
- Copilotが複雑なテーマ設定を追加しても、まずは読みやすさ優先。
- 依存パッケージが増える提案は一旦保留し、標準＋最小で通す。

---

## セクション末の統合演習（必須）

### 統合演習：iris可視化ミニレポート（PythonとRの両方）

**目的**
同じデータ（iris）を、PythonとRで同じ意図の可視化として再現し、「設定が結果に影響する」ことを説明できるようにする。

**入力**
- `iris`（Rは標準、Pythonは `statsmodels` で取得）

**出力（提出物）**
1. 画像ファイル（PNG）合計6枚以上
   - Rで3枚以上、Pythonで3枚以上
2. `report_4-2.txt`（テキストでOK）
   - 各図について「何を見せる図か」「読み取れること」を各2〜3行
3. ソースコード
   - R：`ex4-2_report.R`
   - Python：`ex4-2_report.py`

**評価基準（ルーブリック）**
- 40%：R/Pythonの両方で動作し、指定枚数のPNGが生成される
- 30%：ヒストグラムで bins/breaks を明示し、なぜ必要か説明できている
- 20%：分割表→モザイクの順で説明できる（表と図の対応が書けている）
- 10%：ファイル命名・保存先が整理されている（再現性）

**提出形式**
- `/home/datasci/work/ex4-2_submit/` を作り、以下を入れてZIPにする
  - `ex4-2_report.R`
  - `ex4-2_report.py`
  - `report_4-2.txt`
  - `png/`（生成したPNGをまとめる）

---

### 解答例（基本版：必須）

#### ex4-2_report.R（基本版）

```r
# ex4-2_report.R
# 目的: 代表的な3種類の図をRで作り、png/に保存する（関数定義なし）

setwd("/home/datasci/work")

dir.create("ex4-2_submit/png", recursive = TRUE, showWarnings = FALSE)

# 1) ヒストグラム（境界を明示）
x <- iris$Sepal.Length
tmp <- seq(min(x), max(x), length.out = 10)

png("ex4-2_submit/png/R_hist.png", 800, 600)
hist(x, breaks = tmp, right = FALSE, main = "R: hist", xlab = "Sepal.Length")
dev.off()

# 2) 散布図
png("ex4-2_submit/png/R_scatter.png", 800, 600)
plot(iris$Sepal.Length, iris$Sepal.Width, main = "R: scatter", xlab = "Sepal.Length", ylab = "Sepal.Width")
dev.off()

# 3) モザイク（分割表→図）
my_df <- data.frame(Species = iris$Species, w_Sepal = iris$Sepal.Width > 3)
write.table(table(my_df), file = "ex4-2_submit/R_table.txt")

png("ex4-2_submit/png/R_mosaic.png", 900, 600)
mosaicplot(~ Species + w_Sepal, data = my_df, main = "R: mosaic")
dev.off()

print("R done")
```

#### ex4-2_report.py（基本版）

```python
# ex4-2_report.py
# 目的: 代表的な3種類の図をPythonで作り、png/に保存する（関数定義なし）

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.graphics.mosaicplot import mosaic

os.makedirs("ex4-2_submit/png", exist_ok=True)

iris = sm.datasets.get_rdataset("iris", "datasets").data

# 1) ヒストグラム（境界を明示）
x = iris["Sepal.Length"]
bins = np.linspace(min(x), max(x), 10).round(2)

iris.hist("Sepal.Length", bins=bins)
plt.title("P: hist")
plt.xlabel("Sepal.Length")
plt.savefig("ex4-2_submit/png/P_hist.png", dpi=150)
plt.close()

# 2) 散布図
ax = iris.plot("Sepal.Length", "Sepal.Width", kind="scatter")
ax.set_title("P: scatter")
ax.set_xlabel("Sepal.Length")
ax.set_ylabel("Sepal.Width")
plt.savefig("ex4-2_submit/png/P_scatter.png", dpi=150)
plt.close()

# 3) モザイク（分割表→図）
my_df = pd.DataFrame({"Species": iris["Species"], "w_Sepal": iris["Sepal.Width"] > 3})
my_table = pd.crosstab(my_df["Species"], my_df["w_Sepal"])
my_table.to_csv("ex4-2_submit/P_table.csv")

plt.figure(figsize=(8, 5))
mosaic(my_df, index=["Species", "w_Sepal"])
plt.title("P: mosaic")
plt.savefig("ex4-2_submit/png/P_mosaic.png", dpi=150)
plt.close()

print("Python done")
```

#### report_4-2.txt（基本版の例：短文でOK）
```text
R_hist/P_hist:
- Sepal.Length の分布をヒストグラムで確認した。bins/breaksを明示したので再現性がある。
- 階級の境界を変えると形が変わるので、比較するときは境界を揃える必要がある。

R_mosaic/P_mosaic:
- Species と (Sepal.Width > 3) の分割表を面積で表した。面積が件数に比例する。
- まず分割表の数値を確認してから図を見ると、どの組合せが多いか説明できる。
```

**実行コマンド例**
```bash
cd /home/datasci/work
venvc
Rscript ex4-2_report.R
python ex4-2_report.py
ls -l ex4-2_submit/png
```

---

### 解答例（発展版：参考・任意）
- R：ggplot2で同じ3図を作り、`ggsave()` で統一保存する（デザイン統一）
- Python：fig/axでレイアウト（複数図）を揃えて保存する（構造統一）
- どちらも「数値表→図」「設定の明示」を守ること

---

## 自己チェックリスト（29項目）

### A. 講義理解（10項目）
1. 本節の目標（ヒストグラム・散布図・箱ひげ図等）を説明できる。
2. Rの可視化が「標準関数」と「ggplot2」に大別されることを説明できる。
3. Pythonの可視化が3系統（DataFrame/plt/fig-ax）で説明されていることを説明できる。
4. 2次元とは「列の数」であると説明できる。
5. ヒストグラムでRとPythonが違う理由を3つ言える。
6. Rのスタージェスの公式の位置づけを説明できる。
7. 箱ひげ図の箱・ひげ・外れ値の意味を説明できる。
8. 棒グラフ＋エラーバーの流れ（平均→se→可視化）を説明できる。
9. モザイクプロットが面積で件数を表すことを説明できる。
10. 関数のグラフ例（x^3-x）を説明できる。

### B. 実行手順・デバッグ（8項目）
11. `Rscript file.R` でRコードを実行できる。
12. `python file.py` でPythonコードを実行できる。
13. `ls -l` で出力ファイルを確認できる。
14. 列名のミス（Sepal.Lengthなど）を見つけて直せる。
15. `Species` を数値列に混ぜないようにできる。
16. エラーバーが切れるときに軸範囲を調整できる（R）。
17. `plt.close()` の意味（次の図に影響しない）を理解している。
18. 分割表（`table/crosstab`）を必ず先に確認している。

### C. Copilot活用・統合演習（11項目）
19. Copilotに依頼するとき、目的・入力・出力を1行で書ける。
20. 生成コードをそのまま提出せず、コメントとprintを追加して検証している。
21. ヒストグラムでは `bins/breaks` を必ず明示している。
22. R/Pythonで同じ境界（配列）を使う意識がある。
23. 散布図の軸が何を意味するかを説明できる。
24. 箱ひげ図の外れ値の意味を説明できる。
25. `sd` と `se` の違いを説明できる。
26. モザイクプロットで「面積＝件数」を説明できる。
27. 統合演習でPNGを6枚以上生成できる。
28. 丸投げ禁止を守り、生成物の意図を説明できる。
29. Copilotが別ライブラリを提案しても、方針に従って取捨選択できる。

**チェック数による達成度評価（目安）**
- 0〜10：要復習（基本操作と保存からやり直し）
- 11〜20：基礎到達（主要な図を描けるが説明が弱い）
- 21〜25：標準到達（描ける＋設定の意味を説明できる）
- 26〜29：良好（R/Pythonで再現でき、統合演習も提出可能）