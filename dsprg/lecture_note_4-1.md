# 4.1 記述統計

* （平均・分散・標準偏差、データフレーム集計、分割表・グループ集計）

## 講義メモの理解サマリ

### 重要概念・用語

* 標本（サンプル）、母集団 
* 記述統計、統計的推測 
* 平均（mean） 
* 分散（variance） 
* 標準偏差（standard deviation） 
* 不偏分散・標本分散、ddof 
* 五数要約・四分位数 
* データフレームの列ごとの集計 
* 分割表（contingency table） 
* グループごとの集計（groupby） 

### 学習目標

* 1次元データ（ベクタ）から平均・分散・標準偏差を **Python と R の両方で**計算できる。 
* **不偏分散と標本分散の違い**を説明し、Python では `ddof` を明示して計算できる。 
* データフレームの数値列を対象に、列ごとの統計量（平均・分散など）を **Python/R で**まとめて出力できる。 
* 質的変数に対して分割表を作り、さらにグループごとの平均を集計できる。 

### つまずきポイント

* Rscript で「式を書いただけ」だと出力されず、`print()`/`cat()` を忘れる。
* Python の `np.var()` / `np.std()` の **デフォルトが `ddof=0`** で、R の `var()`/`sd()` と一致しない。 
* pandas の `Series.var()` は `ddof=1` （不偏）寄りで、NumPy と混ぜると混乱する。 
* データフレーム集計で「数値列だけ」を選ばず、文字列列が混ざって意図しない結果になる。
* 分割表で `TRUE/FALSE`（R）と `True/False`（Python）の表記差に引っ張られる。

## 目次

* 4.1.1 平均・分散・標準偏差（到達目標：基本統計量を Python/R で計算できる）
* 4.1.2 不偏分散・標本分散と ddof（到達目標：一致しない理由を説明し、ddof を使い分けられる）
* 4.1.3 データフレームの列ごとの集計（到達目標：複数列の統計量をまとめて出せる）
* 4.1.4 分割表とグループごとの集計（到達目標：カテゴリ別の件数・平均を集計できる）
* 4.1.5 統合演習

---

## 4.1.1 平均・分散・標準偏差

**到達目標：** 1次元データ（身長など）を、平均・分散・標準偏差で要約できる。

### 1) 概念説明

「標本（サンプル）」は、母集団の全員を測れないときに一部を抜き出したデータです。標本を整理・要約するのが **記述統計**です。 
1個の数値で“代表値”を表すなら平均（または中央値）が便利で、ばらつきの大きさは標準偏差で表すと直感的です。 

ここでは例として、身長データ `x = {165, 170, 175, 180, 185}` を使います。 

### 2) 基本文法（Python/R の両方）

#### R（ベクタ）

* 平均：`mean(x)`
* 分散：`var(x)`（R は基本的に不偏分散寄り）
* 標準偏差：`sd(x)`

#### Python（NumPy）

* 平均：`np.mean(x)`
* 分散：`np.var(x, ddof=1)`（R と揃えるなら `ddof=1`）
* 標準偏差：`np.std(x, ddof=1)`

---

### 3) サンプルプログラム

#### R：`my4-1-01_mean_var_sd.R`

```r
# 1次元データ（身長）
x <- c(165, 170, 175, 180, 185)
y <- c(173, 174, 175, 176, 177)

cat("mean(x) =", mean(x), "\n")
cat("mean(y) =", mean(y), "\n")

cat("var(x)  =", var(x), "\n")
cat("var(y)  =", var(y), "\n")

cat("sd(x)   =", sd(x), "\n")
cat("sd(y)   =", sd(y), "\n")
```

期待される出力（例）：

```text
mean(x) = 175 
mean(y) = 175 
var(x)  = 62.5 
var(y)  = 2.5 
sd(x)   = 7.905694 
sd(y)   = 1.581139 
```

#### Python：`my4-1-01_mean_var_sd.py`

```python
import numpy as np

# 1次元データ（身長）
x = [165, 170, 175, 180, 185]
y = [173, 174, 175, 176, 177]

print("mean(x) =", np.mean(x))
print("mean(y) =", np.mean(y))

print("var(x)  =", np.var(x, ddof=1))
print("var(y)  =", np.var(y, ddof=1))

print("sd(x)   =", np.std(x, ddof=1))
print("sd(y)   =", np.std(y, ddof=1))
```

期待される出力（例）：

```text
mean(x) = 175.0
mean(y) = 175.0
var(x)  = 62.5
var(y)  = 2.5
sd(x)   = 7.905694150420948
sd(y)   = 1.5811388300841898
```

（`ddof=1` を使うと、R の `var()` と一致します。 ）

---

### 4) 実行手順

1. WSL で Ubuntu-DS-2404 ログイン直後に `code work` と入力
2. VS Codeで `Ctrl+@` と入力して、ターミナルを表示
3. ファイルを作成

```bash
touch my4-1-01_mean_var_sd.py
touch my4-1-01_mean_var_sd.R
```

4. 実行：

```bash
python my4-1-01_mean_var_sd.py
Rscript my4-1-01_mean_var_sd.R
```

---

### 5) よくあるミスとデバッグ

* **Rscript で出力が出ない**：`mean(x)` とだけ書いても表示されません。`cat()` か `print()` を使ってください。
* **Python で `ddof` を省略**：`np.var(x)` はデフォルトで ddof=0 なので、R とズレます（次節で詳説）。
* **数字が合わない**：データを打ち間違えていないか（165/175/185 など）をまず確認。
* **小数点表示の違い**：Python は `175.0` のように float 表示、R は `175` になりやすいです（意味は同じ）。
* **ライブラリ未導入**：Python 側で NumPy がない場合は授業環境のセットアップを確認（ここでは導入済み前提）。

---

### 6) 💡 GitHub Copilot活用ガイド

Copilot は「最初のたたき台」を高速で作るのに有効です。ただし、統計は **定義（`ddof` など）1つで結果が変わる**ため、丸投げは危険です。生成されたコードは、(1) 入力データ、(2) 計算式、(3) 期待出力の3点で必ず検証し、理解してから使ってください。

**プロンプト例（★☆☆）**

* Copilot Chatに入力：

  * 「`x=[165,170,175,180,185]` と `y=[173,174,175,176,177]` の平均・分散・標準偏差を計算して表示する、**10〜15行**のPythonスクリプトを書いて。分散と標準偏差は **`ddof=1`** を明示して。」
* 期待される動作：NumPy を使った短いスクリプトが生成される。
* やってみよう（3ステップ）

  1. 生成結果を `my4-1-01_mean_var_sd.py` に貼る
  2. `ddof=1` が本当に入っているか確認
  3. 実行して、`var(x)=62.5` などの数値が出るか確認

**プロンプト例（★★☆）**

* Copilot Chatに入力：

  * 「同じ処理を Rscript 用にして。`cat()` を使って結果がターミナルに出る形にして。**10〜15行**で。」
* 期待される動作：`cat()` を使った R の短いスクリプトが生成される。
* やってみよう（3ステップ）

  1. `my4-1-01_mean_var_sd.R` に貼る
  2. `Rscript` 実行で出力が出るか確認
  3. Python の結果と一致するか確認（分散は次節も参照）

**コツ**

* 「行数」「ddof」「出力形式（print/cat）」を **制約として明記**する。
* 期待出力（例：`var(x)=62.5`）を先に書いて、検証しやすくする。
* 生成結果をそのまま使わず、コメントを足して「何をしているか」を自分の言葉で説明する。

**注意**

* 丸投げ禁止：生成コードが正しい保証はありません。
* 結果が合わないとき、すぐに書き直さず **定義（ddof、分散の種類）** を疑う。
* R と Python を混ぜるとき、**デフォルト設定の違い**でハマりやすい（次節）。

---

## 4.1.2 不偏分散・標本分散と ddof

**到達目標：** R と Python の分散が一致しない理由を説明し、`ddof` を明示して計算できる。

### 1) 概念説明

分散・標準偏差には「2種類」あり、どちらを使うかで値が変わります。ここでは、混乱回避のために両者の対応表を示します。 

* **不偏分散**：平均との差の二乗和を **`n-1`** で割る（R の `var()` はこれ） 
* **標本分散**（本メモでの表記）：同じものを **`n`** で割る（NumPy の `np.var(ddof=0)` はこれ） 

Python では `ddof`（delta degrees of freedom）で割り算の分母を調整できるため、R と揃えたいなら **ddof=1 を明示**します。 

---

### 2) 基本文法

#### R

* 不偏分散：`var(x)`
* 標本分散（nで割る）：`mean((x - mean(x))^2)`
* 標準誤差（平均の標準誤差）：`sd(x) / sqrt(length(x))` 

#### Python

* 不偏分散：`np.var(x, ddof=1)`
* 標本分散：`np.var(x, ddof=0)`
* 標準誤差：`np.std(x, ddof=1) / (len(x)**0.5)` 

---

### 3) サンプルプログラム

#### R：`my4-1-02_ddof_variance.R`

```r
x <- c(165, 170, 175, 180, 185)
n <- length(x)

unbiased_var <- var(x)                  # 不偏分散（n-1）
sample_var  <- mean((x - mean(x))^2)    # 標本分散（n）
se_mean     <- sd(x) / sqrt(n)          # 平均の標準誤差

cat("n =", n, "\n")
cat("unbiased var (n-1) =", unbiased_var, "\n")
cat("sample   var (n)   =", sample_var, "\n")
cat("SE(mean)          =", se_mean, "\n")
```

期待される出力（例）：

```text
#> n = 5
#> unbiased var (n-1) = 62.5
#> sample   var (n)   = 50
#> SE(mean)          = 3.535534
```

#### Python：`my4-1-02_ddof_variance.py`

```python
import numpy as np

x = [165, 170, 175, 180, 185]
n = len(x)

unbiased_var = np.var(x, ddof=1)   # 不偏分散（n-1）
sample_var   = np.var(x, ddof=0)   # 標本分散（n）
se_mean      = np.std(x, ddof=1) / (n ** 0.5)

print("n =", n)
print("unbiased var (ddof=1) =", unbiased_var)
print("sample   var (ddof=0) =", sample_var)
print("SE(mean)             =", se_mean)
```

期待される出力（例）：

```text
#> n = 5
#> unbiased var (ddof=1) = 62.5
#> sample   var (ddof=0) = 50.0
#> SE(mean)             = 3.5355339059327373
```

---

### 4) 実行手順

```bash
# cd /home/datasci/work # フォルダが違う時は以上
python my4-1-02_ddof_variance.py
Rscript my4-1-02_ddof_variance.R
```

---

### 5) よくあるミスとデバッグ

* **「R と Python で分散が違う」**：まず `ddof` を確認する。R の `var()` は `n-1`、NumPy はデフォルト `n` です。 
* **pandas と NumPy を混ぜて混乱**：`Series.var()` は不偏寄り、`np.var()` は標本寄りでズレます。 
* **標準誤差と標準偏差を混同**：標準誤差は `sd / sqrt(n)`。n が増えると小さくなります。 
* **ddof を関数ごとに省略**：関数によってデフォルトが違うことがあるため、区別が必要なら省略しない（実務の鉄則）。 

---

### 6) 💡 GitHub Copilot活用ガイド

`ddof` のような「定義の差」は、Copilot が誤った前提でコードを生成しやすい典型例です。Copilot を使うなら、**“R と一致させるため `ddof=1`”** のように背景まで書き、生成物を「表（対応関係）」「期待出力」で必ず検証してください。 

**プロンプト例（★☆☆）**

* Copilot Chatに入力：

  * 「R の `var()` と NumPy の `np.var()` の違い（n-1 と n）を、初心者向けに **200字程度**で説明して。最後に『Pythonでは ddof=1 を明示』と書いて。」
* 期待される動作：概念説明の文章案が生成される。
* やってみよう（3ステップ）

  1. 生成文を自分の言葉で言い換える
  2. `ddof=1` の意味を1文で補足する
  3. 講義メモの表（4.1/4.2）と整合するか確認 

**プロンプト例（★★☆）**

* Copilot Chatに入力：

  * 「`x=[165,170,175,180,185]` について、`ddof=0` と `ddof=1` の分散と標準偏差を両方表示し、差が分かる **短いPythonスクリプト（10〜15行）** を作って。日本語コメント多めで。」
* 期待される動作：比較用の短いスクリプトが生成される。
* やってみよう（3ステップ）

  1. `ddof=0/1` が両方入っているか確認
  2. 実行して `50` と `62.5` が出るか確認 
  3. なぜ大きい方が不偏分散になるか、言葉で説明する

**コツ**

* “R と揃える”など **目的**を明示して生成させる。
* 期待出力（50 と 62.5）を先に固定しておく。
* 生成コードのコメントを読み、理解できない行があれば削って最小化する。

**注意**

* 丸投げ禁止：`ddof` を省略したコードが出やすい。
* 「どっちが正しいか」ではなく「どっちを使うか（目的）」で判断する。
* `pandas` / NumPy / `scikit-learn` で標準化の定義が混ざると事故りやすい（授業でも実務でも頻出）。 

---

## 4.1.3 データフレームの列ごとの集計

**到達目標：** データフレームの数値列を対象に、統計量を列ごとにまとめて出力できる。

### 1) 概念説明

実務のデータはたいてい「表（データフレーム）」です。1列を1次元データとして取り出せば、平均・分散などは同じように計算できます。 
ここでは例として、英語点・数学点・性別などを含む小さなデータフレームを作り、列ごとの分散や要約統計を出します。 

---

### 2) 基本文法

#### R（data.frame）

* 1列を取り出す：`my_df$english`
* 分散：`var(my_df$english)`
* 数値列まとめて：`sapply(my_df[c("english","math")], var)`
* 要約：`summary(my_df)`（入門ではまずこれで十分）

#### Python

* 1列：`my_df["english"]`
* 分散：`my_df["english"].var(ddof=1)`
* 数値列まとめて：`my_df[["english","math"]].var(ddof=1)`
* 要約：`my_df.describe()`（数値列の要約）

---

### 3) サンプルプログラム

#### R：`my4-1-03_df_column_stats.R`

```r
my_df <- data.frame(
  name    = c("A", "B", "C", "D"),
  english = c( 60,  90,  70,  90),
  math    = c( 70,  80,  90, 100),
  gender  = c("f", "m", "m", "f")
)

cat("var(english) =", var(my_df$english), "\n")
print(sapply(my_df[c("english", "math")], var))
```

期待される出力（例）：

```text
#> var(english) = 225
#>  english     math
#>    225 166.6667
```

#### Python：`my4-1-03_df_column_stats.py`

```python
import pandas as pd

my_df = pd.DataFrame({
    "name":    ["A", "B", "C", "D"],
    "english": [ 60,  90,  70,  90],
    "math":    [ 70,  80,  90, 100],
    "gender":  ["f", "m", "m", "f"],
})

print("var(english) =", my_df["english"].var(ddof=1))
print(my_df[["english", "math"]].var(ddof=1))
```

期待される出力（例）：

```text
#> var(english) = 225.0
#> english    225.000000
#> math       166.666667
#> dtype: float64
```

---

追加：要約統計「五数要約（最小値、第1四分位数（Q1）、中央値（メディアン）、第3四分位数（Q3）、最大値）」など

#### R：`my4-1-04_df_summary.R`

```r
my_df <- data.frame(
  name=c("A","B","C","D"),
  english=c(60,90,70,90),
  math=c(70,80,90,100),
  gender=c("f","m","m","f")
)

print(summary(my_df))
```

#### Python：`my4-1-04_df_describe.py`

```python
import pandas as pd

my_df = pd.DataFrame({
    "name":    ["A", "B", "C", "D"],
    "english": [ 60,  90,  70,  90],
    "math":    [ 70,  80,  90, 100],
    "gender":  ["f", "m", "m", "f"],
})

print(my_df.describe())
```

---

### 4) 実行手順

```bash
python my4-1-03_df_column_stats.py
python my4-1-04_df_describe.py
Rscript my4-1-03_df_column_stats.R
Rscript my4-1-04_df_summary.R
```

---

### 5) よくあるミスとデバッグ

* **R：`my_df[2,3]` と書いてしまう**：それは「2行3列の1要素」です。列なら `my_df$english`、複数列なら `my_df[c("english","math")]`。
* **Python：`my_df.var()` をそのまま使う**：文字列列が混ざると意図が曖昧になります。入門では `my_df[["english","math"]]` のように数値列だけに絞る。
* **ddof を忘れる**：列の分散は `ddof` を意識（特に Python）。講義メモでも注意喚起があります。 
* **要約統計の読み違い**：`describe()` の `25%/50%/75%` は四分位数です。 

---

### 6) 💡 GitHub Copilot活用ガイド

データフレーム処理は “書き方が多い” ので、Copilot の効果が出やすい範囲です。一方で、入門段階では「短い・単純・同じ出力」を優先し、まずは **列選択 → 集計 → 表示**の3段だけに絞って、理解しながら拡張してください。

**プロンプト例（★☆☆）**

* Copilot Chatに入力：

  * 「pandas で `english` と `math` の **分散（`ddof=1`）** を表示する、**12行以内**のスクリプトを書いて。データフレームはコード内で作って。」
* 期待される動作：`DataFrame` 作成と `var(ddof=1)` のコードが生成される。
* やってみよう（3ステップ）

  1. 生成コードで `ddof=1` を確認
  2. 実行して `225` と `166.6667` が出るか確認 
  3. 列選択が `["english","math"]` になっているか確認

**プロンプト例（★★☆）**

* Copilot Chatに入力：

  * 「R で `data.frame` を作り、`english` と `math` の分散を `sapply` でまとめて表示する例を、**15行以内**で。`Rscript` で出力されるように `print()` を入れて。」
* 期待される動作：`sapply(..., var)` を含む短い例が生成される。
* やってみよう（3ステップ）

  1. `print()` があるか確認
  2. 実行して2列の分散が出るか確認
  3. 「なぜ数値列だけ選ぶのか」を説明できるようにする

**コツ（最低3つ）**

* 「ddof=1」「数値列だけ」「行数制限」を毎回書く。
* “最初は base R / 素の pandas” と宣言して、複雑な書き方を抑制する。
* 期待出力の形（2行の表、Series など）を指定する。

**注意（最低3つ）**

* 丸投げ禁止：dplyr や複雑な apply が出ると理解が追いつかない。
* 生成コードが長いときは「削って短く」を依頼し直す。
* Python/R の「同じ目的・同じ出力」を崩すと比較学習ができなくなる。

---

## 4.1.4 分割表とグループごとの集計

**到達目標：** カテゴリ別の件数（分割表）と、カテゴリ別の平均（グループ集計）を計算できる。

### 1) 概念説明（平易に / なぜ必要か）

性別・都道府県・クラスなど「文字やカテゴリ」で表される変数は、まず **値ごとの件数**を数えるのが基本です。値ごとの件数表を **分割表**と呼びます。 
さらに「gender ごとに平均点を比べる」ように、データをグループに分けて集計するのが実務の典型です。 

---

### 2) 基本文法

#### R

* 件数：`table(my_df$gender)`
* 分割表：`table(gender, excel)`（2変数）
* グループ平均：`aggregate(cbind(english, math) ~ gender, data=my_df, mean)`

#### Python

* 件数：`my_df["gender"].value_counts()`
* 分割表：`pd.crosstab(gender, excel)`
* グループ平均：`my_df.groupby("gender")[["english","math"]].mean()`

---

### 3) サンプルプログラム

#### R：`my4-1-05_contingency_group.R`

```r
my_df <- data.frame(
  name=c("A","B","C","D"),
  english=c(60,90,70,90),
  math=c(70,80,90,100),
  gender=c("f","m","m","f")
)

cat("人数（gender）\n")
print(table(my_df$gender))

my_df2 <- data.frame(gender=my_df$gender, excel=(my_df$math >= 80))
cat("\n分割表（gender × excel）\n")
print(table(my_df2$gender, my_df2$excel))

cat("\nグループ平均（gender別）\n")
print(aggregate(cbind(english, math) ~ gender, data=my_df, mean))
```

期待される出力（例）：

```text
#> 人数（gender）
#> f m
#> 2 2
#>
#> 分割表（gender × excel）
#>    FALSE TRUE
#> f     1    1
#> m     0    2
#>
#> グループ平均（gender別）
#>   gender english math
#> 1      f      75   85
#> 2      m      80   85
```

* **補足**

```r
print(aggregate(cbind(english, math) ~ gender, data=my_df, mean))
```

この1行は、**`my_df` というデータフレームを「gender（性別などのカテゴリ）」でグループ分けし、`english` と `math` の平均点をグループごとに計算して表示**するコードです。

1. `aggregate(...)`
  * **集計（要約統計）を行う関数**です。
  * ここでは「グループごとに平均を出す」目的で使っています。
2. `cbind(english, math) ~ gender`
  * これは **式（formula）** で、「何を」「何で」集計するかを指定しています。
  * 左側：`cbind(english, math)`
    * `english` と `math` の2列を **まとめて**対象にする、という意味です。
    * `cbind` は列を横に結合して“2変数同時に扱う”ために使います。
  * 右側：`gender`
    * **グルーピング変数**です。
    * `gender` の値（例：`"F"`, `"M"`）ごとに集計します。
3. `data = my_df`
  * `english`, `math`, `gender` を **どのデータフレームから参照するか**を指定しています。
4. `mean`
  * グループごとに適用する関数です。
  * ここでは **平均**を計算します。

#### Python：`my4-1-05_contingency_group.py`

```python
import pandas as pd

my_df = pd.DataFrame({
    "name":    ["A", "B", "C", "D"],
    "english": [ 60,  90,  70,  90],
    "math":    [ 70,  80,  90, 100],
    "gender":  ["f", "m", "m", "f"],
})

print("人数（gender）")
print(my_df["gender"].value_counts())

my_df2 = my_df.assign(excel=my_df["math"] >= 80)
print("\n分割表（gender × excel）")
print(pd.crosstab(my_df2["gender"], my_df2["excel"]))

print("\nグループ平均（gender別）")
print(my_df.groupby("gender")[["english", "math"]].mean())
```

---

### 4) 実行手順

```bash
python my4-1-05_contingency_group.py
Rscript my4-1-05_contingency_group.R
```

---

* **補足**

```python
print(my_df.groupby("gender")[["english", "math"]].mean())
```

この1行は、**`my_df`（pandasのDataFrame）を `gender` 列でグループ分けし、各グループについて `english` と `math` の平均を計算して表示**するコードです。

1. `my_df`
  * 集計対象の **DataFrame** です。
  * 列として少なくとも `gender`, `english`, `math` を持っている想定です。
2. `.groupby("gender")`
  * `gender` 列の値（例：`"F"`, `"M"`）ごとにデータを **グループ化** します。
  * 以降の集計処理（ここでは平均）は「グループ単位」で行われます。
3. `[["english", "math"]]`
  * グループ化した後、平均を計算したい列を **`english` と `math` に限定**しています。
  * `["english", "math"]` ではなく **二重の `[[...]]`** になっているのは、pandasで複数列を選択して **DataFrameとして保持**するためです（`[...]` が1重だとSeriesになることがあります）。
4. `.mean()`
  * 各グループ（各gender）について、選択した列の **平均**を計算します。
  * 出力は「行＝gender、列＝english/math」の表になります。
  * 欠損値（NaN）がある場合、pandasの `mean()` は **デフォルトでNaNを無視して平均**します（`skipna=True`）。

---

### 5) よくあるミスとデバッグ

* **分割表が想定と違う**：条件列（`excel`）の作り方（`>= 80`）を確認。 
* **R の `TRUE/FALSE` と Python の `True/False`**：表記は違うが意味は同じ。
* **Python の `groupby` 結果で `gender` が `index` になる**：入門ではそれでOK。必要なら `reset_index()` を後で学ぶ。
* **数値列以外まで平均しようとしてエラー**：`[["english","math"]]` のように列を限定する。

---

### 6) 💡 GitHub Copilot活用ガイド

分割表・グループ集計は「書き方が定番」なので Copilot が当たりやすい分野です。ただし、入門では“最短の書き方”が理解を助けます。Copilot に生成させるときは、**列名・条件・出力の形**を固定し、余計な整形（関数化、例外処理）を入れないように制約を与えてください。

**プロンプト例（★☆☆）**

* Copilot Chatに入力：

  * 「pandas で `gender` の人数を数えて表示し、`math>=80` の真偽列を作って `gender×excel` の分割表を `pd.crosstab` で表示する、**15行以内**の例を書いて。」
* 期待される動作：`value_counts()` と `crosstab()` を使う短い例が出る。
* やってみよう（3ステップ）

  1. `math>=80` が入っているか確認
  2. 実行して表が出るか確認
  3. `excel` の True/False の意味を説明する

**プロンプト例（★★☆）**

* Copilot Chatに入力：

  * 「R で `table()` を使って `gender` の人数と、`gender×excel` の分割表を出し、`aggregate()` で gender別の平均（english, math）を出す例を **15行以内**で。`Rscript` で出力されるように。」
* 期待される動作：`table` と `aggregate` の入門向けコードが生成される。
* やってみよう（3ステップ）

  1. `table()` が2回出ているか確認
  2. `aggregate(cbind(...))` の形を確認
  3. Python 版と同じ結論（平均値）が出るか確認 

**コツ**

* 「行数」「列名」「関数化しない」を強く指定する。
* まずは“印字だけ”にして、ファイル保存などは次の段階に回す。
* 生成コードを“自分で短くする”ことを練習にする。

**注意**

* 丸投げ禁止：意味の分からない `.apply()` や複雑な `lambda` を入れない。
* 条件列（`excel`）を作るとき、比較演算子（`>=`）の向きを間違えない。
* 出力が違うとき、データの入力ミス（70/80/90/100）を疑う。

---

## セクション末の統合演習

### 統合演習：小テスト結果CSVを、Python と R の両方で記述統計レポートにする

**目的：** 「同じ入力 → 同じ集計 → 同じ結論」を Python/R 両方で再現する。
**入力：** `scores.csv`（自分で作る）
**出力：** ターミナルに以下を表示

1. 全体の平均・標準偏差（`english, math`）
2. `gender` 別の平均（`english, math`）
3. `math>=80` の分割表（`gender×excel`）

**評価基準：**

* Python/R で **同じ結論**が出ている（数値が一致 or 表示差のみ）
* Python は分散/標準偏差で **`ddof` を意識**している（必要箇所で明示）
* スクリプトが短く（基本版）、日本語コメントがある

**提出形式：**

* `my4-1-exercise_basic.py`
* `my4-1-exercise_basic.R`
* `scores.csv`

---

### 0) 入力ファイルを作る

```bash
cat > scores.csv << 'EOF'
name,gender,english,math
A,f,60,70
B,m,90,80
C,m,70,90
D,f,90,100
EOF
```

---

### 解答例：基本版（必須）

#### Python：`my4-1-exercise_basic.py`（10〜20行、関数なし）

```python
import pandas as pd

df = pd.read_csv("scores.csv")

print("全体平均")
print(df[["english", "math"]].mean())

print("\n全体標準偏差（ddof=1）")
print(df[["english", "math"]].std(ddof=1))

df2 = df.assign(excel=df["math"] >= 80)
print("\n分割表（gender × excel）")
print(pd.crosstab(df2["gender"], df2["excel"]))

print("\ngender別平均")
print(df.groupby("gender")[["english", "math"]].mean())
```

#### R：`my4-1-exercise_basic.R`（10〜20行、関数なし）

```r
df <- read.csv("scores.csv", stringsAsFactors = FALSE)

cat("全体平均\n")
print(colMeans(df[c("english", "math")]))

cat("\n全体標準偏差（Rは不偏寄り）\n")
print(sapply(df[c("english", "math")], sd))

df2 <- data.frame(gender=df$gender, excel=(df$math >= 80))
cat("\n分割表（gender × excel）\n")
print(table(df2$gender, df2$excel))

cat("\ngender別平均\n")
print(aggregate(cbind(english, math) ~ gender, data=df, mean))
```

---

### 解答例：発展版（参考・任意）

（任意）次を追加してみてください。

* 欠損値（空欄）があるときに除外して集計する（Python: `dropna()`、R: `na.rm=TRUE` など）
* 集計結果を `report.txt` に保存する（print をファイルにリダイレクトする等）

---

## 自己チェックリスト（50〜85項目）

### A. 概念理解（15）

1. 標本と母集団の違いを説明できる 
2. 記述統計と統計的推測の違いを説明できる 
3. 平均が「代表値」である理由を説明できる 
4. 分散が「ばらつき」の指標である理由を説明できる 
5. 標準偏差が元データと同じ単位になることを説明できる 
6. 五数要約の5つを言える 
7. 四分位数（25/50/75%）の意味を説明できる 
8. 不偏分散と標本分散の違い（n-1 と n）を説明できる 
9. ddof の意味（自由度調整）を自分の言葉で説明できる 
10. R の `var()` が不偏分散であることを説明できる 
11. NumPy の `np.var()` のデフォルトが標本分散寄りであることを説明できる 
12. 標準誤差が `sd/sqrt(n)` であることを説明できる 
13. 標準偏差と標準誤差を区別できる 
14. 分割表の定義を説明できる 
15. グループごとの集計が何のために必要か説明できる 

### B. 手計算・検算（10）

16. `sum(x)/n` で平均を手計算で確認した 
17. `x` と `y` の平均が同じになることを確認した 
18. `x` と `y` の分散が大きく違うことを確認した 
19. 分散の定義式（平均との差二乗和 / (n-1)）で計算し直した 
20. 標準偏差が分散の平方根であることを計算で確認した 
21. `ddof=0` と `ddof=1` の両方を計算し、差を確認した 
22. `scores.csv` の入力値を目視で検算した
23. 分割表の合計がデータ行数と一致することを確認した
24. `groupby` / `aggregate` の平均が手計算と一致することを一部確認した
25. 表示の小数点差はあるが値は同じだと判断できた

### C. Python（15）

26. `/home/datasci/work` で作業できている
27. `python ファイル名.py` で実行できている
28. NumPy を使って平均を計算できる 
29. 分散・標準偏差で ddof=1 を明示できる 
30. `np.var(ddof=0/1)` の違いを出力で確認した 
31. pandas で DataFrame を作れる 
32. `df[["english","math"]]` のように列選択できる
33. `df.var(ddof=1)` / `df.std(ddof=1)` を使える
34. `df.describe()` を実行できる 
35. `value_counts()` でカテゴリ件数を出せる
36. `pd.crosstab()` で分割表を作れる 
37. `groupby(...).mean()` でグループ平均を出せる 
38. groupby の結果で index になることを理解している 
39. pandas と NumPy のデフォルト差に注意できる 

### D. R（15）

40. `Rscript ファイル名.R` で実行できている
41. Rscript で出力するために `cat()`/`print()` を使っている
42. `mean()` を使える 
43. `var()` を使える 
44. `sd()` を使える 
45. 標本分散を `mean((x-mean(x))^2)` で計算できる 
46. `data.frame()` を作れる 
47. `df$col` で列を取り出せる
48. `sapply(df[c(...)], var)` で複数列を集計できる 
49. `summary(df)` を読める
50. `table()` でカテゴリ件数を出せる 
51. `table(gender, excel)` の分割表を作れる 
52. `aggregate(... ~ gender, mean)` でグループ平均を出せる
53. TRUE/FALSE の意味を理解している
54. 10〜20行程度に収まる“基本版”を書けた

### E. デバッグ・Copilot・提出（10）

55. 出力が合わないときに ddof を疑える 
56. データ入力ミスを先に疑う手順でデバッグできた
57. Python と R の結果を突き合わせて検証できた
58. Copilot を使うとき「行数」「ddof」「出力形式」を指定した
59. Copilot の生成物を丸投げせず、コメントを自分で書き直した
60. Copilot に「短くして」と再指示できた
61. 統合演習の3種類の出力（全体/分割表/グループ平均）を満たした
62. ファイル名が指示どおりになっている

**チェック数による達成度評価（目安）**

* 0〜25：要復習（まずは実行と出力の型を固める）
* 26〜45：基礎OK（ddof と DataFrame 集計を反復）
* 46〜60：実務入口（Python/R の比較検証ができる）
* 61〜65：優秀（統合演習を自力で再現し、説明できる）