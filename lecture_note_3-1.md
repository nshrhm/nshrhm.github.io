# 第3章 RとPython - 3.1 入門
**データサイエンスプログラミング入門 講義ノート**

## 本節の学習目標

この3.1節では、RとPythonの基礎的な使い方を学びます。両言語を同時に学ぶことで、データサイエンスに必要なプログラミングの本質的な考え方を理解することができます。

### 学習のゴール
- ✅ 数値計算ができるようになる
- ✅ 変数を使ってデータを管理できるようになる
- ✅ 文字列を操作できるようになる
- ✅ 条件によって処理を変えられるようになる
- ✅ ファイルシステムを理解し、作業ディレクトリを扱えるようになる
- ✅ 簡単なプログラムを自分で書いて実行できるようになる

### なぜRとPythonの両方を学ぶのか
データサイエンスの世界では、RとPythonの両方が広く使われています。

- **R**: 統計分析やデータ可視化に強い
- **Python**: 機械学習や汎用プログラミングに強い

両方の言語に触れることで、**どちらの言語でも対応できる柔軟性**と、**プログラミングの本質的な理解**が身につきます。一方の言語を知っていれば、もう一方のコードもだいたい理解できるようになります。

## 3.1.0 本節の学習準備
プログラムを書き始める前に、まず作業環境を整えましょう。

### 環境の確認
あなたのPCには、すでに以下の環境が設定されています。
- **OS**: Windows with WSL2 (Ubuntu 24.04)
- **エディタ**: Visual Studio Code
- **ターミナル**: VS Code統合ターミナル

### 仮想環境の起動
プログラムを実行する前に、専用の仮想環境を起動します。この仮想環境には、必要なパッケージがすべてインストールされています。

#### 手順1: ターミナルを開く
VS Codeで、統合ターミナルを開いてください（メニューから「表示」→「ターミナル」、またはショートカット `` Ctrl+`@`）。

#### 手順2: 仮想環境を起動
ターミナルで以下のコマンドを実行します。

```bash
$ venvc
```

成功すると、プロンプトの先頭に `(class)` が表示されます。

```bash
(class) datasci@DESKTOP:~$
```

この `(class)` が表示されていれば、仮想環境が有効になっています。

💡 **トラブルシューティング**: もし `venvc` コマンドが見つからない場合は、担当教員に確認してください。

### 作業ディレクトリへの移動

プログラムファイルは、決められた作業ディレクトリに保存します。

```bash
$ cd /home/datasci/work
```

現在いるディレクトリを確認するには、以下のコマンドを入力し、

```bash
$ pwd
```

以下のように表示されればOKです。

```bash
/home/datasci/work
```

### ファイルの作成と実行方法
#### Pythonプログラムの場合

**ファイル作成**:
```bash
$ touch sample01.py
```

- **エディタで開く**: VS Codeの左側のエクスプローラーに `sample01.py` が表示されるので、クリックして開きます。
- **プログラムを書く**: エディタでコードを入力します。

**実行**

```bash
$ python sample01.py
```

#### Rプログラムの場合

- **ファイル作成**

```bash
$ touch sample01.R
```

- **エディタで開く**: VS Codeの左側のエクスプローラーに `sample01.R` が表示されるので、クリックして開きます。
- **プログラムを書く**: エディタでコードを入力します。

- **実行**

```bash
$ Rscript sample01.R
```

### 💡 よくある質問

- **Q: touchコマンドは何をしているの?**
- A: 空のファイルを作成するコマンドです。`touch ファイル名` で新しいファイルが作られます。

- **Q: ファイル名は自由に決めていいの?**  
- A: 基本的にはOKですが、以下のルールを守りましょう:
  - Python: `.py` で終わる
  - R: `.R` で終わる
  - 日本語や空白は使わない
  - わかりやすい名前にする（例: `calculation.py`, `string_test.R`）

## RとPythonの重要な相違点

プログラムを書く前に、RとPythonの主な違いを理解しておきましょう。以下の表は、混乱しやすいポイントをまとめたものです。

**表: RとPythonの重要な相違点**

| R | Python | 説明 |
|:---|:---|:---|
| `y <- x` | `y = x` | 変数への代入。本書ではRは `<-`、Pythonは `=` を使う |
| `TRUE` | `True` | 真（本当、正しい） |
| `FALSE` | `False` | 偽（嘘、間違い） |
| `&` | `and` | 論理積（かつ）※Pythonのアレイでは `&` |
| `|` | `or` | 論理和（または）※Pythonのアレイでは `|` |
| `!` | `not` | 否定（でない）※Pythonのアレイでは `~` |
| ベクタ | リスト・アレイ・シリーズ | 同じ種類のデータを並べて管理 |
| リスト | 辞書 | 文字列と値のペアを管理 |
| 1から数える | 0から数える | インデックス（番号）の開始位置 |
| 負の添字で削除 | 負の添字で後ろから | `x[-1]` の意味が異なる |
| パッケージ | モジュール | 機能をまとめたもの |

### 特に重要な違い: インデックスの数え方

データの並びから特定の要素を取り出すとき、RとPythonでは数え方が違います。

- 例: `2, 3, 5, 7` というデータがあるとき

- **Rでは**（1から数える）
  - 1番目: `2`
  - 2番目: `3`
  - 3番目: `5`
  - 4番目: `7`

- **Pythonでは**（0から数える）:
  - 0番目: `2`
  - 1番目: `3`
  - 2番目: `5`
  - 3番目: `7`

この違いは、プログラムを書く際に非常に重要なので、必ず覚えてください。

- 💡 **覚え方のコツ**: 
  - R → 人間の数え方（1, 2, 3...）
  - Python → コンピュータの数え方（0, 1, 2...）

## 3.1.1 数値演算の基礎

プログラミングの基本は計算です。まずは、電卓のようにプログラムを使って計算してみましょう。

### 基本的な四則演算

プログラムで計算するには、以下の記号を使います。

| 演算 | 記号 | 例 | 結果 |
|:---|:---:|:---|:---:|
| 足し算（加算） | `+` | `2 + 3` | `5` |
| 引き算（減算） | `-` | `5 - 2` | `3` |
| かけ算（乗算） | `*` | `2 * 3` | `6` |
| 割り算（除算） | `/` | `10 / 3` | `3.333...` |
| 商（整数の割り算） | `%/%` (R) / `//` (Python) | `10 // 3` | `3` |
| 余り | `%%` (R) / `%` (Python) | `10 % 3` | `1` |

記号の前後のスペースは、見やすさのためのものです。なくても動きますが、入れたほうが読みやすくなります。

### 数値の表記方法
#### 10進数（普通の数字）
普段使っている数字です。そのまま書けばOKです。

```python
123
```

#### 16進数
コンピュータでよく使われる16進数は、最初に `0x` を付けます。

- **R**

```r
0x10
#> [1] 16
```

- **Python**

```python
0x10
#> 16
```

💡 **説明**: `0x10` は16進数の「10」を意味し、10進数では「16」になります。

#### 指数表記
非常に大きな数や小さな数を表すときに便利です。
`1.23e5` は「1.23 × 10の5乗」= 123000 を意味します。

**R**

```r
1.23e5
#> [1] 123000
```

**Python**

```python
1.23e5
#> 123000.0
```

💡 **指数表記の読み方**
- `1.23e5` = 1.23 × 10⁵ = 1.23 × 100000 = 123000
- `1.23e-3` = 1.23 × 10⁻³ = 1.23 × 0.001 = 0.00123

### コメントの書き方
プログラムにメモを書いておくことができます。これを**コメント**といいます。
`#` 以降はコメントとして扱われ、プログラムの実行には影響しません。

```python
# これはコメントです
2 + 3  # この部分もコメントです
```

コメントは、プログラムの説明や自分へのメモとして活用しましょう。

## サンプルプログラム 1: 基本的な計算
それでは、実際にプログラムを書いて実行してみましょう。

### Python版
**ファイル名**: `sample01_arithmetic.py`

```python
# 基本的な計算のサンプル

# 四則演算
print(2 + 3)   # 足し算
#> 5

print(5 - 2)   # 引き算
#> 3

print(2 * 3)   # かけ算
#> 6

print(10 / 3)  # 割り算
#> 3.3333333333333335

# 商と余り
print(10 // 3) # 商
#> 3

print(10 % 3)  # 余り
#> 1

# 16進数
print(0x10)
#> 16

# 指数表記
print(1.23e5)
#> 123000.0
```

**実行方法**

```bash
$ python sample01_arithmetic.py
5
3
6
3.3333333333333335
3
1
16
123000.0
```

### R版

**ファイル名**: `sample01_arithmetic.R`

```r
# 基本的な計算のサンプル

# 四則演算
print(2 + 3)   # 足し算
#> [1] 5

print(5 - 2)   # 引き算
#> [1] 3

print(2 * 3)   # かけ算
#> [1] 6

print(10 / 3)  # 割り算
#> [1] 3.333333

# 商と余り
print(10 %/% 3) # 商
#> [1] 3

print(10 %% 3)  # 余り
#> [1] 1

# 16進数
print(0x10)
#> [1] 16

# 指数表記
print(1.23e5)
#> [1] 123000
```

**実行方法**

```bash
$ Rscript sample01_arithmetic.R
[1] 5
[1] 3
[1] 6
[1] 3.333333
[1] 3
[1] 1
[1] 16
[1] 123000
```

### 🎯 実行してみよう
1. 上記のプログラムを、それぞれ `sample01_arithmetic.py` と `sample01_arithmetic.R` というファイル名で保存してください
2. ターミナルで実行してみましょう
3. 結果が表示されることを確認してください

### 💡 結果の読み方
- **Python**: 計算結果がそのまま表示されます
- **R**: 結果の前に `[1]` が付きます（これは「1番目の要素」という意味です）

## サンプルプログラム 2: 複数の計算を組み合わせる
もう少し複雑な計算をしてみましょう。

### Python版

**ファイル名**: `sample02_calculation.py`

```python
# 複数の計算を組み合わせたサンプル

# 計算の優先順位（かけ算・割り算が先に計算される）
print(2 + 3 * 4)
#> 14

# 括弧を使って優先順位を変える
print((2 + 3) * 4)
#> 20

# 複雑な計算
print((10 + 5) * 2 / 3)
#> 10.0

# 余りを使った判定（偶数・奇数の判定に使える）
print(10 % 2)  # 10は2で割り切れる（偶数）
#> 0

print(11 % 2)  # 11は2で割ると余りが1（奇数）
#> 1

# 商を使った計算（金額の計算など）
my_money = 1000      # 1000円持っている
my_price = 130       # 1個130円の商品
my_quantity = my_money // my_price  # 何個買える?
my_change = my_money % my_price     # お釣りは?

print(my_quantity)   # 買える個数
#> 7

print(my_change)     # お釣り
#> 90
```

**実行方法**

```bash
$ python sample02_calculation.py
14
20
10.0
0
1
7
90
```

### R版
**ファイル名**: `sample02_calculation.R`

```r
# 複数の計算を組み合わせたサンプル

# 計算の優先順位（かけ算・割り算が先に計算される）
print(2 + 3 * 4)
#> [1] 14

# 括弧を使って優先順位を変える
print((2 + 3) * 4)
#> [1] 20

# 複雑な計算
print((10 + 5) * 2 / 3)
#> [1] 10

# 余りを使った判定（偶数・奇数の判定に使える）
print(10 %% 2)  # 10は2で割り切れる（偶数）
#> [1] 0

print(11 %% 2)  # 11は2で割ると余りが1（奇数）
#> [1] 1

# 商を使った計算（金額の計算など）
my_money <- 1000      # 1000円持っている
my_price <- 130       # 1個130円の商品
my_quantity <- my_money %/% my_price  # 何個買える?
my_change <- my_money %% my_price     # お釣りは?

print(my_quantity)   # 買える個数
#> [1] 7

print(my_change)     # お釣り
#> [1] 90
```

**実行方法**

```bash
$ Rscript sample02_calculation.R
[1] 14
[1] 20
[1] 10
[1] 0
[1] 1
[1] 7
[1] 90
```

### 🎯 練習問題
以下の計算をプログラムで実行してみましょう。

1. 123 + 456 の結果は?
2. 1000 ÷ 7 の商と余りは?
3. (5 + 3) × (10 - 4) の結果は?

---

## 💡 重要ポイントのまとめ（3.1.1）
この節で学んだこと

- ✅ **基本演算**: `+`, `-`, `*`, `/` で計算できる
- ✅ **商と余り**: R では `%/%` と `%%`、Python では `//` と `%`
- ✅ **16進数**: `0x` を付けて表記
- ✅ **指数表記**: `1.23e5` のように書く
- ✅ **コメント**: `#` 以降はメモとして書ける
- ✅ **優先順位**: かけ算・割り算が先、括弧で順序を変えられる

### 次のステップ
次の「3.1.2 変数とデータの保存」では、計算結果を保存して再利用する方法を学びます。

## 3.1.2 変数とデータの保存
計算結果をその場で確認するだけでなく、**保存して後で使いたい**ことがあります。そのために**変数**を使います。

### 変数とは
変数は、データに名前を付けて保存する仕組みです。まるで**ラベル付きの箱**のように、データを入れておくことができます。

### 変数への代入
データに名前を付けることを**代入**といいます。

#### Rの場合
Rでは `<-` という記号を使います（「左向き矢印」と読みます）。

```r
x <- 2
```

これは「2という値に `x` という名前を付ける」という意味です。

#### Pythonの場合
Pythonでは `=` という記号を使います。

```python
x = 2
```

これも「2という値に `x` という名前を付ける」という意味です。

- 💡 **重要な違い**: 
 - R: `<-` を使う（本書の方針）
  - Python: `=` を使う

### 変数を使った計算
変数に保存した値を使って、計算ができます。

- **R**
```r
x <- 2
y <- 3
x * y
#> [1] 6
```

- **Python**
```python
x = 2
y = 3
x * y
#> 6
```

### 計算結果の確認

変数に代入したときは、結果が自動的には表示されません。結果を確認するには、**変数名をそのまま書く**か、**print関数を使う**必要があります。

- **R**

```r
x <- 1 + 1
# この段階では何も表示されない

x  # 変数名を評価すると結果が表示される
#> [1] 2

print(x)  # print関数でも表示できる
#> [1] 2
```

- **Python**

```python
x = 1 + 1
# この段階では何も表示されない

x  # インタラクティブモードでは表示される
#> 2

print(x)  # print関数で確実に表示
#> 2
```

💡 **プログラムファイルでの注意**: ファイルに書いたプログラムでは、`print()` を使わないと結果が表示されません。変数名だけでは表示されないので、必ず `print()` を使いましょう。

### 複数の変数への同時代入
複数の変数に、一度に値を代入することもできます。

**R**:
```r
# kerasパッケージを使った方法（3.6節で詳しく学びます）
library(keras)
c(x, y) %<-% c(20, 30)

x
#> [1] 20

y
#> [1] 30
```

**Python**:
```python
# Pythonでは標準機能で可能
x, y = 20, 30

x
#> 20

y
#> 30
```

この機能は、複数の値を一度に扱いたいときに便利です。

### 変数名の命名規則
変数には好きな名前を付けられますが、以下のルールを守りましょう。

#### 基本ルール

1. **使える文字**: 英数字とアンダースコア（`_`）
2. **数字で始めない**: `2x` はダメ、`x2` はOK
3. **予約語は使わない**: `print`, `if`, `for` などは使えません
4. **日本語は避ける**: 技術的には可能ですが、トラブルの元になります

#### 良い変数名の例

```python
# 良い例
x
y
my_price
my_total
student_count
average_score
```

#### 悪い変数名の例

```python
# 悪い例
a  # 意味が不明
x1, x2, x3  # 何のデータか分からない
price  # 既存の関数名と被る可能性
2x  # 数字で始まっている（エラーになる）
私の価格  # 日本語（避けるべき）
```

#### 本書での命名ルール

本書では、混乱を避けるために以下のルールを採用します:

- **明らかに変数だと分かるもの**: `x`, `y`, `tmp`
- **それ以外の変数**: `my_` で始める

例:
```python
x = 10          # 一時的な変数
y = 20          # 一時的な変数
tmp = x + y     # 一時的な結果（temporary）
my_price = 100  # 意味のあるデータ
my_name = "Taro"  # 意味のあるデータ
```

この `my_` プレフィックスは、「すでに使われている名前」との衝突を避けるための工夫です。

## サンプルプログラム 3: 変数を使った計算
それでは、変数を使った実践的なプログラムを書いてみましょう。

### Python版
**ファイル名**: `sample03_variables.py`

```python
# 変数を使った計算のサンプル

# 商品の価格を変数に保存
my_price = 1000

# 消費税率（10%）
my_tax_rate = 0.10

# 税額を計算
my_tax = my_price * my_tax_rate

# 税込価格を計算
my_total = my_price + my_tax

# 結果を表示
print("商品価格:", my_price)
print("消費税額:", my_tax)
print("税込価格:", my_total)
```

**実行方法**:
```bash
$ python sample03_variables.py
商品価格: 1000
消費税額: 100.0
税込価格: 1100.0
```

### R版
**ファイル名**: `sample03_variables.R`

```r
# 変数を使った計算のサンプル

# 商品の価格を変数に保存
my_price <- 1000

# 消費税率（10%）
my_tax_rate <- 0.10

# 税額を計算
my_tax <- my_price * my_tax_rate

# 税込価格を計算
my_total <- my_price + my_tax

# 結果を表示
print(paste("商品価格:", my_price))
print(paste("消費税額:", my_tax))
print(paste("税込価格:", my_total))
```

**実行方法**:
```bash
$ Rscript sample03_variables.R
[1] "商品価格: 1000"
[1] "消費税額: 100"
[1] "税込価格: 1100"
```

### 🎯 このプログラムのポイント

1. **変数を使うメリット**: 
   - `my_price` を変更すれば、他の計算も自動的に更新される
   - コードの意味が分かりやすくなる
   
2. **わかりやすい変数名**:
   - `my_price`（価格）、`my_tax_rate`（税率）、`my_tax`（税額）など、見ただけで意味が分かる

3. **再利用性**:
   - 価格を変えたいときは `my_price` の値だけを変更すればOK

### 🎯 練習問題

1. `my_price` を 1500 に変更して実行してみましょう
2. 消費税率を8%（0.08）に変更して実行してみましょう
3. 複数の商品（例: リンゴ、バナナ、オレンジ）の合計金額を計算するプログラムを書いてみましょう

### 📚 参考: より実践的な書き方

**意欲的な学生向けの参考情報です。現時点では基本版で十分ですので、余裕がある方のみ参考にしてください。**

#### Python版（発展）

**ファイル名**: `sample03_advanced.py`

```python
# より実践的な書き方（参考）

def calculate_with_tax(price, tax_rate=0.10):
    """
    税込価格を計算する関数
    
    Args:
        price: 商品価格（正の数）
        tax_rate: 消費税率（デフォルト10%）
    
    Returns:
        税込価格、税額のタプル
    """
    # 入力値の検証
    if price < 0:
        print("エラー: 価格は0以上である必要があります")
        return None, None
    
    if tax_rate < 0 or tax_rate > 1:
        print("エラー: 税率は0から1の間である必要があります")
        return None, None
    
    # 計算
    tax = price * tax_rate
    total = price + tax
    
    return total, tax

# メイン処理
if __name__ == "__main__":
    my_price = 1000
    my_total, my_tax = calculate_with_tax(my_price)
    
    if my_total is not None:
        print(f"商品価格: {my_price}円")
        print(f"消費税額: {my_tax}円")
        print(f"税込価格: {my_total}円")
```

#### R版（発展）

**ファイル名**: `sample03_advanced.R`

```r
# より実践的な書き方（参考）

calculate_with_tax <- function(price, tax_rate = 0.10) {
  # 入力値の検証
  if (price < 0) {
    print("エラー: 価格は0以上である必要があります")
    return(list(total = NULL, tax = NULL))
  }
  
  if (tax_rate < 0 || tax_rate > 1) {
    print("エラー: 税率は0から1の間である必要があります")
    return(list(total = NULL, tax = NULL))
  }
  
  # 計算
  tax <- price * tax_rate
  total <- price + tax
  
  return(list(total = total, tax = tax))
}

# メイン処理
my_price <- 1000
result <- calculate_with_tax(my_price)

if (!is.null(result$total)) {
  print(paste("商品価格:", my_price, "円"))
  print(paste("消費税額:", result$tax, "円"))
  print(paste("税込価格:", result$total, "円"))
}
```

#### 発展版の特徴

- ✅ **関数化**: 再利用しやすくなっている
- ✅ **エラーチェック**: 不正な入力を検出できる
- ✅ **ドキュメント**: コメントで使い方を説明
- ✅ **main部分の分離**: プログラムの構造が明確

💡 **今後の学習で**: 3.2節「関数」で、このような書き方を詳しく学びます。今はシンプルな基本版を理解することに集中してください。

## 💡 重要ポイントのまとめ（3.1.2）

この節で学んだこと

- ✅ **変数への代入**: R は `<-`、Python は `=`  
- ✅ **変数の使用**: 計算結果を保存して再利用できる  
- ✅ **結果の確認**: `print()` 関数を使う  
- ✅ **命名規則**: わかりやすい名前、`my_` プレフィックスの活用  
- ✅ **複数代入**: 一度に複数の変数に値を割り当てられる

### 次のステップ
次の「3.1.3 文字列の基本操作」では、数値ではなく文字（テキスト）を扱う方法を学びます。

## 3.1.3 文字列の基本操作
プログラミングでは、数値だけでなく**文字（テキスト）**も扱います。文字の並びを**文字列**（string）といいます。

### 文
0個以上の文字が並んだものです。

- (例)
  - `"Hello"` → 5文字の文字列
  - `"こんにちは"` → 5文字の文字列
  - `"123"` → 3文字の文字列（数値ではなく文字列）
  - `""` → 0文字の文字列（空文字列）

### 文字列の作成
文字列は、`"` または `'` で囲んで表現します。

#### Rでの文字列
Rでは、本書では `"` を使います。

```r
my_s <- "abcde"
```

#### Pythonでの文字列
Pythonでは、本書では `'` を使います。

```python
my_s = 'abcde'
```

💡 **どちらを使ってもOK**: `"` と `'` のどちらでも文字列を作れますが、前後は同じでなければなりません。

```python
# OK
'Hello'
"Hello"

# NG（エラーになる）
'Hello"
"Hello'
```

💡 **使い分けのコツ**: 文字列の中に `'` や `"` を含めたいときに便利です。

```python
# 文字列の中にアポストロフィ（'）を含む場合
"It's a pen"

# 文字列の中に引用符（"）を含む場合
'He said "Hello"'
```

### 文字列の長さ
文字列が何文字あるかを調べます。

**R**:
```r
my_s <- "abcde"
nchar(my_s)
#> [1] 5
```

**Python**:
```python
my_s = 'abcde'
len(my_s)
#> 5
```

💡 **関数の違い**: 
- R: `nchar()` ... number of characters の略
- Python: `len()` ... length の略

### 文字列の連結
複数の文字列をつなげて、新しい文字列を作ります。

- **R**

```r
library(tidyverse)
str_c("This is ", "a", " pen.")
#> [1] "This is a pen."
```

💡 **tidyverseについて**: Rで文字列を扱いやすくするパッケージです。`library(tidyverse)` で読み込みます（詳しくは3.6.1項）。

- **Python**:

```python
'This is ' + 'a' + ' pen.'
#> 'This is a pen.'
```

💡 **Pythonのシンプルさ**: Pythonでは `+` 演算子で文字列を連結できます。

### 部分文字列の取得
文字列の一部を取り出すことを、**部分文字列**（substring）の取得といいます。

例: `"abcde"` から `"bcd"` を取り出す

- **R**
```r
my_s <- "abcde"
substr(x = my_s, start = 2, stop = 4)
#> [1] "bcd"
```

💡 **Rのインデックス**: 1から数えるので、2番目から4番目を指定します。

**Python**

```python
my_s = 'abcde'
my_s[1:4]
#> 'bcd'
```

💡 **Pythonのインデックス**: 0から数えるので、1番目から3番目（4は含まない）を指定します。

#### インデックスの違いの詳細
文字列 `"abcde"` の各文字の位置

- **R（1から数える）**

```
文字:  a   b   c   d   e
位置:  1   2   3   4   5
```

- **Python（0から数える）**

```
文字:  a   b   c   d   e
位置:  0   1   2   3   4
```

そのため、`"bcd"` を取り出すには:
- R: `substr(my_s, 2, 4)` → 2番目から4番目
- Python: `my_s[1:4]` → 1番目から3番目（4は含まれない）

💡 **Pythonのスライス**: `[start:end]` の `end` は含まれないことに注意！

### 文字列のフォーマット（テンプレート）
穴埋めのテンプレートを使って、文字列を作成します。

- **R**

```r
tmp <- "%s is %s."
sprintf(tmp, "This", "a pen")
#> [1] "This is a pen."
```

💡 **Rのフォーマット**: `%s` が文字列の穴を表します。

- **Python**

```python
tmp = "{} is {}."
tmp.format('This', 'a pen')
#> 'This is a pen.'
```

💡 **Pythonのフォーマット**: `{}` が穴を表します。`format()` メソッドで値を埋め込みます。

#### より便利な方法（Python 3.6以降）
Pythonでは、**f-string**という便利な機能があります:

```python
my_name = 'Taro'
my_age = 20
f'My name is {my_name} and I am {my_age} years old.'
#> 'My name is Taro and I am 20 years old.'
```

文字列の前に `f` を付けて、`{}` の中に直接変数名を書くことができます。

## サンプルプログラム 4: 文字列の基本操作
文字列の基本的な操作を試してみましょう。

### Python版

- **ファイル名**: `sample04_string_basic.py`

```python
# 文字列の基本操作のサンプル

# 文字列の作成
my_greeting = 'Hello'
my_name = 'Taro'

# 文字列の長さ
print("greetingの長さ:", len(my_greeting))
print("nameの長さ:", len(my_name))

# 文字列の連結
my_message = my_greeting + ', ' + my_name + '!'
print(my_message)

# 部分文字列の取得
my_text = 'Hello, World!'
print("最初の5文字:", my_text[0:5])
print("7文字目から:", my_text[7:])
```

- **実行方法**

```bash
$ python sample04_string_basic.py
greetingの長さ: 5
nameの長さ: 4
Hello, Taro!
最初の5文字: Hello
7文字目から: World!
```

### R版

- **ファイル名**: `sample04_string_basic.R`

```r
# 文字列の基本操作のサンプル

# 文字列の作成
my_greeting <- "Hello"
my_name <- "Taro"

# 文字列の長さ
print(paste("greetingの長さ:", nchar(my_greeting)))
print(paste("nameの長さ:", nchar(my_name)))

# 文字列の連結
library(tidyverse)
my_message <- str_c(my_greeting, ", ", my_name, "!")
print(my_message)

# 部分文字列の取得
my_text <- "Hello, World!"
print(paste("最初の5文字:", substr(my_text, 1, 5)))
print(paste("8文字目から:", substr(my_text, 8, nchar(my_text))))
```

**実行方法**

```bash
$ Rscript sample04_string_basic.R
[1] "greetingの長さ: 5"
[1] "nameの長さ: 4"
[1] "Hello, Taro!"
[1] "最初の5文字: Hello"
[1] "8文字目から: World!"
```

## サンプルプログラム 5: 文字列のフォーマット
テンプレートを使った文字列の作成を試してみましょう。

### Python版
- **ファイル名**: `sample05_string_format.py`

```python
# 文字列フォーマットのサンプル

# 基本的なフォーマット
my_name = 'Taro'
my_age = 20
my_city = 'Tokyo'

# format()メソッドを使う方法
template = "My name is {}. I am {} years old. I live in {}."
message = template.format(my_name, my_age, my_city)
print(message)

# f-stringを使う方法（より簡単）
message2 = f"My name is {my_name}. I am {my_age} years old. I live in {my_city}."
print(message2)

# 計算結果も埋め込める
my_price = 1000
my_quantity = 3
print(f"{my_quantity}個で{my_price * my_quantity}円です")
```

- **実行方法**

```bash
$ python sample05_string_format.py
My name is Taro. I am 20 years old. I live in Tokyo.
My name is Taro. I am 20 years old. I live in Tokyo.
3個で3000円です
```

### R版
- **ファイル名**: `sample05_string_format.R`

```r
# 文字列フォーマットのサンプル

# 変数の準備
my_name <- "Taro"
my_age <- 20
my_city <- "Tokyo"

# sprintf()を使う方法
template <- "My name is %s. I am %d years old. I live in %s."
message <- sprintf(template, my_name, my_age, my_city)
print(message)

# paste()を使う方法
message2 <- paste("My name is", my_name, ". I am", my_age, "years old. I live in", my_city, ".")
print(message2)

# 計算結果も埋め込める
my_price <- 1000
my_quantity <- 3
print(sprintf("%d個で%d円です", my_quantity, my_price * my_quantity))
```

- **実行方法**

```bash
$ Rscript sample05_string_format.R
[1] "My name is Taro. I am 20 years old. I live in Tokyo."
[1] "My name is Taro . I am 20 years old. I live in Tokyo ."
[1] "3個で3000円です"
```

### 🎯 このプログラムのポイント

1. **テンプレートの便利さ**: 
   - 文字列の構造を先に決めておける
   - 値を後から埋め込むだけで文字列が完成
   
2. **可読性の向上**:
   - `+` で連結するより読みやすい
   - 複雑な文字列も管理しやすい

3. **Python のf-string**:
   - 最も簡単で読みやすい
   - 変数名をそのまま `{}` の中に書ける

### 🎯 練習問題

1. 自分の名前、年齢、出身地を変数に入れて、自己紹介文を作成してみましょう
2. 商品名、価格、個数から「〇〇を△個、合計□□円」という文字列を作ってみましょう
3. 部分文字列を使って、メールアドレスから@より前の部分を取り出してみましょう

### 📚 参考: より実践的な書き方
**意欲的な学生向けの参考情報です。現時点では基本版で十分ですので、余裕がある方のみ参考にしてください。**

#### Python版（発展）
- **ファイル名**: `sample05_advanced.py`

```python
# より実践的な書き方（参考）

def create_greeting(name, age, city):
    """
    自己紹介文を生成する関数
    
    Args:
        name: 名前（文字列）
        age: 年齢（整数）
        city: 居住都市（文字列）
    
    Returns:
        自己紹介文（文字列）
    """
    # 入力値の検証
    if not isinstance(name, str) or not name:
        return "エラー: 名前は空でない文字列である必要があります"
    
    if not isinstance(age, int) or age < 0:
        return "エラー: 年齢は正の整数である必要があります"
    
    if not isinstance(city, str) or not city:
        return "エラー: 都市名は空でない文字列である必要があります"
    
    # 自己紹介文の生成
    greeting = f"My name is {name}. I am {age} years old. I live in {city}."
    return greeting

# メイン処理
if __name__ == "__main__":
    # 正常なケース
    result = create_greeting("Taro", 20, "Tokyo")
    print(result)
    
    # エラーケース（年齢が負の数）
    result = create_greeting("Hanako", -5, "Osaka")
    print(result)
    
    # 複数人の自己紹介
    people = [
        {"name": "Taro", "age": 20, "city": "Tokyo"},
        {"name": "Hanako", "age": 22, "city": "Osaka"},
        {"name": "Jiro", "age": 19, "city": "Kyoto"}
    ]
    
    print("\n=== 複数人の自己紹介 ===")
    for person in people:
        greeting = create_greeting(person["name"], person["age"], person["city"])
        print(greeting)
```

#### R版（発展）
- **ファイル名**: `sample05_advanced.R`

```r
# より実践的な書き方（参考）

create_greeting <- function(name, age, city) {
  # 入力値の検証
  if (!is.character(name) || nchar(name) == 0) {
    return("エラー: 名前は空でない文字列である必要があります")
  }
  
  if (!is.numeric(age) || age < 0) {
    return("エラー: 年齢は正の数である必要があります")
  }
  
  if (!is.character(city) || nchar(city) == 0) {
    return("エラー: 都市名は空でない文字列である必要があります")
  }
  
  # 自己紹介文の生成
  greeting <- sprintf("My name is %s. I am %d years old. I live in %s.", 
                      name, as.integer(age), city)
  return(greeting)
}

# メイン処理
# 正常なケース
result <- create_greeting("Taro", 20, "Tokyo")
print(result)

# エラーケース（年齢が負の数）
result <- create_greeting("Hanako", -5, "Osaka")
print(result)

# 複数人の自己紹介
people <- list(
  list(name = "Taro", age = 20, city = "Tokyo"),
  list(name = "Hanako", age = 22, city = "Osaka"),
  list(name = "Jiro", age = 19, city = "Kyoto")
)

print("\n=== 複数人の自己紹介 ===")
for (person in people) {
  greeting <- create_greeting(person$name, person$age, person$city)
  print(greeting)
}
```

#### 発展版の特徴

- ✅ **関数化**: 処理を再利用可能にしている
- ✅ **入力検証**: 不正なデータを検出できる
- ✅ **エラーメッセージ**: 問題を具体的に伝える
- ✅ **複数データの処理**: リストやループを使った応用

💡 **今後の学習で**: 3.3節「コレクション」と3.7節「反復処理」で、このような書き方を詳しく学びます。

## 💡 重要ポイントのまとめ（3.1.3）

この節で学んだこと

- ✅ **文字列の作成**: `"..."` または `'...'` で囲む  
- ✅ **文字列の長さ**: R は `nchar()`、Python は `len()`  
- ✅ **文字列の連結**: R は `str_c()`、Python は `+`  
- ✅ **部分文字列**: R は `substr()`、Python は `[start:end]`  
- ✅ **フォーマット**: R は `sprintf()`、Python は `format()` や f-string  
- ✅ **インデックスの違い**: R は1から、Python は0から数える

### 次のステップ
次の「3.1.4 論理値と条件判断」では、真偽を判定して処理を変える方法を学びます。

## 3.1.4 論理値と条件判断

プログラムでは、「正しいか間違っているか」や「条件を満たしているか」を判定することがよくあります。このような判定に使うのが**論理値**です。

### 論理値とは
論理値は、**真**（正しい）か**偽**（間違い）のどちらか一方だけを表す値です。

- **Rの場合**
  - 真: `TRUE`
  - 偽: `FALSE`

- **Pythonの場合**
  - 真: `True`
  - 偽: `False`

- 💡 **大文字・小文字の違いに注意**: 
  - R: すべて大文字（`TRUE`, `FALSE`）
  - Python: 最初だけ大文字（`True`, `False`）

#### Rでの注意点
Rには `T` と `F` という短縮形がありますが、これらは変数なので値を変更できてしまいます。そのため、本書では使いません。

```r
# 推奨しない書き方
T  # TRUE と同じだが...
F  # FALSE と同じだが...

# T と F は変数なので、値を変えられてしまう
T <- FALSE  # こんなことができてしまう（危険！）
```

### 比較演算
2つの値を比較して、真偽を判定します。

#### 比較演算子の一覧

| 演算子 | 意味 | 例 | 結果 |
|:---:|:---|:---|:---:|
| `==` | 等しい | `1 == 2` | `FALSE` / `False` |
| `!=` | 等しくない | `1 != 2` | `TRUE` / `True` |
| `<` | より小さい | `1 < 2` | `TRUE` / `True` |
| `>` | より大きい | `1 > 2` | `FALSE` / `False` |
| `<=` | 以下 | `1 <= 1` | `TRUE` / `True` |
| `>=` | 以上 | `1 >= 2` | `FALSE` / `False` |

💡 **注意**: 等号は `==` と2つ重ねます。`=` は代入に使われるので、比較には使えません。

**R**

```r
1 <= 2
#> [1] TRUE

1 < 0
#> [1] FALSE
```

**Python**
```python
1 <= 2
#> True

1 < 0
#> False
```

### 浮動小数点数の比較
小数点を含む数値（浮動小数点数）の比較には注意が必要です。
コンピュータは内部で2進数を使って計算するため、`0.1` のような数値を正確に表現できません。そのため、計算結果が予想と異なることがあります。

#### **問題の例**
- **R**

```r
0.1 + 0.1 + 0.1 == 0.3
#> [1] FALSE  # 本来はTRUEであるべき
```

- **Python**

```python
0.1 + 0.1 + 0.1 == 0.3
#> False  # 本来はTrueであるべき
```

💡 **なぜこうなるの?**: コンピュータ内部では、`0.1 + 0.1 + 0.1` は `0.30000000000000004` のような微妙にずれた値になっているためです。

#### 正しい比較方法
浮動小数点数を比較するときは、**近似的な比較**を行う関数を使います。

- **R**

```r
all.equal(0.1 + 0.1 + 0.1, 0.3)
#> [1] TRUE  # 正しく判定される
```

- **Python**

```python
import math
math.isclose(0.1 + 0.1 + 0.1, 0.3)
#> True  # 正しく判定される
```

💡 **覚えておこう**: 小数の比較は `==` ではなく、専用の関数を使う！

### 論理演算
複数の論理値を組み合わせて、新しい論理値を作ります。

#### 論理演算子の一覧

- **R**

| 演算子 | 意味 | 例 | 結果 |
|:---:|:---|:---|:---:|
| `&` | 論理積（かつ） | `TRUE & FALSE` | `FALSE` |
| `|` | 論理和（または） | `TRUE | FALSE` | `TRUE` |
| `!` | 否定（でない） | `!TRUE` | `FALSE` |

**Python**

| 演算子 | 意味 | 例 | 結果 |
|:---:|:---|:---|:---:|
| `and` | 論理積（かつ） | `True and False` | `False` |
| `or` | 論理和（または） | `True or False` | `True` |
| `not` | 否定（でない） | `not True` | `False` |

#### 論理積（AND）

両方とも真のときだけ真になります。

**R**

```r
TRUE & TRUE    # 両方とも真 → 真
#> [1] TRUE

TRUE & FALSE   # 片方が偽 → 偽
#> [1] FALSE

FALSE & FALSE  # 両方とも偽 → 偽
#> [1] FALSE
```

**Python**

```python
True and True    # 両方とも真 → 真
#> True

True and False   # 片方が偽 → 偽
#> False

False and False  # 両方とも偽 → 偽
#> False
```

#### 論理和（OR）
どちらか一方でも真なら真になります。

**R**

```r
TRUE | TRUE    # 両方とも真 → 真
#> [1] TRUE

TRUE | FALSE   # 片方が真 → 真
#> [1] TRUE

FALSE | FALSE  # 両方とも偽 → 偽
#> [1] FALSE
```

**Python**

```python
True or True    # 両方とも真 → 真
#> True

True or False   # 片方が真 → 真
#> True

False or False  # 両方とも偽 → 偽
#> False
```

#### 否定（NOT）
真と偽を逆にします。

**R**
```r
!TRUE   # 真の否定 → 偽
#> [1] FALSE

!FALSE  # 偽の否定 → 真
#> [1] TRUE
```

**Python**
```python
not True   # 真の否定 → 偽
#> False

not False  # 偽の否定 → 真
#> True
```

### 条件演算子
条件によって、結果を切り替える演算子です。**三項演算子**とも呼ばれます。
書き方は、RとPythonで大きく異なります。

**R**

```r
ifelse(条件, 真のときの値, 偽のときの値)
```

**Python**

```python
真のときの値 if 条件 else 偽のときの値
```

#### 使用例

「3 < 5」が真なら0、偽なら10を返す。

**R**

```r
ifelse(3 < 5, 0, 10)
#> [1] 0
```

**Python**

```python
0 if 3 < 5 else 10
#> 0
```

#### 実用的な例

**R**

```r
# 年齢に応じたメッセージ
my_age <- 18
my_message <- ifelse(my_age >= 20, "成人です", "未成年です")
print(my_message)
#> [1] "未成年です"
```

**Python**

```python
# 年齢に応じたメッセージ
my_age = 18
my_message = "成人です" if my_age >= 20 else "未成年です"
print(my_message)
#> 未成年です
```

## サンプルプログラム 6: 論理値と条件判断
論理値と条件判断を使った実践的なプログラムを書いてみましょう。

### Python版
**ファイル名**: `sample06_logic.py`

```python
# 論理値と条件判断のサンプル

# 比較演算
print("=== 比較演算 ===")
my_score = 85
print(f"点数: {my_score}")
print(f"80点以上: {my_score >= 80}")
print(f"100点満点: {my_score == 100}")
print(f"60点未満: {my_score < 60}")

# 論理演算
print("\n=== 論理演算 ===")
my_age = 25
my_has_license = True
print(f"年齢: {my_age}, 免許: {my_has_license}")
print(f"20歳以上かつ免許あり: {my_age >= 20 and my_has_license}")
print(f"18歳未満または免許なし: {my_age < 18 or not my_has_license}")

# 条件演算子
print("\n=== 条件判断 ===")
my_temperature = 37.5
my_status = "発熱" if my_temperature >= 37.5 else "平熱"
print(f"体温: {my_temperature}℃ → {my_status}")

# 複数の条件
my_price = 1000
my_discount = 0.2 if my_price >= 1000 else 0.1
my_final_price = my_price * (1 - my_discount)
print(f"\n価格: {my_price}円")
print(f"割引率: {my_discount * 100}%")
print(f"割引後: {my_final_price}円")
```

**実行方法**

```bash
$ python sample06_logic.py
=== 比較演算 ===
点数: 85
80点以上: True
100点満点: False
60点未満: False

=== 論理演算 ===
年齢: 25, 免許: True
20歳以上かつ免許あり: True
18歳未満または免許なし: False

=== 条件判断 ===
体温: 37.5℃ → 発熱

価格: 1000円
割引率: 20.0%
割引後: 800.0円
```

### R版
**ファイル名**: `sample06_logic.R`

```r
# 論理値と条件判断のサンプル

# 比較演算
print("=== 比較演算 ===")
my_score <- 85
print(paste("点数:", my_score))
print(paste("80点以上:", my_score >= 80))
print(paste("100点満点:", my_score == 100))
print(paste("60点未満:", my_score < 60))

# 論理演算
print("\n=== 論理演算 ===")
my_age <- 25
my_has_license <- TRUE
print(paste("年齢:", my_age, ", 免許:", my_has_license))
print(paste("20歳以上かつ免許あり:", my_age >= 20 & my_has_license))
print(paste("18歳未満または免許なし:", my_age < 18 | !my_has_license))

# 条件演算子
print("\n=== 条件判断 ===")
my_temperature <- 37.5
my_status <- ifelse(my_temperature >= 37.5, "発熱", "平熱")
print(paste("体温:", my_temperature, "℃ →", my_status))

# 複数の条件
my_price <- 1000
my_discount <- ifelse(my_price >= 1000, 0.2, 0.1)
my_final_price <- my_price * (1 - my_discount)
print(paste("\n価格:", my_price, "円"))
print(paste("割引率:", my_discount * 100, "%"))
print(paste("割引後:", my_final_price, "円"))
```

**実行方法**

```bash
$ Rscript sample06_logic.R
[1] "=== 比較演算 ==="
[1] "点数: 85"
[1] "80点以上: TRUE"
[1] "100点満点: FALSE"
[1] "60点未満: FALSE"
[1] "\n=== 論理演算 ==="
[1] "年齢: 25 , 免許: TRUE"
[1] "20歳以上かつ免許あり: TRUE"
[1] "18歳未満または免許なし: FALSE"
[1] "\n=== 条件判断 ==="
[1] "体温: 37.5 ℃ → 発熱"
[1] "\n価格: 1000 円"
[1] "割引率: 20 %"
[1] "割引後: 800 円"
```

### 🎯 このプログラムのポイント

1. **比較演算の活用**
   - 点数や年齢の判定に使える
   - 条件を明確に表現できる

2. **論理演算の組み合わせ**
   - 複数の条件を組み合わせられる
   - 「AかつB」「AまたはB」のような判定ができる

3. **条件演算子の実用性**:
   - 条件に応じて値を切り替えられる
   - コードが簡潔になる

### 🎯 練習問題

1. 自分の年齢を変数に入れて、「未成年」「成人」「高齢者（65歳以上）」を判定するプログラムを書いてみましょう
2. 2つの数値を比較して、大きい方を表示するプログラムを書いてみましょう
3. 試験の点数（0-100点）を入れて、「優（80点以上）」「良（60-79点）」「可（40-59点）」「不可（39点以下）」を判定するプログラムを書いてみましょう


### 📚 参考: より実践的な書き方
**意欲的な学生向けの参考情報です。現時点では基本版で十分ですので、余裕がある方のみ参考にしてください。**

#### Python版（発展）
**ファイル名**: `sample06_advanced.py`

```python
# より実践的な書き方（参考）

def evaluate_score(score):
    """
    点数を評価する関数
    
    Args:
        score: 点数（0-100）
    
    Returns:
        評価（優/良/可/不可）
    """
    if not isinstance(score, (int, float)):
        return "エラー: 点数は数値である必要があります"
    
    if score < 0 or score > 100:
        return "エラー: 点数は0-100の範囲である必要があります"
    
    if score >= 80:
        return "優"
    elif score >= 60:
        return "良"
    elif score >= 40:
        return "可"
    else:
        return "不可"

def check_driving_eligibility(age, has_license):
    """
    運転資格を判定する関数
    
    Args:
        age: 年齢
        has_license: 免許の有無
    
    Returns:
        判定結果のメッセージ
    """
    if not isinstance(age, int) or age < 0:
        return "エラー: 年齢は正の整数である必要があります"
    
    if not isinstance(has_license, bool):
        return "エラー: 免許の有無はTrue/Falseで指定してください"
    
    if age >= 18 and has_license:
        return "運転可能です"
    elif age >= 18 and not has_license:
        return "免許を取得してください"
    else:
        return "18歳未満のため運転できません"

# メイン処理
if __name__ == "__main__":
    # 点数評価のテスト
    print("=== 点数評価 ===")
    test_scores = [95, 75, 55, 35, -10, 150]
    for score in test_scores:
        result = evaluate_score(score)
        print(f"点数 {score}: {result}")
    
    # 運転資格判定のテスト
    print("\n=== 運転資格判定 ===")
    test_cases = [
        (25, True),
        (20, False),
        (16, True),
        (16, False)
    ]
    for age, has_license in test_cases:
        result = check_driving_eligibility(age, has_license)
        print(f"年齢 {age}, 免許 {has_license}: {result}")
```

#### R版（発展）
**ファイル名**: `sample06_advanced.R`

```r
# より実践的な書き方（参考）

evaluate_score <- function(score) {
  # 入力値の検証
  if (!is.numeric(score)) {
    return("エラー: 点数は数値である必要があります")
  }
  
  if (score < 0 || score > 100) {
    return("エラー: 点数は0-100の範囲である必要があります")
  }
  
  # 評価
  if (score >= 80) {
    return("優")
  } else if (score >= 60) {
    return("良")
  } else if (score >= 40) {
    return("可")
  } else {
    return("不可")
  }
}

check_driving_eligibility <- function(age, has_license) {
  # 入力値の検証
  if (!is.numeric(age) || age < 0) {
    return("エラー: 年齢は正の数である必要があります")
  }
  
  if (!is.logical(has_license)) {
    return("エラー: 免許の有無はTRUE/FALSEで指定してください")
  }
  
  # 判定
  if (age >= 18 && has_license) {
    return("運転可能です")
  } else if (age >= 18 && !has_license) {
    return("免許を取得してください")
  } else {
    return("18歳未満のため運転できません")
  }
}

# メイン処理
# 点数評価のテスト
print("=== 点数評価 ===")
test_scores <- c(95, 75, 55, 35, -10, 150)
for (score in test_scores) {
  result <- evaluate_score(score)
  print(paste("点数", score, ":", result))
}

# 運転資格判定のテスト
print("\n=== 運転資格判定 ===")
test_cases <- list(
  list(age = 25, has_license = TRUE),
  list(age = 20, has_license = FALSE),
  list(age = 16, has_license = TRUE),
  list(age = 16, has_license = FALSE)
)
for (test_case in test_cases) {
  result <- check_driving_eligibility(test_case$age, test_case$has_license)
  print(paste("年齢", test_case$age, ", 免許", test_case$has_license, ":", result))
}
```

#### 発展版の特徴

- ✅ **関数化**: 判定ロジックを再利用可能にしている
- ✅ **入力検証**: 不正なデータを検出できる
- ✅ **多段階の条件分岐**: if-elif-else を使った複雑な判定
- ✅ **テストケース**: 様々なパターンを自動でテスト

💡 **今後の学習で**: 3.2節「関数」で、このような書き方を詳しく学びます。

---

## 💡 重要ポイントのまとめ（3.1.4）
この節で学んだこと

- ✅ **論理値**: R は `TRUE/FALSE`、Python は `True/False`  
- ✅ **比較演算**: `==`, `!=`, `<`, `>`, `<=`, `>=`  
- ✅ **浮動小数点数の比較**: `all.equal()` や `math.isclose()` を使う  
- ✅ **論理演算**: R は `&`, `|`, `!`、Python は `and`, `or`, `not`  
- ✅ **条件演算子**: R は `ifelse()`、Python は `値 if 条件 else 値`

### 次のステップ
次の「3.1.5 作業ディレクトリの理解」では、ファイルシステムの操作方法を学びます。

## 3.1.5 作業ディレクトリの理解
プログラムでファイルを読み書きするとき、**どこで作業しているか**を意識する必要があります。その「どこ」を**作業ディレクトリ**といいます。

### 作業ディレクトリとは
作業ディレクトリは、プログラムが実行されている「現在地」です。

- ファイル名だけで指定すると、作業ディレクトリ内のファイルにアクセスします
- 作業ディレクトリ以外のファイルにアクセスするには、パスを指定する必要があります

💡 **ターミナルとの関係**: ターミナルで `cd` コマンドで移動する「カレントディレクトリ」と同じ概念です（2.4.5項）。

### 作業ディレクトリの確認
現在の作業ディレクトリを確認します。

- **R**

```r
getwd()
#> [1] "/home/datasci/work"
```

💡 **関数名の意味**: `getwd` = get working directory（作業ディレクトリを取得）

**Python**

```python
import os
os.getcwd()
#> '/home/datasci/work'
```

💡 **関数名の意味**: `getcwd` = get current working directory（現在の作業ディレクトリを取得）

💡 **Pythonの注意**: `os` モジュールを最初に読み込む必要があります（`import os`）。モジュールについては3.6.2項で詳しく学びます。

### 作業ディレクトリの変更

作業ディレクトリを別の場所に変更します。

**R**:
```r
setwd("..")     # 一つ上のディレクトリに移動
getwd()
#> [1] "/home/datasci"

setwd("work")   # workディレクトリに移動
getwd()
#> [1] "/home/datasci/work"
```

💡 **関数名の意味**: `setwd` = set working directory（作業ディレクトリを設定）

- **Python**

```python
import os
os.chdir('..')  # 一つ上のディレクトリに移動
os.getcwd()
#> '/home/datasci'

os.chdir('work')  # workディレクトリに移動
os.getcwd()
#> '/home/datasci/work'
```

💡 **関数名の意味**: `chdir` = change directory（ディレクトリを変更）

- ### パスの指定方法

ファイルやディレクトリの場所を指定する方法は2つあります。

#### 相対パス

現在の作業ディレクトリを基準にした指定方法です。

**特殊な記号**:
- `.` : 現在のディレクトリ
- `..` : 一つ上のディレクトリ

**例**

```python
# 現在が /home/datasci/work の場合

'data.txt'          # /home/datasci/work/data.txt
'./data.txt'        # /home/datasci/work/data.txt（同じ）
'../data.txt'       # /home/datasci/data.txt（一つ上）
'../data/test.txt'  # /home/datasci/data/test.txt
```

#### 絶対パス
ルートディレクトリ（`/`）を基準にした、完全な指定方法です。

- **例**

```python
'/home/datasci/work/data.txt'    # どこからでもこのファイルを指す
'/usr/local/bin/python'          # どこからでもこのファイルを指す
```

- 💡 **絶対パスの特徴**:
  - 必ず `/` で始まる
  - 作業ディレクトリに関係なく、同じファイルを指す
  - 確実だが、長くなりがち

- 💡 **相対パスの特徴**:
  - `/` で始まらない
  - 作業ディレクトリによって指すファイルが変わる
  - 短く書けるが、現在地を意識する必要がある

### UNIXコマンドとの対応

プログラム内での操作は、ターミナルでのコマンドと対応しています。

| 操作 | ターミナル | R | Python |
|:---|:---|:---|:---|
| 現在地の確認 | `pwd` | `getwd()` | `os.getcwd()` |
| ディレクトリの移動 | `cd path` | `setwd("path")` | `os.chdir('path')` |
| ファイル一覧 | `ls` | `list.files()` | `os.listdir()` |

💡 **両方使いこなそう**: ターミナルでの操作とプログラム内での操作、両方できると便利です。

## サンプルプログラム 7: ディレクトリ操作
作業ディレクトリの確認と変更を試してみましょう。

### Python版
**ファイル名**: `sample07_directory.py`

```python
# 作業ディレクトリの操作サンプル

import os

# 現在の作業ディレクトリを確認
print("=== 現在の作業ディレクトリ ===")
current_dir = os.getcwd()
print(current_dir)

# ディレクトリ内のファイルを一覧表示
print("\n=== ファイル一覧 ===")
files = os.listdir('.')
for file in files:
    print(file)

# 一つ上のディレクトリに移動
print("\n=== 一つ上に移動 ===")
os.chdir('..')
print("移動後:", os.getcwd())

# 元のディレクトリに戻る
print("\n=== 元の場所に戻る ===")
os.chdir('work')
print("戻った後:", os.getcwd())

# 絶対パスで確認
print("\n=== 絶対パスでの確認 ===")
print("絶対パス:", os.path.abspath('.'))
print("一つ上の絶対パス:", os.path.abspath('..'))
```

**実行方法**:
```bash
$ python sample07_directory.py
=== 現在の作業ディレクトリ ===
/home/datasci/work

=== ファイル一覧 ===
sample01_arithmetic.py
sample02_calculation.py
sample03_variables.py
...

=== 一つ上に移動 ===
移動後: /home/datasci

=== 元の場所に戻る ===
戻った後: /home/datasci/work

=== 絶対パスでの確認 ===
絶対パス: /home/datasci/work
一つ上の絶対パス: /home/datasci
```

### R版
**ファイル名**: `sample07_directory.R`

```r
# 作業ディレクトリの操作サンプル

# 現在の作業ディレクトリを確認
print("=== 現在の作業ディレクトリ ===")
current_dir <- getwd()
print(current_dir)

# ディレクトリ内のファイルを一覧表示
print("\n=== ファイル一覧 ===")
files <- list.files('.')
for (file in files) {
  print(file)
}

# 一つ上のディレクトリに移動
print("\n=== 一つ上に移動 ===")
setwd('..')
print(paste("移動後:", getwd()))

# 元のディレクトリに戻る
print("\n=== 元の場所に戻る ===")
setwd('work')
print(paste("戻った後:", getwd()))

# 絶対パスで確認
print("\n=== 絶対パスでの確認 ===")
print(paste("絶対パス:", normalizePath('.')))
print(paste("一つ上の絶対パス:", normalizePath('..')))
```

**実行方法**:
```bash
$ Rscript sample07_directory.R
[1] "=== 現在の作業ディレクトリ ==="
[1] "/home/datasci/work"
[1] "\n=== ファイル一覧 ==="
[1] "sample01_arithmetic.R"
[1] "sample02_calculation.R"
[1] "sample03_variables.R"
...
[1] "\n=== 一つ上に移動 ==="
[1] "移動後: /home/datasci"
[1] "\n=== 元の場所に戻る ==="
[1] "戻った後: /home/datasci/work"
[1] "\n=== 絶対パスでの確認 ==="
[1] "絶対パス: /home/datasci/work"
[1] "一つ上の絶対パス: /home/datasci"
```

### 🎯 このプログラムのポイント

1. **作業ディレクトリの確認**:
   - プログラムがどこで実行されているか把握できる
   - ファイル操作のトラブルシューティングに役立つ

2. **ファイル一覧の取得**:
   - どんなファイルがあるか確認できる
   - データファイルの存在確認に使える

3. **ディレクトリの移動**:
   - 異なる場所のファイルにアクセスできる
   - 元の場所に戻ることも重要

### 🎯 練習問題

1. 現在のディレクトリのファイル数を数えるプログラムを書いてみましょう
2. 特定の拡張子（例: `.py` や `.R`）のファイルだけを一覧表示するプログラムを書いてみましょう
3. ホームディレクトリ（`~`）に移動して、そこのファイルを表示するプログラムを書いてみましょう

## 💡 重要ポイントのまとめ（3.1.5）

この節で学んだこと

- ✅ **作業ディレクトリ**: プログラムの「現在地」  
- ✅ **確認方法**: R は `getwd()`、Python は `os.getcwd()`  
- ✅ **変更方法**: R は `setwd()`、Python は `os.chdir()`  
- ✅ **相対パス**: 現在地を基準にした指定（`.`, `..`）  
- ✅ **絶対パス**: ルートから完全に指定（`/` で始まる）  
- ✅ **UNIXコマンドとの対応**: `pwd`, `cd`, `ls` と関連

### 次のステップ
次の「3.1.6 プログラムの実行とデバッグ」では、エラーへの対処方法を学びます。

## 3.1.6 プログラムの実行とデバッグ
プログラムを書いていると、必ずエラーに遭遇します。**エラーは学びのチャンス**です。この節では、エラーへの対処方法を学びます。

### コメントの効果的な書き方
良いコメントは、自分や他人がプログラムを理解するのに役立ちます。

#### コメントの基本

- **R**

```r
# これは一行コメントです
x <- 10  # 行の途中からもコメントにできます
```

- **Python**

```python
# これは一行コメントです
x = 10  # 行の途中からもコメントにできます
```

#### 良いコメントの例

```python
# 良いコメントの例

# 消費税率（2024年10月時点）
TAX_RATE = 0.10

# 商品価格から税込価格を計算する
my_price = 1000
my_total = my_price * (1 + TAX_RATE)

# 結果を小数点以下を切り捨てて表示
print(int(my_total))
```

#### 避けるべきコメント

```python
# 避けるべきコメントの例

# xに10を代入  ← コードを見れば分かる
x = 10

# xを表示  ← コードを見れば分かる
print(x)

# 計算  ← 何を計算しているか分からない
result = x * 1.1
```

- 💡 **良いコメントのポイント**:
  - **なぜそうするのか**を書く
  - **何をするのか**はコードから明らかなら書かない
  - 定数の意味や単位を説明する
  - 複雑なロジックの意図を説明する

### エラーメッセージの読み方
エラーメッセージは、問題を解決するための重要な情報源です。

#### Pythonのエラーメッセージ

```python
# エラーの例
x = 10
y = "5"
result = x + y
```

**エラーメッセージ**:
```
Traceback (most recent call last):
  File "sample.py", line 3, in <module>
    result = x + y
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

**読み方**:
1. **最後の行が重要**: `TypeError: unsupported operand type(s) for +: 'int' and 'str'`
   - `TypeError`: 型が合わない
   - `int`（整数）と `str`（文字列）を `+` で足せない
2. **エラーが起きた場所**: `File "sample.py", line 3`
   - ファイル名と行番号が示されている
3. **エラーが起きた行**: `result = x + y`

#### Rのエラーメッセージ

```r
# エラーの例
x <- 10
y <- "5"
result <- x + y
```

**エラーメッセージ**

```
Error in x + y : non-numeric argument to binary operator
```

**読み方**

1. **エラーの種類**: `Error in x + y`
   - `x + y` でエラーが発生
2. **エラーの原因**: `non-numeric argument to binary operator`
   - 二項演算子（`+`）に数値でない引数が渡された

### よくあるエラー10選
初心者がよく遭遇するエラーと、その対処法をまとめます。

#### 1. タイプミス（変数名や関数名の間違い）

**Python**

```python
my_value = 10
print(my_vale)  # 'my_vale' は存在しない
#> NameError: name 'my_vale' is not defined
```

**対処法**: スペルを確認する。コピー＆ペーストを活用する。

#### 2. インデントエラー（Pythonのみ）

**Python**

```python
x = 10
 print(x)  # 余計なスペースがある
#> IndentationError: unexpected indent
```

**対処法**: 行頭のスペースを削除する。

#### 3. 型の不一致

**Python**

```python
x = 10
y = "5"
result = x + y
#> TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

**対処法**: 型を揃える。`int(y)` または `str(x)` で変換する。

#### 4. インデックスエラー

**Python**

```python
my_list = [1, 2, 3]
print(my_list[3])  # インデックスは0-2まで
#> IndexError: list index out of range
```

**対処法**: インデックスの範囲を確認する。Pythonは0から始まることを思い出す。

#### 5. 括弧の不一致

**Python/R共通**

```python
result = (10 + 5 * 2
#> SyntaxError: unexpected EOF while parsing
```

**対処法**: 開き括弧と閉じ括弧の数を確認する。

#### 6. モジュール/パッケージの読み込み忘れ

**Python**

```python
os.getcwd()
#> NameError: name 'os' is not defined
```

**対処法**: `import os` を追加する。

**R**

```r
str_c("a", "b")
#> Error: could not find function "str_c"
```

**対処法**: `library(tidyverse)` を追加する。

#### 7. 引用符の不一致

**Python/R共通**

```python
my_text = 'Hello"
#> SyntaxError: EOL while scanning string literal
```

**対処法**: `'` と `"` を揃える。

#### 8. 代入と比較の混同

**Python**

```python
if x = 10:  # = ではなく == を使う
    print("OK")
#> SyntaxError: invalid syntax
```

**対処法**: 比較は `==` を使う。

#### 9. ファイルが見つからない

**Python/R共通**

```python
data = open('data.txt')
#> FileNotFoundError: [Errno 2] No such file or directory: 'data.txt'
```

**対処法**: 
- ファイル名のスペルを確認
- 作業ディレクトリを確認（`os.getcwd()` / `getwd()`）
- ファイルが実際に存在するか確認（`ls` コマンド）

#### 10. 割り算でゼロ除算

**Python/R共通**

```python
x = 10
y = 0
result = x / y
#> ZeroDivisionError: division by zero (Python)
#> Error in x / y : non-numeric argument to binary operator (R)
```

**対処法**: 分母が0でないことを確認してから計算する。

### print文によるデバッグ

プログラムが期待通りに動かないとき、**print文**を使って変数の値を確認します。

#### デバッグの基本手順

1. **問題の箇所を特定する**
2. **その前後にprint文を追加する**
3. **プログラムを実行して値を確認する**
4. **問題を修正する**
5. **print文を削除するか、コメントアウトする**

#### デバッグの例

**問題のあるプログラム**

```python
# 税込価格の計算（バグあり）
my_price = 1000
my_tax_rate = 10  # 本当は0.10であるべき
my_total = my_price + my_price * my_tax_rate
print(f"税込価格: {my_total}円")
#> 税込価格: 11000円  # おかしい！
```

**デバッグ用のprint文を追加**

```python
# デバッグ版
my_price = 1000
my_tax_rate = 10
print(f"[DEBUG] 価格: {my_price}")
print(f"[DEBUG] 税率: {my_tax_rate}")

my_tax = my_price * my_tax_rate
print(f"[DEBUG] 税額: {my_tax}")

my_total = my_price + my_tax
print(f"[DEBUG] 合計: {my_total}")
print(f"税込価格: {my_total}円")
```

**実行結果**

```
[DEBUG] 価格: 1000
[DEBUG] 税率: 10
[DEBUG] 税額: 10000  ← ここがおかしい！
[DEBUG] 合計: 11000
税込価格: 11000円
```

税率が `10` になっているのが問題だと分かります。`0.10` に修正すれば解決です。

### トラブルシューティングのコツ
#### 1. エラーメッセージをよく読む
エラーメッセージは怖くありません。むしろ、問題解決のヒントです。

#### 2. 一度に少しずつ書く
大きなプログラムを一気に書くのではなく、少しずつ書いて動作確認しましょう。

#### 3. コメントアウトで原因を特定
問題のある部分を `#` でコメントアウトして、一部だけ実行してみましょう。

```python
# 一部をコメントアウトして実行
my_price = 1000
my_tax_rate = 0.10
# my_total = my_price * (1 + my_tax_rate)
# print(my_total)
print("ここまでは動く")
```

#### 4. 検索する
エラーメッセージをそのまま検索すると、同じ問題に遭遇した人の解決策が見つかることがあります。

#### 5. 休憩する
長時間考えても解決しないときは、一度休憩しましょう。新鮮な目で見ると、簡単なミスに気づくことがあります。

## 💡 重要ポイントのまとめ（3.1.6）
この節で学んだこと

- ✅ **良いコメント**: なぜそうするのかを書く  
- ✅ **エラーメッセージの読み方**: 最後の行が重要  
- ✅ **よくあるエラー**: タイプミス、型の不一致、インデックスエラーなど  
- ✅ **print文デバッグ**: 変数の値を確認する  
- ✅ **トラブルシューティング**: 少しずつ書く、検索する、休憩する

### 次のステップ
次の「3.1.7 統合演習」では、これまで学んだことを統合した実践的な課題に挑戦します。

## 3.1.7 統合演習
これまで学んだ内容を統合して、実践的なプログラムを作成しましょう。

### 演習の進め方
1. **課題を読む**: 何を作るのか理解する
2. **計画を立てる**: どの機能を使うか考える
3. **少しずつ書く**: 一度に全部書かず、動作確認しながら進める
4. **テストする**: 様々な入力で動作確認する
5. **解答例を見る**: 自分の解答と比較する

💡 **大切なこと**: 解答例は「正解」ではなく「一例」です。自分なりの解答を作ることが学びになります。

## 課題1: 消費税計算プログラム
### 課題の説明
商品の価格を入力すると、消費税額と税込価格を計算して表示するプログラムを作成してください。

**要件**
- 商品価格を変数に保存する
- 消費税率は10%（0.10）
- 税額と税込価格を計算する
- 結果を分かりやすく表示する

**入力例**

```python
my_price = 1500
```

**期待される出力**

```
商品価格: 1500円
消費税額: 150.0円
税込価格: 1650.0円
```

### 解答例（基本版）
#### Python版
**ファイル名**: `exercise01_tax.py`

```python
# 課題1: 消費税計算プログラム

# 商品価格
my_price = 1500

# 消費税率（10%）
my_tax_rate = 0.10

# 税額を計算
my_tax = my_price * my_tax_rate

# 税込価格を計算
my_total = my_price + my_tax

# 結果を表示
print(f"商品価格: {my_price}円")
print(f"消費税額: {my_tax}円")
print(f"税込価格: {my_total}円")
```

#### R版
**ファイル名**: `exercise01_tax.R`

```r
# 課題1: 消費税計算プログラム

# 商品価格
my_price <- 1500

# 消費税率（10%）
my_tax_rate <- 0.10

# 税額を計算
my_tax <- my_price * my_tax_rate

# 税込価格を計算
my_total <- my_price + my_tax

# 結果を表示
print(paste("商品価格:", my_price, "円"))
print(paste("消費税額:", my_tax, "円"))
print(paste("税込価格:", my_total, "円"))
```

### 解答例（発展版）
#### Python版
**ファイル名**: `exercise01_tax_advanced.py`

```python
# 課題1: 消費税計算プログラム（発展版）

def calculate_tax(price, tax_rate=0.10):
    """
    消費税を計算する
    
    Args:
        price: 商品価格
        tax_rate: 消費税率（デフォルト10%）
    
    Returns:
        (税額, 税込価格) のタプル
    """
    if price < 0:
        print("エラー: 価格は0以上である必要があります")
        return None, None
    
    tax = price * tax_rate
    total = price + tax
    return tax, total

if __name__ == "__main__":
    # テストケース
    test_prices = [1500, 2000, 500, 10000]
    
    print("=== 消費税計算 ===")
    for price in test_prices:
        tax, total = calculate_tax(price)
        if tax is not None:
            print(f"価格: {price}円 → 税額: {tax}円, 税込: {total}円")
```

## 課題2: 自己紹介文生成プログラム
### 課題の説明

名前、年齢、出身地を変数に保存して、自己紹介文を生成するプログラムを作成してください。

- **要件**
  - 名前、年齢、出身地を変数に保存する
  - 文字列フォーマットを使って自己紹介文を作成する
  - 部分文字列を使って、名前の最初の文字を取り出す

- **入力例**

```python
my_name = 'Taro Yamada'
my_age = 20
my_city = 'Tokyo'
```

**期待される出力**

```
=== 自己紹介 ===
名前: Taro Yamada
イニシャル: T
年齢: 20歳
出身: Tokyo
メッセージ: Hello! I'm Taro Yamada from Tokyo. I'm 20 years old.
```

### 解答例（基本版）
#### Python版
**ファイル名**: `exercise02_profile.py`

```python
# 課題2: 自己紹介文生成プログラム

# 個人情報
my_name = 'Taro Yamada'
my_age = 20
my_city = 'Tokyo'

# イニシャル（名前の最初の文字）
my_initial = my_name[0]

# 自己紹介文を作成
my_message = f"Hello! I'm {my_name} from {my_city}. I'm {my_age} years old."

# 結果を表示
print("=== 自己紹介 ===")
print(f"名前: {my_name}")
print(f"イニシャル: {my_initial}")
print(f"年齢: {my_age}歳")
print(f"出身: {my_city}")
print(f"メッセージ: {my_message}")
```

#### R版
**ファイル名**: `exercise02_profile.R`

```r
# 課題2: 自己紹介文生成プログラム

# 個人情報
my_name <- "Taro Yamada"
my_age <- 20
my_city <- "Tokyo"

# イニシャル（名前の最初の文字）
my_initial <- substr(my_name, 1, 1)

# 自己紹介文を作成
my_message <- sprintf("Hello! I'm %s from %s. I'm %d years old.", 
                      my_name, my_city, my_age)

# 結果を表示
print("=== 自己紹介 ===")
print(paste("名前:", my_name))
print(paste("イニシャル:", my_initial))
print(paste("年齢:", my_age, "歳"))
print(paste("出身:", my_city))
print(paste("メッセージ:", my_message))
```

### 解答例（発展版）
#### Python版
**ファイル名**: `exercise02_profile_advanced.py`

```python
# 課題2: 自己紹介文生成プログラム（発展版）

def create_profile(name, age, city):
    """
    自己紹介文を生成する
    
    Args:
        name: 名前
        age: 年齢
        city: 出身地
    
    Returns:
        自己紹介情報の辞書
    """
    # 入力検証
    if not name or not isinstance(name, str):
        return {"error": "名前は空でない文字列である必要があります"}
    
    if age < 0 or not isinstance(age, int):
        return {"error": "年齢は正の整数である必要があります"}
    
    # プロフィール作成
    profile = {
        "name": name,
        "initial": name[0],
        "age": age,
        "city": city,
        "message": f"Hello! I'm {name} from {city}. I'm {age} years old.",
        "name_length": len(name)
    }
    
    return profile

if __name__ == "__main__":
    # テストケース
    people = [
        {"name": "Taro Yamada", "age": 20, "city": "Tokyo"},
        {"name": "Hanako Suzuki", "age": 22, "city": "Osaka"},
        {"name": "Jiro Tanaka", "age": 19, "city": "Kyoto"}
    ]
    
    for person in people:
        profile = create_profile(person["name"], person["age"], person["city"])
        
        if "error" in profile:
            print(f"エラー: {profile['error']}")
        else:
            print(f"\n=== {profile['name']} ===")
            print(f"イニシャル: {profile['initial']}")
            print(f"年齢: {profile['age']}歳")
            print(f"出身: {profile['city']}")
            print(f"名前の長さ: {profile['name_length']}文字")
            print(f"メッセージ: {profile['message']}")
```

---

## 課題3: 会員割引計算プログラム
### 課題の説明
商品価格と会員ステータスに基づいて、割引後の価格を計算するプログラムを作成してください。

**要件**
- 商品価格を変数に保存する
- 会員ステータス（会員/非会員）を論理値で保存する
- 会員なら20%割引、非会員なら割引なし
- 1000円以上なら、さらに100円割引
- 最終価格を表示する

**入力例**
```python
my_price = 1500
my_is_member = True
```

**期待される出力**

```
商品価格: 1500円
会員: はい
会員割引: -300円
大口割引: -100円
最終価格: 1100円
```

### 解答例（基本版）
#### Python版
**ファイル名**: `exercise03_discount.py`

```python
# 課題3: 会員割引計算プログラム

# 商品情報
my_price = 1500
my_is_member = True

# 会員割引（20%）
my_member_discount = my_price * 0.2 if my_is_member else 0

# 割引後の価格
my_price_after_member = my_price - my_member_discount

# 大口割引（1000円以上で100円引き）
my_bulk_discount = 100 if my_price_after_member >= 1000 else 0

# 最終価格
my_final_price = my_price_after_member - my_bulk_discount

# 結果を表示
print(f"商品価格: {my_price}円")
print(f"会員: {'はい' if my_is_member else 'いいえ'}")
print(f"会員割引: -{my_member_discount}円")
print(f"大口割引: -{my_bulk_discount}円")
print(f"最終価格: {my_final_price}円")
```

#### R版
**ファイル名**: `exercise03_discount.R`

```r
# 課題3: 会員割引計算プログラム

# 商品情報
my_price <- 1500
my_is_member <- TRUE

# 会員割引（20%）
my_member_discount <- ifelse(my_is_member, my_price * 0.2, 0)

# 割引後の価格
my_price_after_member <- my_price - my_member_discount

# 大口割引（1000円以上で100円引き）
my_bulk_discount <- ifelse(my_price_after_member >= 1000, 100, 0)

# 最終価格
my_final_price <- my_price_after_member - my_bulk_discount

# 結果を表示
print(paste("商品価格:", my_price, "円"))
print(paste("会員:", ifelse(my_is_member, "はい", "いいえ")))
print(paste("会員割引: -", my_member_discount, "円"))
print(paste("大口割引: -", my_bulk_discount, "円"))
print(paste("最終価格:", my_final_price, "円"))
```

### 解答例（発展版）
#### Python版
**ファイル名**: `exercise03_discount_advanced.py`

```python
# 課題3: 会員割引計算プログラム（発展版）

def calculate_discount(price, is_member, member_rate=0.2, bulk_threshold=1000, bulk_discount=100):
    """
    割引を計算する
    
    Args:
        price: 商品価格
        is_member: 会員かどうか
        member_rate: 会員割引率（デフォルト20%）
        bulk_threshold: 大口割引の閾値（デフォルト1000円）
        bulk_discount: 大口割引額（デフォルト100円）
    
    Returns:
        割引情報の辞書
    """
    if price < 0:
        return {"error": "価格は0以上である必要があります"}
    
    # 会員割引
    member_discount = price * member_rate if is_member else 0
    price_after_member = price - member_discount
    
    # 大口割引
    bulk_discount_amount = bulk_discount if price_after_member >= bulk_threshold else 0
    final_price = price_after_member - bulk_discount_amount
    
    return {
        "original_price": price,
        "is_member": is_member,
        "member_discount": member_discount,
        "bulk_discount": bulk_discount_amount,
        "final_price": final_price,
        "total_discount": member_discount + bulk_discount_amount,
        "discount_rate": ((member_discount + bulk_discount_amount) / price * 100) if price > 0 else 0
    }

if __name__ == "__main__":
    # テストケース
    test_cases = [
        {"price": 1500, "is_member": True},
        {"price": 1500, "is_member": False},
        {"price": 800, "is_member": True},
        {"price": 800, "is_member": False},
    ]
    
    for i, case in enumerate(test_cases, 1):
        print(f"\n=== ケース{i} ===")
        result = calculate_discount(case["price"], case["is_member"])
        
        if "error" in result:
            print(f"エラー: {result['error']}")
        else:
            print(f"商品価格: {result['original_price']}円")
            print(f"会員: {'はい' if result['is_member'] else 'いいえ'}")
            print(f"会員割引: -{result['member_discount']}円")
            print(f"大口割引: -{result['bulk_discount']}円")
            print(f"合計割引: -{result['total_discount']}円 ({result['discount_rate']:.1f}%)")
            print(f"最終価格: {result['final_price']}円")
```

## 🎯 挑戦課題
余裕がある方は、以下の課題にも挑戦してみましょう：

### 挑戦課題1: BMI計算プログラム
身長（cm）と体重（kg）から、BMI（Body Mass Index）を計算するプログラムを作成してください。

- **ヒント**
  - BMI = 体重(kg) ÷ (身長(m) × 身長(m))
  - 身長をcmからmに変換する必要があります
  - BMI値に応じて「低体重」「普通体重」「肥満」を判定してみましょう

### 挑戦課題2: 文字列分析プログラム
任意の文章を入力して、その文章の統計情報を表示するプログラムを作成してください。

- **表示する情報**
  - 文字数
  - 単語数（スペースで区切られた数）
  - 特定の文字が何回出現するか
  - 最初の10文字
  - 最後の10文字

### 挑戦課題3: Python と R の連携
同じデータに対して、Pythonで計算し、その結果をファイルに保存。そのファイルをRで読み込んで処理するプログラムを作成してください。

- **ヒント**
  - Pythonで計算結果をテキストファイルに保存
  - Rでそのファイルを読み込んで追加の処理

## 💡 重要ポイントのまとめ（3.1.7）
この節で学んだこと

- ✅ **統合的な思考**: 複数の機能を組み合わせてプログラムを作る  
- ✅ **実践的な課題**: 消費税計算、自己紹介文、割引計算  
- ✅ **段階的な開発**: 基本版から発展版へ  
- ✅ **テストの重要性**: 様々な入力で動作確認  
- ✅ **コードの改善**: より良い書き方を学ぶ

### 次のステップ
次の「3.1.8 学習の確認」で、この節で学んだことを総まとめします。

## 3.1.8 学習の確認
この節（3.1 入門）で学んだことを確認しましょう。以下のチェックリストを使って、自分の理解度を確認してください。

### 📋 自己チェックリスト
各項目について、できるようになったらチェック☑️を入れてください。

## A. 環境構築と基本操作
### 環境の準備と操作
- [ ] WSL2のUbuntu環境を起動できる
- [ ] VS Codeで統合ターミナルを開くことができる
- [ ] `venvc` コマンドで仮想環境を起動できる
- [ ] プロンプトに `(class)` が表示されることを確認できる
- [ ] `/home/datasci/work` ディレクトリに移動できる
- [ ] `pwd` コマンドで現在のディレクトリを確認できる

### ファイル操作
- [ ] `touch` コマンドで新しいファイルを作成できる
- [ ] VS Codeでファイルを開いて編集できる
- [ ] Pythonファイル（.py）を作成できる
- [ ] Rファイル（.R）を作成できる
- [ ] `python ファイル名.py` でPythonプログラムを実行できる
- [ ] `Rscript ファイル名.R` でRプログラムを実行できる

## B. プログラミング基礎スキル
### 数値と演算（3.1.1）
- [ ] 四則演算（+, -, *, /）が使える
- [ ] 商と余りの計算ができる（R: `%/%`, `%%` / Python: `//`, `%`）
- [ ] 16進数表記（0x10）を理解している
- [ ] 指数表記（1.23e5）を理解している
- [ ] 括弧を使って計算の優先順位を制御できる
- [ ] コメント（#）を適切に書くことができる

### 変数とデータ管理（3.1.2）
- [ ] 変数に値を代入できる（R: `<-` / Python: `=`）
- [ ] 変数を使って計算ができる
- [ ] `print()` 関数で結果を表示できる
- [ ] わかりやすい変数名を付けることができる
- [ ] `my_` プレフィックスの命名規則を理解している
- [ ] 複数の変数に同時に値を代入できる
- [ ] 予約語を変数名に使わないように注意できる

### 文字列操作（3.1.3）
- [ ] 文字列を作成できる（R: `"..."` / Python: `'...'`）
- [ ] 文字列の長さを取得できる（R: `nchar()` / Python: `len()`）
- [ ] 文字列を連結できる（R: `str_c()` / Python: `+`）
- [ ] 部分文字列を取得できる（R: `substr()` / Python: `[start:end]`）
- [ ] RとPythonのインデックスの違い（1始まり vs 0始まり）を理解している
- [ ] 文字列フォーマットを使える（R: `sprintf()` / Python: `format()`, f-string）
- [ ] Pythonのf-stringを使うことができる

### 論理値と条件判断（3.1.4）
- [ ] 真偽値を理解している（R: `TRUE/FALSE` / Python: `True/False`）
- [ ] 比較演算子（==, !=, <, >, <=, >=）を使える
- [ ] 浮動小数点数の比較問題を理解している
- [ ] 浮動小数点数を正しく比較できる（R: `all.equal()` / Python: `math.isclose()`）
- [ ] 論理演算（AND, OR, NOT）を使える
- [ ] RとPythonの論理演算子の違いを理解している
- [ ] 条件演算子を使える（R: `ifelse()` / Python: `値 if 条件 else 値`）
- [ ] 複数の条件を組み合わせることができる

### 作業ディレクトリ（3.1.5）
- [ ] 作業ディレクトリの概念を理解している
- [ ] 作業ディレクトリを確認できる（R: `getwd()` / Python: `os.getcwd()`）
- [ ] 作業ディレクトリを変更できる（R: `setwd()` / Python: `os.chdir()`）
- [ ] 相対パスと絶対パスの違いを理解している
- [ ] `.` と `..` の意味を理解している
- [ ] UNIXコマンド（pwd, cd, ls）との対応関係を理解している
- [ ] ファイル一覧を取得できる（R: `list.files()` / Python: `os.listdir()`）

## C. デバッグとエラー対処（3.1.6）
### エラーへの対処
- [ ] エラーメッセージを落ち着いて読むことができる
- [ ] エラーメッセージから問題の箇所を特定できる
- [ ] Pythonのエラーメッセージの構造を理解している
- [ ] Rのエラーメッセージの読み方を理解している

### よくあるエラー
- [ ] タイプミスによるエラーに対処できる
- [ ] インデントエラー（Python）に対処できる
- [ ] 型の不一致エラーに対処できる
- [ ] インデックスエラーに対処できる
- [ ] 括弧の不一致エラーに対処できる
- [ ] モジュール/パッケージの読み込み忘れに気づける
- [ ] 引用符の不一致エラーに対処できる
- [ ] 代入（=）と比較（==）を正しく使い分けられる
- [ ] ファイルが見つからないエラーに対処できる
- [ ] ゼロ除算エラーを避けることができる

### デバッグ技術
- [ ] print文を使って変数の値を確認できる
- [ ] デバッグ用のprint文を適切な場所に配置できる
- [ ] 問題を特定したら、デバッグ用のコードを削除できる
- [ ] コメントアウトを使って原因を特定できる
- [ ] 少しずつコードを書いて動作確認できる

## D. 統合演習の完遂（3.1.7）
### 課題の完了
- [ ] 課題1（消費税計算）を完了した
- [ ] 課題2（自己紹介文生成）を完了した
- [ ] 課題3（会員割引計算）を完了した
- [ ] 作成したプログラムが正常に実行されることを確認した
- [ ] Python版とR版の両方を作成した（または片方を完成させた）

### プログラムの品質
- [ ] 適切な変数名を使っている
- [ ] コメントで処理の内容を説明している
- [ ] 計算の流れが論理的に正しい
- [ ] 結果が分かりやすく表示されている
- [ ] 様々な入力値でテストした

## E. 概念の理解
### RとPythonの違い
- [ ] 代入演算子の違い（`<-` vs `=`）を理解している
- [ ] 真偽値の表記の違いを理解している
- [ ] 論理演算子の違いを理解している
- [ ] インデックスの数え方の違いを理解している
- [ ] 両言語の強みと使い分けを理解している

### データサイエンスの視点
- [ ] データサイエンスにおけるプログラミングの重要性を理解している
- [ ] RとPythonが広く使われている理由を理解している
- [ ] プログラミングとUNIXコマンドの関係を理解している
- [ ] パッケージ/モジュールの役割を理解している

### 今後の学習への準備
- [ ] 3.2節「関数」で何を学ぶか理解している
- [ ] 関数化することのメリットを理解している
- [ ] より複雑なプログラムを書く準備ができている
- [ ] 自分で問題を解決する姿勢が身についている

## 📊 達成度の評価
チェックした項目の数を数えて、達成度を確認しましょう。

| チェック数 | 達成度 | コメント |
|:---:|:---:|:---|
| 80-85 | 🌟🌟🌟 優秀！ | 完璧です！次の節に進みましょう |
| 65-79 | 🌟🌟 良好 | よく理解しています。不安な部分を復習しましょう |
| 50-64 | 🌟 合格 | 基本は理解しています。練習を重ねましょう |
| 49以下 | 📚 要復習 | もう一度この節を復習しましょう |

### チェックが付かなかった項目への対処
チェックが付かなかった項目は、以下の方法で復習しましょう。

1. **該当セクションを読み直す**: 説明を再度確認する
2. **サンプルプログラムを実行する**: 実際に動かして理解する
3. **サンプルを改変してみる**: 値を変えて実験する
4. **自分で小さなプログラムを書く**: 練習で身につける
5. **質問する**: わからないことは教員や仲間に聞く

## 🎓 次のステップ
3.1節「入門」の学習、お疲れさまでした！

### 学んだことの振り返り
この節では、以下のことを学びました。

1. **環境構築**: WSL2, VS Code, venvcの使い方
2. **基本演算**: 数値計算、文字列操作
3. **変数**: データの保存と再利用
4. **論理値**: 条件判断
5. **ファイルシステム**: 作業ディレクトリ
6. **デバッグ**: エラーへの対処
7. **実践**: 統合演習

### 次に学ぶこと（3.2節「関数」）
次の3.2節では、**関数**について学びます。関数利用には以下の利点があります。

- コードを再利用できる
- プログラムの構造が明確になる
- デバッグが容易になる
- チーム開発がしやすくなる

### 継続的な学習のために
プログラミングは、**実際に書くこと**で上達します。

- 毎日少しずつでもコードを書く
- 小さなプログラムから始める
- エラーを恐れない
- 他人のコードを読む
- 質問と議論を大切にする

### 最後に
プログラミングは、**考える力**と**問題を解決する力**を養います。最初は難しく感じるかもしれませんが、諦めずに続ければ、必ずできるようになります。

**頑張ってください！** 🚀