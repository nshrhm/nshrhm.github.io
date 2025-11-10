# 3.2 関数
- **本節の目標**
- **関数**（一つ以上の処理をひとかたまりにするしくみ）の使い方と作り方を学びます。

## 3.2.0 この節について
### 🎯 この節で学ぶこと
プログラミングにおいて、**関数**は最も重要な概念の一つです。関数とは、**特定の処理をひとまとまりにして、名前を付けたもの**です。この節では、以下の内容を学習します。

1. **関数の利用**: すでに用意されている関数を使う方法
2. **関数の定義**: 自分で新しい関数を作る方法
3. **実践**: データサイエンスで役立つ関数の作成

### 💡 なぜ関数を学ぶのか？
関数を使うことで、プログラミングが格段に効率的になります。

#### 利点1: コードの再利用
同じ処理を何度も書く必要がなくなります。

```python
# 関数を使わない場合 - 同じ計算を3回書く必要がある
tax1 = 1000 * 0.10
total1 = 1000 + tax1
print(f"商品A: {total1}円")

tax2 = 2000 * 0.10
total2 = 2000 + tax2
print(f"商品B: {total2}円")

tax3 = 1500 * 0.10
total3 = 1500 + tax3
print(f"商品C: {total3}円")
```

```python
# 関数を使う場合 - 処理を1回定義するだけ
def calculate_total(price):
    tax = price * 0.10
    return price + tax

print(f"商品A: {calculate_total(1000)}円")
print(f"商品B: {calculate_total(2000)}円")
print(f"商品C: {calculate_total(1500)}円")
```

#### 利点2: プログラムの見通しが良くなる
処理に名前が付くことで、何をしているのかが分かりやすくなります。

```python
# 関数名で処理の内容が分かる
temperature_f = celsius_to_fahrenheit(25)
bmi = calculate_bmi(height=170, weight=65)
average = calculate_average(scores)
```

#### 利点3: 修正が簡単
処理を変更したいときは、関数の定義を1箇所変更するだけで済みます。

### 🔍 関数の基本構造
関数は次のような構造を持っています。

```
関数名(引数1, 引数2, ...) → 戻り値
```

- **関数名**: 処理に付けられた名前（例: `sqrt`, `log`, `calculate_total`）
- **引数**: 関数に渡すデータ（例: 計算したい数値）
- **戻り値**: 関数が返す結果（例: 計算結果）

### 📚 関数の種類
この節では、2種類の関数を扱います。

#### 1. 組み込み関数・ライブラリ関数
すでに用意されている関数です。すぐに使えます。

```python
# Pythonの数学関数
import math
result = math.sqrt(16)  # 平方根を求める
```

```r
# Rの数学関数
result <- sqrt(16)  # 平方根を求める
```

#### 2. ユーザー定義関数
自分で作る関数です。自分の目的に合わせた処理を作れます。

```python
# Pythonで関数を定義
def greet(name):
    return f"こんにちは、{name}さん！"

message = greet("太郎")
print(message)
```

```r
# Rで関数を定義
greet <- function(name) {
    paste0("こんにちは、", name, "さん！")
}

message <- greet("太郎")
print(message)
```

### 🔄 RとPythonの違い

この節では、RとPythonの両方で関数を学びます。基本的な考え方は同じですが、いくつか違いがあります。

| 項目 | Python | R |
|------|--------|---|
| 関数定義 | `def 関数名(引数):` | `関数名 <- function(引数) {` |
| 戻り値 | `return` が必須 | 最後の値が自動的に返る |
| インデント | 必須（構造を表す） | 任意（波括弧で構造を表す） |
| 引数の指定 | 位置のみ引数と名前付き引数 | 柔軟な名前付き引数 |
| パイプ演算子 | なし（標準では） | `%>%` が使える |

これらの違いは、実際にコードを書きながら理解していきましょう。

### 🤖 GitHub Copilot活用の準備確認
この節では、GitHub Copilotを積極的に活用していきます。始める前に、以下を確認してください。

#### ✅ 確認事項

1. **VS Codeが起動している**
   - WSL2 (Ubuntu)に接続していますか？
   - ターミナルのプロンプトに `(class)` と表示されていますか？

2. **GitHub Copilotが有効になっている**
   - VS Codeの右下に Copilotアイコン（✓マーク）が表示されていますか？
   - アイコンをクリックして、Copilotが有効か確認してください

3. **作業ディレクトリの確認**
   ```bash
   cd /home/datasci/work
   pwd  # 現在のディレクトリを確認
   ```

4. **仮想環境の確認**
   ```bash
   # プロンプトに (class) が表示されているか確認
   # 表示されていない場合は
   venvc
   ```

#### 💬 Copilot Chatの使い方

1. **Copilot Chatを開く**: `Ctrl + Shift + I` または VS Code左側のチャットアイコン
2. **モデルの選択**: Claude Sonnetなど、モデルが選択されていることを確認
3. **質問する**: 分からないことは遠慮なく聞いてください

#### 🎯 この節でのCopilot活用方針

- **理解してから使う**: まず教材で概念を学び、次にCopilotで実践
- **実験する**: Copilotが生成したコードを変更して試してみる
- **質問する**: 生成されたコードで分からない部分は質問する
- **自分で考える**: すぐに頼らず、まず自分で試してみる

### 📖 本節の構成
この節は以下の流れで進みます。

1. **3.2.1 関数の利用** - すでにある関数を使う方法を学びます
   - 基本的な関数呼び出し
   - 引数の指定方法
   - デフォルト引数
   - パイプ演算子（R）

2. **3.2.2 関数の定義** - 自分で関数を作る方法を学びます
   - 基本的な関数定義
   - デフォルト引数を持つ関数
   - 無名関数（lambda式）

3. **3.2.3 統合演習** - 実践的な関数を作成します
   - 温度変換関数
   - 統計計算関数

4. **3.2.4 まとめ** - 学習内容の振り返りとチェックリスト

### 🚀 学習の進め方

1. **読む**: 各セクションの説明を読んで理解する
2. **実行する**: サンプルプログラムを実際に動かしてみる
3. **変更する**: サンプルを少し変えて実験してみる
4. **試す**: Copilot活用ガイドのプロンプトを試す
5. **演習する**: 練習問題に取り組む

### ⚠️ よくある質問

- **Q: 関数とメソッドは違うのですか？**
- A: 厳密には違いますが、この講義では区別せずに「関数」と呼びます。どちらも「処理のまとまり」という点では同じです。

- **Q: 数学の関数との違いは？**
- A: 数学の関数は「xが決まれば値が決まる」ものですが、プログラミングの関数は「処理の手順」です。必ずしも同じ結果を返すとは限らず、値を返さない関数もあります。

- **Q: 関数名の付け方にルールはありますか？**
- A: はい。分かりやすい名前を付けることが大切です。`calculate_tax`, `convert_temperature`のように、何をする関数なのかが分かる名前にしましょう。

それでは、まず既存の関数を使う方法から学んでいきましょう！

## 3.2.1 関数の利用
関数を自分で作る前に、まずはすでに用意されている関数の使い方を学びます。関数の基本的な使い方を理解することで、後で自分で関数を作るときにも役立ちます。

### 3.2.1.1 基本的な関数呼び出し
関数は次の形式で呼び出します。

```
関数名(引数1, 引数2, ...)
```

最も基本的な例として、**平方根**（ある数を2乗すると元の数になる値）を求める関数を使ってみましょう。4の平方根は2です（2×2=4だから）。

#### 💻 サンプル01: 平方根の計算

- **ファイル名**: `my3-2-01_sqrt.py` / `my3-2-01_sqrt.R`

- **Python版**

```python
# my3-2-01_sqrt.py
# 平方根を計算するサンプル

# mathモジュールをインポート（数学関数を使うため）
import math

# 4の平方根を計算
result = math.sqrt(4)

# 結果を表示
print(f"4の平方根: {result}")
```

- **実行方法**

```bash
$ python my3-2-01_sqrt.py
```

**期待される出力**

```
4の平方根: 2.0
```

**R版**

```r
# my3-2-01_sqrt.R
# 平方根を計算するサンプル

# 4の平方根を計算
result <- sqrt(4)

# 結果を表示
print(paste0("4の平方根: ", result))
```

**実行方法**

```bash
$ Rscript my3-2-01_sqrt.R
```

**期待される出力**

```
[1] "4の平方根: 2"
```

#### 📝 解説

**Python版のポイント**
- `import math`: Pythonでは、数学関数を使うために`math`モジュールをインポートする必要があります
- `math.sqrt(4)`: `math.`を付けて関数を呼び出します
- `4`が**引数**（関数に渡すデータ）です
- `result`に計算結果（**戻り値**）が入ります

**R版のポイント**
- `sqrt(4)`: Rでは、`sqrt`関数がすぐに使えます（インポート不要）
- `4`が**引数**です
- `result`に計算結果が入ります

#### 🔍 他の計算方法
実は、平方根は「0.5乗」でも求められます。

```python
# Python
result = 4 ** 0.5  # ** はべき乗演算子
print(result)  # 2.0
```

```r
# R
result <- 4 ^ 0.5  # ^ はべき乗演算子
# または
result <- 4 ** 0.5  # ** も使える
print(result)  # 2
```

どちらの方法でも結果は同じですが、**関数を使う方が意味が分かりやすい**ですね。

### 3.2.1.2 引数の指定方法
多くの関数は、複数の引数を受け取ります。例として、**対数**（ある数を何乗すると別の数になるか）を計算してみましょう。

#### 💻 サンプル02: 対数の計算（複数引数）

log₁₀(100) = 2 を計算します。これは「10を何乗すると100になるか？」という問いで、答えは2です（10² = 100）。

- **ファイル名**: `my3-2-02_log_basic.py` / `my3-2-02_log_basic.R`
- **Python版**:

```python
# my3-2-02_log_basic.py
# 対数を計算するサンプル（複数引数）

import math

# log₁₀(100) を計算
# 10を何乗すると100になるか？
result = math.log(100, 10)

# 結果を表示
print(f"10を何乗すると100になるか: {result}")
print(f"検証: 10の{result}乗 = {10 ** result}")
```

**実行方法**

```bash
$ python my3-2-02_log_basic.py
```

**期待される出力**

```
10を何乗すると100になるか: 2.0
検証: 10の2.0乗 = 100.0
```

**R版**

```r
# my3-2-02_log_basic.R
# 対数を計算するサンプル（複数引数）

# log₁₀(100) を計算
# 10を何乗すると100になるか?
result <- log(100, 10)

# 結果を表示
print(paste0("10を何乗すると100になるか: ", result))
print(paste0("検証: 10の", result, "乗 = ", 10^result))
```

**実行方法**

```bash
$ Rscript my3-2-02_log_basic.R
```

**期待される出力**

```
[1] "10を何乗すると100になるか: 2"
[1] "検証: 10の2乗 = 100"
```

#### 📝 解説

**引数の順序**:
- **第1引数**: `100` - 対数を取りたい数
- **第2引数**: `10` - 底（base）

関数は、**引数の順序**を守る必要があります。`math.log(10, 100)`とすると、log₁₀₀(10)を計算してしまいます。

#### 🔍 RとPythonの引数指定の違い
**R版**では、引数に名前を付けて指定することもできます。

```r
# 以下はすべて同じ結果
log(100, 10)              # 順序で指定
log(x = 100, base = 10)   # 名前付きで指定
log(base = 10, x = 100)   # 順序を変えても名前があればOK
```

名前を付けると、**順序を気にしなくてよい**ので便利です。

**Python版**では、`math.log`の引数は「位置のみ引数」という特殊な引数なので、名前付き指定はできません。

```python
# Python
math.log(100, 10)        # OK
math.log(x=100, base=10) # エラー！
```

### 3.2.1.3 デフォルト引数の理解
多くの関数には**デフォルト引数**があります。これは、引数を省略したときに自動的に使われる値です。

#### 💻 サンプル03: デフォルト引数の利用
`log`関数の第2引数を省略すると、**自然対数**（底がネイピア数eの対数）が計算されます。

**ファイル名**: `my3-2-03_log_default.py` / `my3-2-03_log_default.R`

**Python版**

```python
# my3-2-03_log_default.py
# デフォルト引数を利用するサンプル

import math

# 第2引数を省略 - 自然対数が計算される
result_default = math.log(100)

# 第2引数を明示的に指定 - 同じ結果
result_explicit = math.log(100, math.e)

# 結果を表示
print(f"省略した場合: {result_default}")
print(f"明示した場合: {result_explicit}")
print(f"ネイピア数e: {math.e}")
```

**実行方法**

```bash
$ python my3-2-03_log_default.py
```

**期待される出力**

```
省略した場合: 4.605170185988092
明示した場合: 4.605170185988092
ネイピア数e: 2.718281828459045
```

**R版**

```r
# my3-2-03_log_default.R
# デフォルト引数を利用するサンプル

# 第2引数を省略 - 自然対数が計算される
result_default <- log(100)

# 第2引数を明示的に指定 - 同じ結果
result_explicit <- log(100, exp(1))

# 結果を表示
print(paste0("省略した場合: ", result_default))
print(paste0("明示した場合: ", result_explicit))
print(paste0("ネイピア数e: ", exp(1)))
```

**実行方法**

```bash
$ Rscript my3-2-03_log_default.R
```

**期待される出力**

```
[1] "省略した場合: 4.60517018598809"
[1] "明示した場合: 4.60517018598809"
[1] "ネイピア数e: 2.71828182845905"
```

#### 📝 解説

**デフォルト引数の仕組み**
- `log`関数は内部で「第2引数のデフォルト値はe」と定義されています
- 省略すると、自動的にeが使われます
- 明示的に指定しても、省略しても結果は同じです

#### 💻 サンプル04: 対数の専用関数

よく使う底の対数には、専用の関数が用意されています。

**ファイル名**: `my3-2-04_log_variants.py` / `my3-2-04_log_variants.R`

**Python版**

```python
# my3-2-04_log_variants.py
# 対数の専用関数を使うサンプル

import math

# 常用対数（底が10）
log10_result = math.log10(100)

# 底が2の対数
log2_result = math.log2(1024)

# 結果を表示
print(f"log₁₀(100) = {log10_result}")
print(f"log₂(1024) = {log2_result}")
print()
print(f"検証: 10の{log10_result}乗 = {10 ** log10_result}")
print(f"検証: 2の{log2_result}乗 = {2 ** int(log2_result)}")
```

**実行方法**:
```bash
$ python my3-2-04_log_variants.py
```

**期待される出力**:
```
log₁₀(100) = 2.0
log₂(1024) = 10.0

検証: 10の2.0乗 = 100.0
検証: 2の10乗 = 1024
```

**R版**

```r
# my3-2-04_log_variants.R
# 対数の専用関数を使うサンプル

# 常用対数（底が10）
log10_result <- log10(100)

# 底が2の対数
log2_result <- log2(1024)

# 結果を表示
print(paste0("log₁₀(100) = ", log10_result))
print(paste0("log₂(1024) = ", log2_result))
print("")
print(paste0("検証: 10の", log10_result, "乗 = ", 10^log10_result))
print(paste0("検証: 2の", log2_result, "乗 = ", 2^log2_result))
```

**実行方法**

```bash
$ Rscript my3-2-04_log_variants.R
```

**期待される出力**

```
[1] "log₁₀(100) = 2"
[1] "log₂(1024) = 10"
[1] ""
[1] "検証: 10の2乗 = 100"
[1] "検証: 2の10乗 = 1024"
```

#### 📝 解説

**専用関数を使う理由**
- `log10(100)`の方が`log(100, 10)`より意味が明確
- 入力が少なくて済む
- 計算精度が高い場合がある

**覚えておくべき関数**
- `log()`: 自然対数（底がe）
- `log10()`: 常用対数（底が10）
- `log2()`: 底が2の対数（コンピュータサイエンスでよく使う）

### 3.2.1.4 パイプ演算子（R固有）

Rには、**パイプ演算子**（`%>%`）という便利な機能があります。これを使うと、処理の流れが読みやすくなります。

> **注意**: パイプ演算子はR固有の機能です。Python（標準）にはありません。

#### 🔍 パイプとは？

パイプ演算子 `%>%` は、「左側の値を、右側の関数の第1引数として渡す」という働きをします。

```r
# 通常の書き方
sqrt(4)

# パイプを使った書き方
4 %>% sqrt
```

どちらも同じ結果 2 になります。

#### 💻 サンプル05: パイプの基本

**ファイル名**: `my3-2-05_pipe.R`

**R版**

```r
# my3-2-05_pipe.R
# パイプ演算子の基本的な使い方

# tidyverseパッケージを読み込む（パイプを使うため）
library(tidyverse)

# 通常の書き方
result_normal <- sqrt(16)
print(paste0("通常の書き方: ", result_normal))

# パイプを使った書き方
result_pipe <- 16 %>% sqrt()
print(paste0("パイプを使った書き方: ", result_pipe))

# 括弧を省略することもできる
result_pipe2 <- 16 %>% sqrt
print(paste0("括弧を省略: ", result_pipe2))
```

**実行方法**

```bash
$ Rscript my3-2-05_pipe.R
```

**期待される出力**

```
[1] "通常の書き方: 4"
[1] "パイプを使った書き方: 4"
[1] "括弧を省略: 4"
```

#### 📝 解説

**パイプの動作**
- `16 %>% sqrt` は `sqrt(16)` と同じ
- 左側の値（16）が、右側の関数（sqrt）の第1引数になる

**library(tidyverse)が必要な理由**
- `%>%` はtidyverseパッケージに含まれているため
- tidyverseを読み込まないと使えません

> **補足**: R 4.1.0以降では、Rの標準パイプ `|>` も使えます。使い方はほぼ同じです。

#### 💻 サンプル06: パイプの連鎖

パイプの真価は、**複数の処理を繋げるとき**に発揮されます。

**ファイル名**: `my3-2-06_pipe_chain.R`

**R版**

```r
# my3-2-06_pipe_chain.R
# パイプで複数の処理を繋げるサンプル

library(tidyverse)

# 例: 5の自然対数を取ってから、expで元に戻す
# log(exp(x)) = x なので、結果は5になるはず

# 通常の書き方 - 内側から外側に向かって読む
result_normal <- exp(log(5))
print(paste0("通常の書き方: ", result_normal))

# パイプを使った書き方 - 左から右に向かって読める
result_pipe <- 5 %>% 
  log() %>%      # まず自然対数を取る
  exp()          # 次にexpを適用
print(paste0("パイプを使った書き方: ", result_pipe))

# もう少し複雑な例
# 100の平方根を取って、それを2乗する
result_complex <- 100 %>%
  sqrt() %>%     # 平方根: 10
  `^`(2)         # 2乗: 100
print(paste0("複雑な例: ", result_complex))
```

**実行方法**

```bash
$ Rscript my3-2-06_pipe_chain.R
```

**期待される出力**

```
[1] "通常の書き方: 5"
[1] "パイプを使った書き方: 5"
[1] "複雑な例: 100"
```

#### 📝 解説

**パイプの利点**

1. **処理の流れが分かりやすい**
   ```r
   # 通常: 内側から外側へ読む（読みにくい）
   exp(log(sqrt(100)))
   
   # パイプ: 左から右へ読む（読みやすい）
   100 %>% sqrt() %>% log() %>% exp()
   ```

2. **段階的に確認できる**
   ```r
   # 途中結果を確認しながら進められる
   100 %>% sqrt()           # まず平方根を確認
   100 %>% sqrt() %>% log() # 次に対数を確認
   # ... というように段階的に書ける
   ```

3. **変更が簡単**
   処理を追加・削除するときに、パイプで繋ぐだけ

**いつパイプを使うべきか**
- ✅ 複数の処理を順番に適用するとき
- ✅ データ処理のパイプライン（後の章で詳しく学びます）
- ❌ 単純な1つの処理だけのとき（かえって分かりにくくなる）

#### ⚠️ 注意点

**Pythonでパイプを使いたい場合**
標準のPythonにはパイプ演算子がありませんが、いくつかの方法があります。
- pandasライブラリの「メソッドチェーン」（後の章で学びます）
- サードパーティライブラリ（例: `pipe`ライブラリ）

**Rでパイプを使わない方が良い場合**
- 処理が1つだけのとき: `4 %>% sqrt` より `sqrt(4)` の方がシンプル
- 複雑な引数を渡すとき: パイプより通常の書き方の方が分かりやすいことも

## 💡 GitHub Copilot活用ガイド（3.2.1 関数の利用）
### このセクションで学んだことをCopilotで実践
関数の基本的な使い方を学びました。ここからは、GitHub Copilotを使って、さらに理解を深めていきましょう。Copilotは、あなたが書いたコメントやコードから、適切な関数の使い方を提案してくれます。

関数を使う場面は非常に多いので、Copilotを活用することで、効率的にプログラミングできるようになります。また、「こういう処理をしたいけど、どんな関数を使えばいいか分からない」というときにも、Copilotが助けてくれます。

### 🚀 使えるプロンプト例
#### プロンプト例1: 数学関数の探索 [★☆☆]

**Copilot Chatに入力**

```
Pythonで円周率πの値を取得して表示するプログラムを書いてください。
初心者向けに、コメントを詳しく付けてください。
```

**期待される動作**
- `math.pi`を使ったコードが生成される
- 円周率の値が表示されるプログラムができる
- 丁寧なコメントが付く

**やってみよう**
1. VS CodeでCopilot Chatを開く（`Ctrl + Shift + I`）
2. 上記のプロンプトを入力
3. 生成されたコードを`test_pi.py`として保存
4. 実行して、円周率が表示されることを確認
5. **応用**: 円周率を使って、半径5の円の面積を計算してみましょう（面積 = π × r²）

#### プロンプト例2: 関数の引数を理解する [★☆☆]

**Copilot Chatに入力**:
```
Pythonのmath.pow関数の使い方を、具体例とともに教えてください。
2の10乗を計算する例を含めてください。
```

**期待される動作**
- `math.pow()`の説明が得られる
- 具体的な使用例が提示される
- `**`演算子との違いも説明されるかもしれない

**やってみよう**
1. Copilot Chatで質問する
2. 回答を読んで、`math.pow(2, 10)`と`2 ** 10`の違いを理解する
3. 実際にコードを書いて実行してみる
4. **応用**: Rの`^`演算子と比較してみましょう

#### プロンプト例3: 実用的な計算プログラム [★★☆]

**Copilot Chatに入力**

```
Pythonで、複利計算をするプログラムを書いてください。
- 元金: 100万円
- 年利: 3%
- 期間: 10年
最終的な金額を計算して表示してください。
式: 最終金額 = 元金 × (1 + 利率)^年数
```

**期待される動作**
- 複利計算の式が実装される
- `math.pow()`または`**`演算子が使われる
- 結果が分かりやすく表示される

**やってみよう**
1. プロンプトをCopilot Chatに入力
2. 生成されたコードを`compound_interest.py`として保存
3. 実行して結果を確認
4. 元金、年利、期間を変更して実験してみる
5. **応用**: R版も作成してみましょう

#### プロンプト例4: Rのパイプを使った処理 [★★☆]

**Copilot Chatに入力**

```
Rで、tidyverseのパイプ演算子を使って、次の計算をしてください:
1. 100から始める
2. 平方根を取る
3. 結果を2倍する
4. 結果を表示する
コメントを付けて、各ステップが分かるようにしてください。
```

**期待される動作**
- `library(tidyverse)`が含まれる
- パイプ演算子 `%>%` を使ったコードが生成される
- 各ステップにコメントが付く

**やってみよう**
1. プロンプトをCopilot Chatに入力
2. 生成されたコードを`test_pipe.R`として保存
3. 実行して結果を確認（結果は20になるはず）
4. パイプの各ステップで結果を確認してみる
5. **応用**: 別の計算（例: 対数→exp→平方根）でもパイプを使ってみましょう

#### プロンプト例5: 関数のドキュメントを読む [★★★]

**Copilot Chatに入力**

```
Pythonのmath.ceil関数とmath.floor関数の違いを、
具体例を3つずつ使って説明してください。
正の数、負の数、小数の例を含めてください。
```

**期待される動作**
- `ceil`（切り上げ）と`floor`（切り捨て）の違いが説明される
- 様々な数値での動作例が示される
- 負の数での動作の違いが明確になる

**やってみよう**
1. Copilot Chatで質問する
2. 回答を読んで、両関数の違いを理解する
3. 実際にコードを書いて動作を確認する
4. 自分で色々な数値を試してみる
5. **応用**: Rの`ceiling()`と`floor()`も試してみましょう

### 📚 Copilot活用のコツ

#### 1. **コメントを先に書く**

ファイルにコメントを書いてから、Copilotに続きを書いてもらいます。

```python
# my3-2_copilot.py
# 円の面積を計算するプログラム

import math

# 半径を設定
radius = 5

# 円の面積を計算（面積 = π × r²）
# ← ここでCopilotが続きを提案してくれる
```

Copilotが`area = math.pi * radius ** 2`のようなコードを提案してくれます。

#### 2. **段階的に書く**

一度に全部書かず、少しずつ書いて確認しながら進めます。

```python
# ステップ1: まずインポートと変数定義
import math
radius = 5

# ステップ2: 面積の計算
area = math.pi * radius ** 2

# ステップ3: 結果の表示
print(f"半径{radius}の円の面積: {area}")

# ステップ4: 円周も計算してみる（Copilotに提案してもらう）
# 円周を計算
# ← Copilotが続きを提案
```

#### 3. **生成されたコードを必ず理解する**

Copilotが提案したコードは、**必ず自分で理解してから使う**ことが大切です。

- 各行が何をしているか説明できますか？
- 使われている関数の意味が分かりますか？
- なぜその方法が選ばれたのか理解できますか？

分からない部分があれば、Copilot Chatで質問しましょう。

```
このコードの「math.pi * radius ** 2」の部分について、
なぜこの式で円の面積が計算できるのか説明してください。
```

#### 4. **実験する**

生成されたコードを変更して、動作を確認しましょう。

```python
# Copilotが生成したコード
area = math.pi * radius ** 2

# 実験1: radiusを変えてみる
radius = 10
area = math.pi * radius ** 2
print(area)  # どんな値になる？

# 実験2: 式を分解してみる
pi_value = math.pi
radius_squared = radius ** 2
area = pi_value * radius_squared
print(area)  # 同じ結果になる？
```

### ⚠️ 注意事項

#### **AIは完璧ではない**
- Copilotが提案するコードが常に正しいとは限りません
- 必ず実行して、期待通りの結果になるか確認しましょう
- おかしいと思ったら、自分で調べたり質問したりすることが大切

#### **理解が第一**
- コードをコピーするだけでは学習になりません
- 「なぜこの関数を使うのか」「どういう仕組みで動くのか」を理解しましょう
- 分からないことは、Copilot Chatで質問してください

#### **検証する習慣**
- 生成されたコードを実行する前に、何をするコードか予想してみる
- 実行後、予想と結果が合っているか確認する
- 違っていたら、なぜ違うのか考えてみる

#### **自分で考える**
- 困ったらすぐにCopilotに頼るのではなく、まず自分で考えてみる
- 教材を読み返す、試行錯誤する、といった過程が学習には重要
- それでも分からないときに、Copilotを使う

### 🎓 推奨される学習の流れ

```
1. 教材を読んで概念を理解する
   ↓
2. サンプルプログラムを実行する
   ↓
3. 自分で似たようなプログラムを書いてみる
   ↓
4. 困ったらCopilotに聞く
   ↓
5. 生成されたコードを理解して実験する
   ↓
6. 練習問題で定着させる
```

**大切なのは「AIと協働する」姿勢です。丸投げではなく、一緒に学ぶパートナーとして活用しましょう！**

### 🎯 このセクションのまとめ

関数の利用について学びました。

- ✅ **基本的な関数呼び出し**: `関数名(引数)`の形式
- ✅ **引数の指定**: 位置で指定、名前で指定（Rのみ）
- ✅ **デフォルト引数**: 省略可能な引数の仕組み
- ✅ **専用関数**: よく使う処理には専用関数がある
- ✅ **パイプ演算子**: Rで処理を繋げる方法（`%>%`）
- ✅ **Copilot活用**: 効率的に関数を学ぶ方法

次のセクションでは、自分で関数を定義する方法を学びます。既存の関数を使えるようになったので、今度は自分で関数を作ってみましょう！

## 3.2.2 関数の定義

これまでは、すでに用意されている関数を使ってきました。ここからは、**自分で関数を作る**方法を学びます。自分で関数を定義できるようになると、プログラミングの幅が大きく広がります。

### 🎯 なぜ関数を定義するのか？
#### 理由1: 同じ処理を何度も書かない

```python
# 関数を使わない場合 - 繰り返しが多い
price1 = 1000
tax1 = price1 * 0.10
total1 = price1 + tax1
print(total1)

price2 = 2000
tax2 = price2 * 0.10
total2 = price2 + tax2
print(total2)

price3 = 1500
tax3 = price3 * 0.10
total3 = price3 + tax3
print(total3)
```

```python
# 関数を定義した場合 - すっきり！
def calculate_with_tax(price):
    tax = price * 0.10
    return price + tax

print(calculate_with_tax(1000))
print(calculate_with_tax(2000))
print(calculate_with_tax(1500))
```

#### 理由2: 修正が簡単
消費税率が変更になったとき、関数なら1箇所直せばOKです。

#### 理由3: 処理に名前が付く
`calculate_with_tax(1000)`を見れば、「税込価格を計算している」と分かります。

### 3.2.2.1 基本的な関数定義

最も基本的な関数定義から始めましょう。引数`a`と`b`を受け取り、`a - b`を返す関数を作ります。

#### 💻 サンプル07: 基本的な関数定義

**ファイル名**: `my3-2-07_define_basic.py` / `my3-2-07_define_basic.R`

**Python版**

```python
# my3-2-07_define_basic.py
# 基本的な関数定義のサンプル

# 関数を定義（引数aとbを受け取り、a - bを返す）
def subtract(a, b):
    result = a - b
    return result

# 関数を呼び出して使う
answer1 = subtract(10, 3)
print(f"10 - 3 = {answer1}")

answer2 = subtract(100, 25)
print(f"100 - 25 = {answer2}")

# 負の数になる場合
answer3 = subtract(3, 10)
print(f"3 - 10 = {answer3}")
```

**実行方法**

```bash
$ python my3-2-07_define_basic.py
```

**期待される出力**

```
10 - 3 = 7
100 - 25 = 75
3 - 10 = -7
```

**R版**

```r
# my3-2-07_define_basic.R
# 基本的な関数定義のサンプル

# 関数を定義（引数aとbを受け取り、a - bを返す）
subtract <- function(a, b) {
    result <- a - b
    result  # 最後の値が自動的に返される
}

# 関数を呼び出して使う
answer1 <- subtract(10, 3)
print(paste0("10 - 3 = ", answer1))

answer2 <- subtract(100, 25)
print(paste0("100 - 25 = ", answer2))

# 負の数になる場合
answer3 <- subtract(3, 10)
print(paste0("3 - 10 = ", answer3))
```

**実行方法**

```bash
$ Rscript my3-2-07_define_basic.R
```

**期待される出力**

```
[1] "10 - 3 = 7"
[1] "100 - 25 = 75"
[1] "3 - 10 = -7"
```

#### 📝 解説

**Python版の構文**

```python
def 関数名(引数1, 引数2, ...):
    処理
    return 戻り値
```

- `def`: 関数定義を始めるキーワード
- `関数名`: 分かりやすい名前を付ける
- `引数`: 関数に渡すデータ（カンマで区切って複数指定可能）
- `:`: 定義の開始を示す（忘れずに！）
- **インデント**: 関数の中身は必ず字下げする（通常4スペース）
- `return`: 関数の結果を返す（忘れずに！）

**R版の構文**

```r
関数名 <- function(引数1, 引数2, ...) {
    処理
    戻り値
}
```

- `function`: 関数を作るキーワード
- `<-`: 関数を変数に代入（関数名を付ける）
- `引数`: 関数に渡すデータ
- `{}`: 関数の中身を囲む（波括弧）
- 最後の値が自動的に戻り値になる（`return`は省略可能）

#### 🔍 RとPythonの違い

| 項目 | Python | R |
|------|--------|---|
| 定義の始め方 | `def 関数名():` | `関数名 <- function() {` |
| 処理の範囲 | インデントで表現 | `{}`で囲む |
| 戻り値 | `return`必須 | 最後の値が自動的に返る |
| 1行定義 | できる: `def f(x): return x * 2` | できる: `f <- function(x) x * 2` |

#### 💻 サンプル08: もっと実用的な関数

実際のデータサイエンスで使いそうな関数を作ってみましょう。

**ファイル名**: `my3-2-08_practical.py` / `my3-2-08_practical.R`

**Python版**

```python
# my3-2-08_practical.py
# 実用的な関数のサンプル

# 摂氏を華氏に変換する関数
def celsius_to_fahrenheit(celsius):
    fahrenheit = celsius * 9/5 + 32
    return fahrenheit

# BMIを計算する関数
def calculate_bmi(weight, height):
    # weight: 体重（kg）
    # height: 身長（cm）
    height_m = height / 100  # cmをmに変換
    bmi = weight / (height_m ** 2)
    return bmi

# 関数を使ってみる
temp_c = 25
temp_f = celsius_to_fahrenheit(temp_c)
print(f"{temp_c}°C は {temp_f}°F です")

my_weight = 65
my_height = 170
my_bmi = calculate_bmi(my_weight, my_height)
print(f"体重{my_weight}kg、身長{my_height}cmのBMI: {my_bmi:.2f}")
```

**実行方法**

```bash
$ python my3-2-08_practical.py
```

**期待される出力**

```
25°C は 77.0°F です
体重65kg、身長170cmのBMI: 22.49
```

**R版**

```r
# my3-2-08_practical.R
# 実用的な関数のサンプル

# 摂氏を華氏に変換する関数
celsius_to_fahrenheit <- function(celsius) {
    fahrenheit <- celsius * 9/5 + 32
    fahrenheit
}

# BMIを計算する関数
calculate_bmi <- function(weight, height) {
    # weight: 体重（kg）
    # height: 身長（cm）
    height_m <- height / 100  # cmをmに変換
    bmi <- weight / (height_m ^ 2)
    bmi
}

# 関数を使ってみる
temp_c <- 25
temp_f <- celsius_to_fahrenheit(temp_c)
print(paste0(temp_c, "°C は ", temp_f, "°F です"))

my_weight <- 65
my_height <- 170
my_bmi <- calculate_bmi(my_weight, my_height)
print(paste0("体重", my_weight, "kg、身長", my_height, "cmのBMI: ", round(my_bmi, 2)))
```

**実行方法**

```bash
$ Rscript my3-2-08_practical.R
```

**期待される出力**

```
[1] "25°C は 77°F です"
[1] "体重65kg、身長170cmのBMI: 22.49"
```

#### 📝 解説

**関数名の付け方**

- `celsius_to_fahrenheit`: 何をする関数か一目で分かる
- `calculate_bmi`: 動詞（calculate）+ 名詞（bmi）
- 単語はアンダースコアで繋ぐ（スネークケース）
- 小文字で書く

**良い関数の特徴**

1. **1つの機能に集中**: BMI計算だけ、温度変換だけ
2. **分かりやすい名前**: 関数名で何をするか分かる
3. **適切な引数**: 必要な情報だけを受け取る
4. **コメントを付ける**: 引数や戻り値の説明

### 3.2.2.2 デフォルト引数を持つ関数

引数に**デフォルト値**を設定すると、その引数を省略できるようになります。

#### 💻 サンプル09: デフォルト引数付き関数

**ファイル名**: `my3-2-09_default.py` / `my3-2-09_default.R`

**Python版**

```python
# my3-2-09_default.py
# デフォルト引数を持つ関数のサンプル

# 消費税を計算する関数（税率のデフォルトは10%）
def calculate_tax(price, tax_rate=0.10):
    tax = price * tax_rate
    total = price + tax
    return total

# デフォルト値を使う（税率10%）
price1 = 1000
total1 = calculate_tax(price1)
print(f"商品価格{price1}円（税率10%）: {total1}円")

# 税率を指定する（軽減税率8%）
price2 = 1000
total2 = calculate_tax(price2, 0.08)
print(f"商品価格{price2}円（税率8%）: {total2}円")

# 別の税率（5%）
price3 = 2000
total3 = calculate_tax(price3, 0.05)
print(f"商品価格{price3}円（税率5%）: {total3}円")
```

**実行方法**

```bash
$ python my3-2-09_default.py
```

**期待される出力**:
```
商品価格1000円（税率10%）: 1100.0円
商品価格1000円（税率8%）: 1080.0円
商品価格2000円（税率5%）: 2100.0円
```

**R版**

```r
# my3-2-09_default.R
# デフォルト引数を持つ関数のサンプル

# 消費税を計算する関数（税率のデフォルトは10%）
calculate_tax <- function(price, tax_rate = 0.10) {
    tax <- price * tax_rate
    total <- price + tax
    total
}

# デフォルト値を使う（税率10%）
price1 <- 1000
total1 <- calculate_tax(price1)
print(paste0("商品価格", price1, "円（税率10%）: ", total1, "円"))

# 税率を指定する（軽減税率8%）
price2 <- 1000
total2 <- calculate_tax(price2, 0.08)
print(paste0("商品価格", price2, "円（税率8%）: ", total2, "円"))

# 別の税率（5%）
price3 <- 2000
total3 <- calculate_tax(price3, 0.05)
print(paste0("商品価格", price3, "円（税率5%）: ", total3, "円"))
```

**実行方法**

```bash
$ Rscript my3-2-09_default.R
```

**期待される出力**

```
[1] "商品価格1000円（税率10%）: 1100円"
[1] "商品価格1000円（税率8%）: 1080円"
[1] "商品価格2000円（税率5%）: 2100円"
```

#### 📝 解説

**デフォルト引数の定義**

```python
# Python
def 関数名(引数1, 引数2=デフォルト値):
    処理
```

```r
# R
関数名 <- function(引数1, 引数2 = デフォルト値) {
    処理
}
```

**いつ使うか**

- よく使う値が決まっている場合（例: 消費税率10%）
- オプション的な引数の場合

**注意点**:
- デフォルト引数は、通常の引数の**後に**配置する
- `def f(a=1, b):`のような順序はエラーになる

#### 💻 サンプル10: 複数のデフォルト引数

**ファイル名**: `my3-2-10_multiple_defaults.py` / `my3-2-10_multiple_defaults.R`

**Python版**

```python
# my3-2-10_multiple_defaults.py
# 複数のデフォルト引数を持つ関数のサンプル

# 挨拶メッセージを作る関数
def create_greeting(name, greeting="こんにちは", punctuation="！"):
    message = f"{greeting}、{name}さん{punctuation}"
    return message

# すべてデフォルト値を使う（nameだけ指定）
msg1 = create_greeting("太郎")
print(msg1)

# greetingだけ変更
msg2 = create_greeting("花子", "おはようございます")
print(msg2)

# greetingとpunctuationを変更
msg3 = create_greeting("次郎", "お疲れ様です", "。")
print(msg3)

# すべて指定
msg4 = create_greeting("三郎", "やあ", "!")
print(msg4)
```

**実行方法**

```bash
$ python my3-2-10_multiple_defaults.py
```

**期待される出力**

```
こんにちは、太郎さん！
おはようございます、花子さん！
お疲れ様です、次郎さん。
やあ、三郎さん!
```

**R版**

```r
# my3-2-10_multiple_defaults.R
# 複数のデフォルト引数を持つ関数のサンプル

# 挨拶メッセージを作る関数
create_greeting <- function(name, greeting = "こんにちは", punctuation = "！") {
    message <- paste0(greeting, "、", name, "さん", punctuation)
    message
}

# すべてデフォルト値を使う（nameだけ指定）
msg1 <- create_greeting("太郎")
print(msg1)

# greetingだけ変更
msg2 <- create_greeting("花子", "おはようございます")
print(msg2)

# greetingとpunctuationを変更
msg3 <- create_greeting("次郎", "お疲れ様です", "。")
print(msg3)

# すべて指定
msg4 <- create_greeting("三郎", "やあ", "!")
print(msg4)
```

**実行方法**

```bash
$ Rscript my3-2-10_multiple_defaults.R
```

**期待される出力**

```
[1] "こんにちは、太郎さん！"
[1] "おはようございます、花子さん！"
[1] "お疲れ様です、次郎さん。"
[1] "やあ、三郎さん!"
```

#### 📝 解説

**複数のデフォルト引数**
- デフォルト値は好きなだけ設定できる
- 前の方の引数だけ変更することも、後ろの方だけ変更することもできる
- Rでは名前付き引数を使えば順序を気にしなくてよい

### 3.2.2.3 無名関数

**無名関数**（匿名関数）は、名前を付けずに定義する関数です。一時的に使う簡単な関数に便利です。

#### 💻 サンプル11: 無名関数の基本

**ファイル名**: `my3-2-11_lambda.py` / `my3-2-11_lambda.R`

**Python版**

```python
# my3-2-11_lambda.py
# 無名関数（lambda式）のサンプル

# 通常の関数定義
def square(x):
    return x ** 2

result1 = square(5)
print(f"通常の関数: 5の2乗 = {result1}")

# 無名関数（lambda式）
# 名前を付けずに関数を定義して、すぐ使う
result2 = (lambda x: x ** 2)(5)
print(f"lambda式: 5の2乗 = {result2}")

# lambda式を変数に代入することもできる
square_lambda = lambda x: x ** 2
result3 = square_lambda(5)
print(f"変数に代入したlambda: 5の2乗 = {result3}")

# 複数の引数を持つlambda式
add = lambda a, b: a + b
result4 = add(3, 7)
print(f"lambda式で足し算: 3 + 7 = {result4}")
```

**実行方法**

```bash
$ python my3-2-11_lambda.py
```

**期待される出力**

```
通常の関数: 5の2乗 = 25
lambda式: 5の2乗 = 25
変数に代入したlambda: 5の2乗 = 25
lambda式で足し算: 3 + 7 = 10
```

**R版**

```r
# my3-2-11_lambda.R
# 無名関数のサンプル

# 通常の関数定義
square <- function(x) {
    x ^ 2
}

result1 <- square(5)
print(paste0("通常の関数: 5の2乗 = ", result1))

# 無名関数
# 名前を付けずに関数を定義して、すぐ使う
result2 <- (function(x) x ^ 2)(5)
print(paste0("無名関数: 5の2乗 = ", result2))

# 無名関数を変数に代入することもできる
square_anonymous <- function(x) x ^ 2
result3 <- square_anonymous(5)
print(paste0("変数に代入した無名関数: 5の2乗 = ", result3))

# 複数の引数を持つ無名関数
add <- function(a, b) a + b
result4 <- add(3, 7)
print(paste0("無名関数で足し算: 3 + 7 = ", result4))
```

**実行方法**:
```bash
$ Rscript my3-2-11_lambda.R
```

**期待される出力**

```
[1] "通常の関数: 5の2乗 = 25"
[1] "無名関数: 5の2乗 = 25"
[1] "変数に代入した無名関数: 5の2乗 = 25"
[1] "無名関数で足し算: 3 + 7 = 10"
```

#### 📝 解説

**Python版のlambda式の構文**

```python
lambda 引数: 式
```

- `lambda`: 無名関数を作るキーワード
- `引数`: カンマで区切って複数指定可能
- `:`: 引数と式の区切り
- `式`: 1つだけ（複数行は書けない）
- 式の結果が自動的に返される（`return`不要）

**R版の無名関数の構文**

```r
function(引数) 式
```

- 通常の関数定義から名前を省略しただけ
- `{}`は省略可能（1行の場合）

**いつ使うか**
1. **その場限りの簡単な処理**: わざわざ名前を付けるほどでもないとき
2. **関数を引数として渡すとき**: 後の章で詳しく学びます（`map`, `filter`など）

**使わない方がよい場合**
- 複雑な処理: 通常の関数定義の方が分かりやすい
- 何度も使う処理: 名前を付けた方が分かりやすい

#### 💻 サンプル12: 複数の関数を組み合わせる

関数を組み合わせることで、複雑な処理を分かりやすく書けます。

**ファイル名**: `my3-2-12_combined.py` / `my3-2-12_combined.R`

**Python版**

```python
# my3-2-12_combined.py
# 複数の関数を組み合わせるサンプル

# 摂氏を華氏に変換
def celsius_to_fahrenheit(celsius):
    return celsius * 9/5 + 32

# 華氏を摂氏に変換
def fahrenheit_to_celsius(fahrenheit):
    return (fahrenheit - 32) * 5/9

# 温度の説明を追加する関数
def describe_temperature(celsius):
    fahrenheit = celsius_to_fahrenheit(celsius)
    
    # 温度に応じたコメント
    if celsius < 0:
        comment = "氷点下です！"
    elif celsius < 10:
        comment = "寒いですね。"
    elif celsius < 20:
        comment = "涼しいです。"
    elif celsius < 30:
        comment = "快適です。"
    else:
        comment = "暑いですね！"
    
    return f"{celsius}°C ({fahrenheit:.1f}°F) - {comment}"

# 関数を使ってみる
temperatures = [-5, 5, 15, 25, 35]

for temp in temperatures:
    print(describe_temperature(temp))
```

**実行方法**

```bash
$ python my3-2-12_combined.py
```

**期待される出力**

```
-5°C (23.0°F) - 氷点下です！
5°C (41.0°F) - 寒いですね。
15°C (59.0°F) - 涼しいです。
25°C (77.0°F) - 快適です。
35°C (95.0°F) - 暑いですね！
```

**R版**:
```r
# my3-2-12_combined.R
# 複数の関数を組み合わせるサンプル

# 摂氏を華氏に変換
celsius_to_fahrenheit <- function(celsius) {
    celsius * 9/5 + 32
}

# 華氏を摂氏に変換
fahrenheit_to_celsius <- function(fahrenheit) {
    (fahrenheit - 32) * 5/9
}

# 温度の説明を追加する関数
describe_temperature <- function(celsius) {
    fahrenheit <- celsius_to_fahrenheit(celsius)
    
    # 温度に応じたコメント
    if (celsius < 0) {
        comment <- "氷点下です！"
    } else if (celsius < 10) {
        comment <- "寒いですね。"
    } else if (celsius < 20) {
        comment <- "涼しいです。"
    } else if (celsius < 30) {
        comment <- "快適です。"
    } else {
        comment <- "暑いですね！"
    }
    
    paste0(celsius, "°C (", round(fahrenheit, 1), "°F) - ", comment)
}

# 関数を使ってみる
temperatures <- c(-5, 5, 15, 25, 35)

for (temp in temperatures) {
    print(describe_temperature(temp))
}
```

**実行方法**

```bash
$ Rscript my3-2-12_combined.R
```

**期待される出力**

```
[1] "-5°C (23°F) - 氷点下です！"
[1] "5°C (41°F) - 寒いですね。"
[1] "15°C (59°F) - 涼しいです。"
[1] "25°C (77°F) - 快適です。"
[1] "35°C (95°F) - 暑いですね！"
```

#### 📝 解説

**関数を組み合わせる利点**
1. **処理を分割**: 各関数は1つの役割に集中
2. **再利用可能**: `celsius_to_fahrenheit`は他でも使える
3. **テストしやすい**: 各関数を個別にテストできる
4. **読みやすい**: 何をしているか分かりやすい

**良い設計**
- 小さな関数をたくさん作る
- 各関数は1つのことだけをする
- 関数名で処理内容が分かる

## 📚 参考: より実践的な書き方

ここまでは、初心者向けのシンプルな関数定義を学びました。**現時点では基本版で十分です**が、意欲的な方のために、より実践的な書き方も紹介します。

### Python版: 型ヒントとdocstring

**ファイル名**: `my3-2-07_advanced.py`

```python
# my3-2-07_advanced.py
# より実践的な関数定義（Python）

def calculate_bmi(weight: float, height: float) -> float:
    """
    BMI（体格指数）を計算します。
    
    Args:
        weight (float): 体重（kg）
        height (float): 身長（cm）
    
    Returns:
        float: BMI値
    
    Examples:
        >>> calculate_bmi(65, 170)
        22.49
    """
    if height <= 0 or weight <= 0:
        raise ValueError("身長と体重は正の数である必要があります")
    
    height_m = height / 100  # cmをmに変換
    bmi = weight / (height_m ** 2)
    return round(bmi, 2)

# 関数を使う
try:
    result = calculate_bmi(65, 170)
    print(f"BMI: {result}")
except ValueError as e:
    print(f"エラー: {e}")
```

**追加されている要素**
- **型ヒント**: `weight: float`で引数の型を明示
- **docstring**: 関数の説明（3つのクォートで囲む）
- **エラーハンドリング**: 不正な入力をチェック
- **例外処理**: try-exceptで安全に実行

### R版: より構造化された関数

**ファイル名**: `my3-2-07_advanced.R`

```r
# my3-2-07_advanced.R
# より実践的な関数定義（R）

#' BMI（体格指数）を計算します
#'
#' @param weight 体重（kg）
#' @param height 身長（cm）
#' @return BMI値
#' @examples
#' calculate_bmi(65, 170)
calculate_bmi <- function(weight, height) {
    # 入力値の検証
    if (height <= 0 || weight <= 0) {
        stop("身長と体重は正の数である必要があります")
    }
    
    # BMI計算
    height_m <- height / 100  # cmをmに変換
    bmi <- weight / (height_m ^ 2)
    
    # 結果を返す
    return(round(bmi, 2))
}

# 関数を使う（エラーハンドリング付き）
tryCatch({
    result <- calculate_bmi(65, 170)
    print(paste0("BMI: ", result))
}, error = function(e) {
    print(paste0("エラー: ", e$message))
})
```

**追加されている要素**
- **Roxygen形式のコメント**: `#'`で始まる特殊なコメント
- **入力値の検証**: `stop()`でエラーを発生
- **エラーハンドリング**: `tryCatch()`で安全に実行
- **明示的なreturn**: 戻り値を明確にする

**これらの書き方を今すぐ覚える必要はありません**が、将来的には役立ちます。まずは基本をしっかりマスターしましょう！

## 💡 GitHub Copilot活用ガイド（3.2.2 関数の定義）
### このセクションで学んだことをCopilotで実践

関数の定義方法を学びました。自分で関数を作れるようになると、プログラミングの可能性が大きく広がります。ここでは、GitHub Copilotを使って、様々な関数を作る練習をしましょう。

Copilotは、あなたが書いたコメントから「こういう関数を作りたいのだな」と理解して、適切な関数定義を提案してくれます。最初は簡単な関数から始めて、徐々に複雑な関数を作れるようになりましょう。

### 🚀 使えるプロンプト例
#### プロンプト例1: シンプルな計算関数 [★☆☆]

**Copilot Chatに入力**

```
Pythonで、円の面積を計算する関数を作ってください。
- 関数名: calculate_circle_area
- 引数: radius（半径）
- 戻り値: 面積
- 初心者向けに、コメントを詳しく付けてください。
```

**期待される動作**
- `math.pi`を使った関数が生成される
- 面積の計算式（π × r²）が実装される
- 分かりやすいコメントが付く

**やってみよう**
1. Copilot Chatでプロンプトを入力
2. 生成されたコードを`circle_area.py`として保存
3. いくつかの半径で実行してみる（例: 5, 10, 7.5）
4. 結果が正しいか電卓で確認する
5. **応用**: R版も作ってもらいましょう

**確認すべきポイント**
- 関数名が指示通りか
- `math.pi`が使われているか
- 計算式が正しいか（π × r²）
- コメントが分かりやすいか

#### プロンプト例2: 複数の引数を持つ関数 [★☆☆]
**Copilot Chatに入力**

```
Pythonで、長方形の面積を計算する関数を作ってください。
- 関数名: calculate_rectangle_area
- 引数: width（幅）、height（高さ）
- 戻り値: 面積
- 使用例も含めてください。
```

**期待される動作**
- 2つの引数を持つ関数が生成される
- 幅 × 高さの計算が実装される
- 関数を使った例が示される

**やってみよう**
1. 生成されたコードを保存して実行
2. 正方形の場合（幅と高さが同じ）も試す
3. 小数点の値でも試す（例: 3.5 × 2.7）
4. **応用**: 三角形の面積を計算する関数も作ってみましょう（底辺 × 高さ ÷ 2）

#### プロンプト例3: デフォルト引数を持つ関数 [★★☆]

**Copilot Chatに入力**

```
Pythonで、割引後の価格を計算する関数を作ってください。
- 関数名: calculate_discounted_price
- 引数: price（元の価格）、discount_rate（割引率、デフォルト10%）
- 戻り値: 割引後の価格
- 使用例を3つ示してください（デフォルト使用、20%割引、5%割引）
```

**期待される動作**
- デフォルト引数（`discount_rate=0.10`）を持つ関数が生成される
- 割引計算が実装される
- 3つの使用例が提示される

**やってみよう**
1. 生成されたコードを実行して、3つの例が正しく動くか確認
2. 割引なし（0%）の場合も試す
3. 50%オフ（半額）の場合も試す
4. **応用**: 消費税込みの価格を計算する関数も作り、2つの関数を組み合わせてみましょう

**理解を深める質問**

```
この関数で、なぜdiscount_rateのデフォルト値を0.10にしたのですか？
デフォルト引数を使う利点を説明してください。
```

#### プロンプト例4: データサイエンス向けの関数 [★★☆]

**Copilot Chatに入力**

```
Pythonで、リストの平均値を計算する関数を自作してください。
- 関数名: calculate_average
- 引数: numbers（数値のリスト）
- 戻り値: 平均値
- 組み込み関数（sum, lenなど）は使ってOKですが、statistics.meanは使わないでください。
- 使用例も含めてください。
```

**期待される動作**
- リストを受け取る関数が生成される
- `sum()`と`len()`を使った平均計算が実装される
- 実用的な使用例が示される

**やってみよう**
1. 生成されたコードを保存して実行
2. 様々なリストで試す（例: [1,2,3,4,5]、[10,20,30]）
3. 結果を電卓で確認
4. **応用**: 中央値を計算する関数も作ってみましょう
5. **発展**: 空のリスト[]が渡されたときのエラー処理を追加してもらいましょう

#### プロンプト例5: Rのパイプと組み合わせる関数 [★★☆]

**Copilot Chatに入力**

```
Rで、数値を標準化（z-score）する関数を作ってください。
- 関数名: standardize
- 引数: x（数値）、mean（平均）、sd（標準偏差）
- 戻り値: 標準化された値
- 計算式: (x - mean) / sd
- tidyverseのパイプ（%>%）で使える例も示してください。
```

**期待される動作**
- 標準化の計算式が実装される
- パイプで使える例が提示される
- 複数の値で動作例が示される

**やってみよう**
1. 生成されたコードを`standardize.R`として保存
2. 通常の呼び出しとパイプでの呼び出しの両方を試す
3. 平均0、標準偏差1で標準化した結果を確認
4. **応用**: 複数の値をまとめて標準化する例も作ってもらいましょう

#### プロンプト例6: 複数の関数を組み合わせる [★★★]

**Copilot Chatに入力**

```
Pythonで、以下の機能を持つプログラムを作ってください:
1. 摂氏を華氏に変換する関数（celsius_to_fahrenheit）
2. 華氏を摂氏に変換する関数（fahrenheit_to_celsius）
3. 温度の単位を自動判定して変換する関数（convert_temperature）
   - 引数: temp（温度）、from_unit（"C"または"F"）、to_unit（"C"または"F"）
   - 適切な変換関数を呼び出す
初心者向けに、各関数にコメントを付けてください。
使用例も含めてください。
```

**期待される動作**
- 3つの関数が生成される
- `convert_temperature`が他の2つの関数を使う
- 様々な変換パターンの例が示される

**やってみよう**
1. 生成されたコードを保存して実行
2. C→F、F→C、C→C（変換なし）など、様々なパターンを試す
3. 各関数が正しく動作するか確認
4. **応用**: "K"（ケルビン）も扱えるように拡張してもらいましょう

**理解を深める質問**

```
このプログラムで、なぜ3つの関数に分けているのですか？
1つの大きな関数にするのと比べて、どんな利点がありますか？
```

#### プロンプト例7: 実用的なデータ処理関数 [★★★]

**Copilot Chatに入力**

```
Pythonで、学生の成績を分析する関数セットを作ってください:
1. 成績リストの平均点を計算する関数（calculate_average）
2. 最高点と最低点を返す関数（find_min_max）
3. 合格者数をカウントする関数（count_passed、60点以上を合格とする）
4. 成績の統計情報を表示する関数（show_statistics）
   - 平均、最高点、最低点、合格者数/総数を表示
初心者向けに、詳しいコメントを付けてください。
テストデータと使用例も含めてください。
```

**期待される動作**
- 4つの関数が生成される
- 各関数が適切に連携する
- テストデータで動作例が示される

**やってみよう**
1. 生成されたコードを`grade_analysis.py`として保存
2. 提示されたテストデータで実行
3. 自分でテストデータを作って試す（例: [85, 92, 78, 65, 55, 88, 73]）
4. 各関数を個別に呼び出して動作を確認
5. **応用**: R版も作成し、両方の実装を比較してみましょう

### 📚 Copilot活用のコツ

#### 1. **段階的に関数を作る**

いきなり完璧な関数を作ろうとせず、段階的に進めましょう。

```python
# ステップ1: 最もシンプルな関数を作る
# 円の面積を計算する関数を作って
# ↓ Copilotが生成

# ステップ2: 動作を確認
# result = calculate_circle_area(5)
# print(result)

# ステップ3: 改良を依頼
# この関数に、半径が負の場合のエラーチェックを追加して
# ↓ Copilotが改良版を生成
```

#### 2. **具体的な要件を伝える**

抽象的な指示より、具体的な指示の方がよい結果が得られます。

❌ 悪い例:
```
計算する関数を作って
```

✅ 良い例:
```
Pythonで、2つの数値の平均を計算する関数を作ってください。
関数名はcalculate_averageにして、コメントも付けてください。
```

#### 3. **生成された関数を理解する**

Copilotが生成した関数について、以下を確認しましょう。

```
この関数の各行について説明してください。
なぜこの計算方法を選んだのですか？
他の書き方と比べて、この書き方の利点は何ですか？
```

#### 4. **テストケースを考える**

関数を作ったら、様々なケースでテストしましょう。

```python
# 正常なケース
result1 = my_function(10, 5)

# 境界値（0や負の数）
result2 = my_function(0, 5)
result3 = my_function(-10, 5)

# 同じ値
result4 = my_function(5, 5)

# 大きな値
result5 = my_function(1000, 999)
```

Copilotに「この関数のテストケースを作って」と頼むこともできます。

#### 5. **リファクタリングを学ぶ**

動くコードを、より良いコードに改善する練習をしましょう。

```
この関数をより読みやすく書き直してください。
この関数を、複数の小さな関数に分割してください。
この関数に、分かりやすいコメントを追加してください。
```

### ⚠️ 注意事項

#### **関数名の重要性**
- Copilotは関数名から処理内容を推測します
- `f`や`func`のような曖昧な名前より、`calculate_tax`のような具体的な名前を使いましょう

#### **複雑すぎる関数は避ける**
- 1つの関数は1つの役割に集中させる
- 複雑な処理は、複数の関数に分割する
- Copilotに「この関数は複雑すぎますか？」と聞いてみましょう

#### **エラー処理について**
- 基本版では、シンプルさを優先してエラー処理を省略しています
- 実用的なプログラムでは、エラー処理が重要です
- 慣れてきたら、Copilotに「エラー処理を追加して」と依頼してみましょう

#### **AIの提案を鵜呑みにしない**
- 生成されたコードが本当に正しいか、必ず確認する
- 分からないコードは、理解できるまで質問する
- 「なぜこの書き方なのか」を常に考える

### 🎓 推奨される学習の流れ

```
1. 教材で関数定義の基本を理解する
   ↓
2. サンプルプログラムを実行して動作を確認
   ↓
3. 簡単な関数を自分で書いてみる
   ↓
4. Copilotに似た関数を作ってもらう
   ↓
5. 自分のコードとCopilotのコードを比較
   ↓
6. より複雑な関数に挑戦
   ↓
7. 複数の関数を組み合わせる練習
```

#### 💡 効果的な学習テクニック

**1. 「自分でやってから、Copilotで確認」**

```
# まず自分で書く
def calculate_tax(price):
    tax = price * 0.10
    return price + tax

# 次にCopilotに同じ関数を作ってもらう
# 「税込価格を計算する関数を作って」
# ↓ 自分の実装と比較して学ぶ
```

**2. 「Copilotの提案から学ぶ」**

```python
# 自分が思いつかなかった書き方があれば
# なぜそう書くのかCopilotに質問する
```

**3. 「段階的に機能を追加」**

```
基本の関数 → デフォルト引数を追加 → エラーチェックを追加 → ドキュメントを充実
```

### 🎯 このセクションのまとめ

関数の定義について学びました:

- ✅ **基本的な関数定義**: PythonとRの構文の違い
- ✅ **デフォルト引数**: 省略可能な引数の作り方
- ✅ **無名関数**: lambda式と無名関数の使い方
- ✅ **関数の組み合わせ**: 複数の関数を連携させる方法
- ✅ **Copilot活用**: 効率的に関数を作る方法

**次は統合演習です！** 学んだことを活かして、実践的な関数を作成してみましょう。

## 3.2.3 統合演習
これまで学んだ関数の知識を使って、実践的なプログラムを作ってみましょう。2つの課題に取り組みます。

### 📝 演習1: 温度変換プログラム
#### 課題の内容
摂氏（Celsius）、華氏（Fahrenheit）、ケルビン（Kelvin）の3つの温度単位を相互に変換するプログラムを作成してください。

#### 要件
以下の関数を実装してください。

1. **celsius_to_fahrenheit(celsius)** - 摂氏を華氏に変換
   - 変換式: F = C × 9/5 + 32

2. **celsius_to_kelvin(celsius)** - 摂氏をケルビンに変換
   - 変換式: K = C + 273.15

3. **fahrenheit_to_celsius(fahrenheit)** - 華氏を摂氏に変換
   - 変換式: C = (F - 32) × 5/9

4. **kelvin_to_celsius(kelvin)** - ケルビンを摂氏に変換
   - 変換式: C = K - 273.15

5. **convert_temperature(temp, from_unit, to_unit)** - 任意の単位間で変換
   - from_unit, to_unitは "C", "F", "K" のいずれか
   - 上記の関数を組み合わせて実装

#### テストデータ
以下の変換が正しく動作することを確認してください。

```python
# Python
print(celsius_to_fahrenheit(0))      # 32.0 (氷点)
print(celsius_to_fahrenheit(100))    # 212.0 (沸点)
print(celsius_to_kelvin(0))          # 273.15 (絶対零度との差)
print(fahrenheit_to_celsius(32))     # 0.0
print(kelvin_to_celsius(273.15))     # 0.0
print(convert_temperature(25, "C", "F"))  # 77.0
print(convert_temperature(77, "F", "K"))  # 298.15
```

```r
# R
print(celsius_to_fahrenheit(0))      # 32 (氷点)
print(celsius_to_fahrenheit(100))    # 212 (沸点)
print(celsius_to_kelvin(0))          # 273.15 (絶対零度との差)
print(fahrenheit_to_celsius(32))     # 0
print(kelvin_to_celsius(273.15))     # 0
print(convert_temperature(25, "C", "F"))  # 77
print(convert_temperature(77, "F", "K"))  # 298.15
```

#### ヒント

- まず、個別の変換関数を作る
- 次に、`convert_temperature`で他の関数を呼び出す
- C→F→Kのように、一度摂氏に変換してから目的の単位に変換すると簡単
- GitHub Copilotを活用してもOK（ただし、コードを理解すること！）

#### 提出形式
- Pythonファイル: `exercise01_temperature.py`
- Rファイル: `exercise01_temperature.R`
- 両方とも作成してください

### 📝 演習2: 統計計算プログラム
#### 課題の内容
数値のリスト（またはベクトル）に対して、基本的な統計量を計算するプログラムを作成してください。

#### 要件
以下の関数を実装してください。

1. **calculate_mean(numbers)** - 平均値を計算
   - 組み込み関数を使わず、sum()とlen()で実装

2. **calculate_median(numbers)** - 中央値を計算
   - リストをソートして中央の値を返す
   - 要素数が偶数の場合は、中央2つの平均

3. **calculate_range(numbers)** - 範囲（最大値 - 最小値）を計算

4. **calculate_variance(numbers)** - 分散を計算
   - 分散 = Σ(xᵢ - 平均)² / n

5. **calculate_std(numbers)** - 標準偏差を計算
   - 標準偏差 = √分散
   - calculate_variance関数を使うこと

6. **show_statistics(numbers)** - すべての統計量を表示
   - 上記の関数をすべて呼び出して、結果を見やすく表示

#### テストデータ
以下のデータで動作を確認してください。

```python
# Python
test_data = [10, 20, 30, 40, 50]

# 期待される結果
# 平均: 30.0
# 中央値: 30.0
# 範囲: 40
# 分散: 200.0
# 標準偏差: 14.14...
```

```r
# R
test_data <- c(10, 20, 30, 40, 50)

# 期待される結果
# 平均: 30
# 中央値: 30
# 範囲: 40
# 分散: 200
# 標準偏差: 14.14...
```

#### ヒント
- Pythonの`sorted()`やRの`sort()`を使ってリストをソート
- Pythonの`**0.5`やRの`sqrt()`で平方根
- まず個別の関数を作って動作確認してから、統合する
- GitHub Copilotを活用してもOK

#### 提出形式
- Pythonファイル: `exercise02_statistics.py`
- Rファイル: `exercise02_statistics.R`
- 両方とも作成してください

---

### 🎯 演習のねらい
この演習を通じて、以下のスキルを身につけます:

1. **関数の定義**: 実用的な関数を自分で作る
2. **関数の組み合わせ**: 複数の関数を連携させる
3. **デバッグ**: 期待される結果と実際の結果を比較する
4. **コードの再利用**: PythonとRの両方で同じロジックを実装する

### 💡 取り組み方
1. **まず自分で考える**: すぐにCopilotに頼らず、まず自分で考えてみる
2. **小さく始める**: 1つの関数から始めて、徐々に追加
3. **テストしながら進める**: 各関数を作ったらすぐにテスト
4. **困ったらCopilotに相談**: 詰まったらCopilotを活用
5. **理解を優先**: 動くだけでなく、なぜ動くのかを理解する

### 💻 演習1の解答例: 温度変換プログラム
#### 基本版（Python）
**ファイル名**: `exercise01_temperature.py`

```python
# exercise01_temperature.py
# 温度変換プログラム

# 摂氏を華氏に変換
def celsius_to_fahrenheit(celsius):
    fahrenheit = celsius * 9/5 + 32
    return fahrenheit

# 摂氏をケルビンに変換
def celsius_to_kelvin(celsius):
    kelvin = celsius + 273.15
    return kelvin

# 華氏を摂氏に変換
def fahrenheit_to_celsius(fahrenheit):
    celsius = (fahrenheit - 32) * 5/9
    return celsius

# ケルビンを摂氏に変換
def kelvin_to_celsius(kelvin):
    celsius = kelvin - 273.15
    return celsius

# 任意の単位間で変換
def convert_temperature(temp, from_unit, to_unit):
    # まず摂氏に変換
    if from_unit == "C":
        celsius = temp
    elif from_unit == "F":
        celsius = fahrenheit_to_celsius(temp)
    elif from_unit == "K":
        celsius = kelvin_to_celsius(temp)
    
    # 次に目的の単位に変換
    if to_unit == "C":
        result = celsius
    elif to_unit == "F":
        result = celsius_to_fahrenheit(celsius)
    elif to_unit == "K":
        result = celsius_to_kelvin(celsius)
    
    return result

# テスト
print("=== 個別の変換関数のテスト ===")
print(f"0°C = {celsius_to_fahrenheit(0)}°F")
print(f"100°C = {celsius_to_fahrenheit(100)}°F")
print(f"0°C = {celsius_to_kelvin(0)}K")
print(f"32°F = {fahrenheit_to_celsius(32)}°C")
print(f"273.15K = {kelvin_to_celsius(273.15)}°C")

print("\n=== 統合変換関数のテスト ===")
print(f"25°C = {convert_temperature(25, 'C', 'F')}°F")
print(f"77°F = {convert_temperature(77, 'F', 'K')}K")
print(f"300K = {convert_temperature(300, 'K', 'C')}°C")
```

**実行方法**:
```bash
$ python exercise01_temperature.py
```

**期待される出力**:
```
=== 個別の変換関数のテスト ===
0°C = 32.0°F
100°C = 212.0°F
0°C = 273.15K
32°F = 0.0°C
273.15K = 0.0°C

=== 統合変換関数のテスト ===
25°C = 77.0°F
77°F = 298.15K
300K = 26.850000000000023°C
```

#### 基本版（R）
**ファイル名**: `exercise01_temperature.R`

```r
# exercise01_temperature.R
# 温度変換プログラム

# 摂氏を華氏に変換
celsius_to_fahrenheit <- function(celsius) {
    fahrenheit <- celsius * 9/5 + 32
    fahrenheit
}

# 摂氏をケルビンに変換
celsius_to_kelvin <- function(celsius) {
    kelvin <- celsius + 273.15
    kelvin
}

# 華氏を摂氏に変換
fahrenheit_to_celsius <- function(fahrenheit) {
    celsius <- (fahrenheit - 32) * 5/9
    celsius
}

# ケルビンを摂氏に変換
kelvin_to_celsius <- function(kelvin) {
    celsius <- kelvin - 273.15
    celsius
}

# 任意の単位間で変換
convert_temperature <- function(temp, from_unit, to_unit) {
    # まず摂氏に変換
    if (from_unit == "C") {
        celsius <- temp
    } else if (from_unit == "F") {
        celsius <- fahrenheit_to_celsius(temp)
    } else if (from_unit == "K") {
        celsius <- kelvin_to_celsius(temp)
    }
    
    # 次に目的の単位に変換
    if (to_unit == "C") {
        result <- celsius
    } else if (to_unit == "F") {
        result <- celsius_to_fahrenheit(celsius)
    } else if (to_unit == "K") {
        result <- celsius_to_kelvin(celsius)
    }
    
    result
}

# テスト
print("=== 個別の変換関数のテスト ===")
print(paste0("0°C = ", celsius_to_fahrenheit(0), "°F"))
print(paste0("100°C = ", celsius_to_fahrenheit(100), "°F"))
print(paste0("0°C = ", celsius_to_kelvin(0), "K"))
print(paste0("32°F = ", fahrenheit_to_celsius(32), "°C"))
print(paste0("273.15K = ", kelvin_to_celsius(273.15), "°C"))

print("")
print("=== 統合変換関数のテスト ===")
print(paste0("25°C = ", convert_temperature(25, "C", "F"), "°F"))
print(paste0("77°F = ", convert_temperature(77, "F", "K"), "K"))
print(paste0("300K = ", convert_temperature(300, "K", "C"), "°C"))
```

**実行方法**:
```bash
$ Rscript exercise01_temperature.R
```

**期待される出力**:
```
[1] "=== 個別の変換関数のテスト ==="
[1] "0°C = 32°F"
[1] "100°C = 212°F"
[1] "0°C = 273.15K"
[1] "32°F = 0°C"
[1] "273.15K = 0°C"
[1] ""
[1] "=== 統合変換関数のテスト ==="
[1] "25°C = 77°F"
[1] "77°F = 298.15K"
[1] "300K = 26.85°C"
```

#### 📝 解答のポイント
**設計の工夫**
1. **個別の変換関数**: 各変換を独立した関数として実装
2. **統合関数**: 既存の関数を組み合わせて実装
3. **摂氏を経由**: C→F→Kのように直接変換せず、一度摂氏に統一

**この設計の利点**
- 各関数の役割が明確
- テストしやすい
- 修正や拡張が簡単
- コードの重複がない

### 💻 演習2の解答例: 統計計算プログラム
#### 基本版（Python）
**ファイル名**: `exercise02_statistics.py`

```python
# exercise02_statistics.py
# 統計計算プログラム

# 平均値を計算
def calculate_mean(numbers):
    total = sum(numbers)
    count = len(numbers)
    mean = total / count
    return mean

# 中央値を計算
def calculate_median(numbers):
    sorted_numbers = sorted(numbers)
    count = len(sorted_numbers)
    
    # 要素数が奇数の場合
    if count % 2 == 1:
        median = sorted_numbers[count // 2]
    # 要素数が偶数の場合
    else:
        middle1 = sorted_numbers[count // 2 - 1]
        middle2 = sorted_numbers[count // 2]
        median = (middle1 + middle2) / 2
    
    return median

# 範囲を計算
def calculate_range(numbers):
    minimum = min(numbers)
    maximum = max(numbers)
    range_value = maximum - minimum
    return range_value

# 分散を計算
def calculate_variance(numbers):
    mean = calculate_mean(numbers)
    squared_diffs = []
    
    for number in numbers:
        diff = number - mean
        squared_diff = diff ** 2
        squared_diffs.append(squared_diff)
    
    variance = sum(squared_diffs) / len(squared_diffs)
    return variance

# 標準偏差を計算
def calculate_std(numbers):
    variance = calculate_variance(numbers)
    std = variance ** 0.5
    return std

# すべての統計量を表示
def show_statistics(numbers):
    print(f"データ: {numbers}")
    print(f"データ数: {len(numbers)}")
    print(f"平均値: {calculate_mean(numbers):.2f}")
    print(f"中央値: {calculate_median(numbers):.2f}")
    print(f"範囲: {calculate_range(numbers):.2f}")
    print(f"分散: {calculate_variance(numbers):.2f}")
    print(f"標準偏差: {calculate_std(numbers):.2f}")

# テストデータ1
print("=== テストデータ1 ===")
test_data1 = [10, 20, 30, 40, 50]
show_statistics(test_data1)

# テストデータ2（偶数個）
print("\n=== テストデータ2（偶数個） ===")
test_data2 = [15, 25, 35, 45]
show_statistics(test_data2)

# テストデータ3（実際の成績データ）
print("\n=== テストデータ3（成績データ） ===")
test_data3 = [85, 92, 78, 65, 88, 73, 95, 82]
show_statistics(test_data3)
```

**実行方法**

```bash
$ python exercise02_statistics.py
```

**期待される出力**

```
=== テストデータ1 ===
データ: [10, 20, 30, 40, 50]
データ数: 5
平均値: 30.00
中央値: 30.00
範囲: 40.00
分散: 200.00
標準偏差: 14.14

=== テストデータ2（偶数個） ===
データ: [15, 25, 35, 45]
データ数: 4
平均値: 30.00
中央値: 30.00
範囲: 30.00
分散: 125.00
標準偏差: 11.18

=== テストデータ3（成績データ） ===
データ: [85, 92, 78, 65, 88, 73, 95, 82]
データ数: 8
平均値: 82.25
中央値: 83.50
範囲: 30.00
分散: 88.19
標準偏差: 9.39
```

#### 基本版（R）
**ファイル名**: `exercise02_statistics.R`

```r
# exercise02_statistics.R
# 統計計算プログラム

# 平均値を計算
calculate_mean <- function(numbers) {
    total <- sum(numbers)
    count <- length(numbers)
    mean <- total / count
    mean
}

# 中央値を計算
calculate_median <- function(numbers) {
    sorted_numbers <- sort(numbers)
    count <- length(sorted_numbers)
    
    # 要素数が奇数の場合
    if (count %% 2 == 1) {
        median <- sorted_numbers[count %/% 2 + 1]
    # 要素数が偶数の場合
    } else {
        middle1 <- sorted_numbers[count %/% 2]
        middle2 <- sorted_numbers[count %/% 2 + 1]
        median <- (middle1 + middle2) / 2
    }
    
    median
}

# 範囲を計算
calculate_range <- function(numbers) {
    minimum <- min(numbers)
    maximum <- max(numbers)
    range_value <- maximum - minimum
    range_value
}

# 分散を計算
calculate_variance <- function(numbers) {
    mean <- calculate_mean(numbers)
    squared_diffs <- c()
    
    for (number in numbers) {
        diff <- number - mean
        squared_diff <- diff ^ 2
        squared_diffs <- c(squared_diffs, squared_diff)
    }
    
    variance <- sum(squared_diffs) / length(squared_diffs)
    variance
}

# 標準偏差を計算
calculate_std <- function(numbers) {
    variance <- calculate_variance(numbers)
    std <- sqrt(variance)
    std
}

# すべての統計量を表示
show_statistics <- function(numbers) {
    print(paste0("データ: ", paste(numbers, collapse = ", ")))
    print(paste0("データ数: ", length(numbers)))
    print(paste0("平均値: ", round(calculate_mean(numbers), 2)))
    print(paste0("中央値: ", round(calculate_median(numbers), 2)))
    print(paste0("範囲: ", round(calculate_range(numbers), 2)))
    print(paste0("分散: ", round(calculate_variance(numbers), 2)))
    print(paste0("標準偏差: ", round(calculate_std(numbers), 2)))
}

# テストデータ1
print("=== テストデータ1 ===")
test_data1 <- c(10, 20, 30, 40, 50)
show_statistics(test_data1)

# テストデータ2（偶数個）
print("")
print("=== テストデータ2（偶数個） ===")
test_data2 <- c(15, 25, 35, 45)
show_statistics(test_data2)

# テストデータ3（実際の成績データ）
print("")
print("=== テストデータ3（成績データ） ===")
test_data3 <- c(85, 92, 78, 65, 88, 73, 95, 82)
show_statistics(test_data3)
```

**実行方法**

```bash
$ Rscript exercise02_statistics.R
```

**期待される出力**:
```
[1] "=== テストデータ1 ==="
[1] "データ: 10, 20, 30, 40, 50"
[1] "データ数: 5"
[1] "平均値: 30"
[1] "中央値: 30"
[1] "範囲: 40"
[1] "分散: 200"
[1] "標準偏差: 14.14"
[1] ""
[1] "=== テストデータ2（偶数個） ==="
[1] "データ: 15, 25, 35, 45"
[1] "データ数: 4"
[1] "平均値: 30"
[1] "中央値: 30"
[1] "範囲: 30"
[1] "分散: 125"
[1] "標準偏差: 11.18"
[1] ""
[1] "=== テストデータ3（成績データ） ==="
[1] "データ: 85, 92, 78, 65, 88, 73, 95, 82"
[1] "データ数: 8"
[1] "平均値: 82.25"
[1] "中央値: 83.5"
[1] "範囲: 30"
[1] "分散: 88.19"
[1] "標準偏差: 9.39"
```

#### 📝 解答のポイント

**実装の工夫**
1. **平均の再利用**: `calculate_variance`内で`calculate_mean`を呼び出す
2. **中央値の場合分け**: 奇数個と偶数個で処理を分ける
3. **標準偏差の実装**: 分散の関数を使って計算

**計算の確認方法**

```python
# 平均: (10+20+30+40+50) / 5 = 150 / 5 = 30
# 中央値: [10, 20, 30, 40, 50] の真ん中 = 30
# 範囲: 50 - 10 = 40
# 分散: ((10-30)²+(20-30)²+(30-30)²+(40-30)²+(50-30)²) / 5
#     = (400+100+0+100+400) / 5 = 1000 / 5 = 200
# 標準偏差: √200 ≈ 14.14
```

## 3.2.4 まとめ
### 🎓 本節で学んだこと
この節では、**関数**について学びました。関数はプログラミングの最も重要な概念の一つです。学んだ内容を振り返りましょう。

#### 3.2.1 関数の利用
既存の関数を使う方法を学びました。

✅ **基本的な関数呼び出し**
- `関数名(引数)`の形式で呼び出す
- 引数を渡して、戻り値を受け取る
- 例: `math.sqrt(4)`, `sqrt(4)`

✅ **引数の指定方法**
- 位置で指定: `log(100, 10)`
- 名前で指定: `log(x=100, base=10)` （R）
- PythonとRの違いを理解

✅ **デフォルト引数**
- 省略可能な引数の仕組み
- 省略すると自動的にデフォルト値が使われる
- 例: `log(100)` → 自然対数

✅ **専用関数**
- よく使う処理には専用関数がある
- `log10()`, `log2()` など

✅ **パイプ演算子（R）**
- `%>%` で処理を繋げる
- 左から右に読める
- データ処理のパイプライン

#### 3.2.2 関数の定義

自分で関数を作る方法を学びました:

✅ **基本的な関数定義**
- Python: `def 関数名(引数):`
- R: `関数名 <- function(引数) {}`
- インデントと波括弧の違い

✅ **デフォルト引数を持つ関数**
- 引数にデフォルト値を設定
- Python: `def f(a, b=5):`
- R: `f <- function(a, b = 5) {}`

✅ **無名関数**
- Python: `lambda a, b: a + b`
- R: `function(a, b) a + b`
- その場限りの簡単な処理に便利

✅ **関数の組み合わせ**
- 小さな関数を組み合わせて複雑な処理を作る
- 各関数は1つの役割に集中
- コードの再利用と保守性が向上

#### 3.2.3 統合演習
実践的なプログラムを作成しました。

✅ **温度変換プログラム**
- 摂氏、華氏、ケルビンの相互変換
- 複数の関数を組み合わせる設計

✅ **統計計算プログラム**
- 平均、中央値、分散、標準偏差の計算
- 関数の再利用（分散→標準偏差）

### 💡 重要なポイント
#### 1. 関数を使う利点
**コードの再利用**

```python
# 同じ処理を何度も書かなくてよい
result1 = calculate_tax(1000)
result2 = calculate_tax(2000)
result3 = calculate_tax(1500)
```

**プログラムの見通し**

```python
# 関数名で処理内容が分かる
temperature_f = celsius_to_fahrenheit(25)
bmi = calculate_bmi(170, 65)
```

**修正が簡単**

```python
# 関数の定義を1箇所変更するだけ
def calculate_tax(price):
    tax = price * 0.10  # ここだけ変更
    return price + tax
```

#### 2. 良い関数の特徴
**1つの機能に集中**

```python
# 良い例: 1つのことだけをする
def celsius_to_fahrenheit(celsius):
    return celsius * 9/5 + 32

# 悪い例: 複数のことをする
def convert_and_print_temperature(celsius):
    fahrenheit = celsius * 9/5 + 32
    kelvin = celsius + 273.15
    print(f"F: {fahrenheit}, K: {kelvin}")
    return fahrenheit
```

**分かりやすい名前**

```python
# 良い例
calculate_total_price()
convert_temperature()
show_statistics()

# 悪い例
f()
calc()
do_something()
```

**適切な引数と戻り値**

```python
# 必要な情報だけを受け取り、結果を返す
def calculate_bmi(weight, height):
    height_m = height / 100
    bmi = weight / (height_m ** 2)
    return bmi
```

#### 3. RとPythonの主な違い

| 項目 | Python | R |
|------|--------|---|
| 定義 | `def f():` | `f <- function() {}` |
| 構造 | インデント | 波括弧 `{}` |
| 戻り値 | `return` 必須 | 最後の値が自動 |
| 引数指定 | 位置のみ/名前付き | 柔軟な名前付き |
| パイプ | なし（標準） | `%>%` |
| 1行定義 | `def f(x): return x*2` | `f <- function(x) x*2` |

#### 4. GitHub Copilot活用のコツ

**段階的に作る**
1. まずシンプルな関数を作る
2. 動作を確認する
3. 機能を追加していく

**具体的に指示する**

```
「計算する関数を作って」 ❌
↓
「Pythonで、2つの数値の平均を計算する関数を作ってください。
関数名はcalculate_averageにして、コメントも付けてください。」 ✅
```

**生成されたコードを理解する**
- 各行が何をしているか説明できますか？
- なぜこの書き方なのか理解できますか？
- 分からない部分は質問しましょう

### 🎯 次のステップ
関数の基本をマスターしました。次は以下のスキルを身につけましょう。

**1. より複雑な関数を作る**
- 複数の処理を組み合わせる
- エラー処理を追加する
- より柔軟な引数を扱う

**2. データ構造と組み合わせる**
- リストやディクショナリ（辞書）を扱う関数
- データフレームを処理する関数
- 後の章で詳しく学びます

**3. 実践的なデータ分析**
- データの読み込み→処理→可視化
- 関数を使って効率的に分析
- 再利用可能なコードを書く

**4. AI協働スキルの向上**
- より高度なプロンプト
- コードレビューをAIに依頼
- デバッグにAIを活用

### 📚 復習のための練習問題
理解を深めるために、以下の課題に挑戦してみましょう。

#### 初級

1. **円周を計算する関数**
   - 関数名: `calculate_circumference`
   - 引数: `radius`（半径）
   - 戻り値: 円周（2πr）

2. **三角形の面積を計算する関数**
   - 関数名: `calculate_triangle_area`
   - 引数: `base`（底辺）、`height`（高さ）
   - 戻り値: 面積（底辺×高さ÷2）

3. **年齢を西暦から計算する関数**
   - 関数名: `calculate_age`
   - 引数: `birth_year`（生まれ年）
   - 戻り値: 現在の年齢（2025 - 生まれ年）

#### 中級

4. **複利計算関数**
   - 関数名: `calculate_compound_interest`
   - 引数: `principal`（元金）、`rate`（年利）、`years`（年数）
   - 戻り値: 最終金額
   - 計算式: 元金 × (1 + 利率)^年数

5. **成績の評価を返す関数**
   - 関数名: `get_grade`
   - 引数: `score`（点数）
   - 戻り値: "A"（90以上）、"B"（80-89）、"C"（70-79）、"D"（60-69）、"F"（59以下）

6. **リストから偶数だけを抽出する関数**
   - 関数名: `get_even_numbers`
   - 引数: `numbers`（数値のリスト）
   - 戻り値: 偶数だけのリスト

#### 上級

7. **フィボナッチ数列を生成する関数**
   - 関数名: `generate_fibonacci`
   - 引数: `n`（生成する項数）
   - 戻り値: フィボナッチ数列のリスト

8. **テキストの統計を計算する関数**
   - 関数名: `analyze_text`
   - 引数: `text`（文字列）
   - 戻り値: 文字数、単語数、文の数を含む辞書

9. **複数の統計関数を統合したクラス**（Python）
   - 平均、中央値、分散などをまとめて扱う

これらの練習問題は、GitHub Copilotを活用して取り組んでもOKです。ただし、生成されたコードを必ず理解してください！

---

## ✅ 学習チェックリスト

この節の学習が完了したかを確認しましょう。各項目にチェックを入れてください。

### A. 環境構築と基本操作（9項目）

#### ファイル作成と実行
- [ ] `touch`コマンドでPythonファイル（.py）を作成できる
- [ ] `touch`コマンドでRファイル（.R）を作成できる
- [ ] `python ファイル名.py`でPythonプログラムを実行できる
- [ ] `Rscript ファイル名.R`でRプログラムを実行できる
- [ ] VS Codeでファイルを開いて編集できる

#### 作業環境の確認
- [ ] 作業ディレクトリ（/home/datasci/work）にいることを確認できる
- [ ] 仮想環境（class）が有効になっていることを確認できる
- [ ] プロンプトに`(class)`が表示されていることを確認できる
- [ ] `pwd`コマンドで現在のディレクトリを確認できる

---

### B. プログラミング基礎スキル（38項目）

#### 関数の利用
- [ ] 関数の基本形式 `関数名(引数)` を理解している
- [ ] Pythonで`import math`を使って数学関数を利用できる
- [ ] Rで`sqrt()`などの基本関数を使える
- [ ] `math.sqrt()`で平方根を計算できる（Python）
- [ ] `sqrt()`で平方根を計算できる（R）
- [ ] `math.log()`で対数を計算できる（Python）
- [ ] `log()`で対数を計算できる（R）
- [ ] 複数の引数を持つ関数を呼び出せる
- [ ] `log(100, 10)`のように引数を位置で指定できる
- [ ] `log(x=100, base=10)`のように引数を名前で指定できる（R）
- [ ] デフォルト引数の仕組みを理解している
- [ ] 引数を省略したときの動作を理解している
- [ ] `log10()`, `log2()`などの専用関数を使える
- [ ] Rのパイプ演算子（`%>%`）の基本的な使い方を理解している
- [ ] `library(tidyverse)`でパイプ演算子を有効化できる
- [ ] パイプで複数の処理を繋げることができる

#### 関数の定義（Python）
- [ ] `def`キーワードで関数を定義できる
- [ ] 関数名の後にコロン（`:`）を付けることを理解している
- [ ] 関数の本体をインデントで記述できる
- [ ] `return`で値を返すことを理解している
- [ ] 引数を1つ持つ関数を定義できる
- [ ] 引数を複数持つ関数を定義できる
- [ ] デフォルト引数を持つ関数を定義できる
- [ ] `def f(a, b=5):`のようにデフォルト値を設定できる
- [ ] lambda式で無名関数を定義できる
- [ ] `lambda a, b: a + b`の構文を理解している

#### 関数の定義（R）
- [ ] `function`キーワードで関数を定義できる
- [ ] `<-`で関数を変数に代入できる
- [ ] 波括弧（`{}`）で関数の本体を囲むことを理解している
- [ ] 最後の値が自動的に返されることを理解している
- [ ] `return()`を使って明示的に値を返すこともできることを理解している
- [ ] 引数を1つ持つ関数を定義できる
- [ ] 引数を複数持つ関数を定義できる
- [ ] デフォルト引数を持つ関数を定義できる
- [ ] `function(a, b = 5)`のようにデフォルト値を設定できる
- [ ] 無名関数を定義できる

#### 関数の実践
- [ ] 分かりやすい関数名を付けることができる
- [ ] 1つの関数が1つの役割を持つように設計できる
- [ ] 複数の関数を組み合わせて使うことができる
- [ ] 関数内で他の関数を呼び出すことができる

---

### C. AI協働スキル（12項目）

#### GitHub Copilotの基本
- [ ] VS CodeでGitHub Copilotが有効になっていることを確認できる
- [ ] Copilot Chatを開くことができる（`Ctrl + Shift + I`）
- [ ] Copilot ChatでClaude Sonnetを選択できる
- [ ] コメントを書くとCopilotが提案してくれることを理解している

#### プロンプトの書き方
- [ ] 具体的な要件をプロンプトに含めることができる
- [ ] 「関数名」「引数」「戻り値」を明示してプロンプトを書ける
- [ ] 「初心者向け」「コメント付き」などの条件を指定できる
- [ ] 段階的にプロンプトを改善できる

#### Copilotの活用
- [ ] 生成されたコードを実行する前に内容を確認している
- [ ] 生成されたコードの各行が何をしているか理解しようとしている
- [ ] 分からない部分をCopilot Chatで質問できる
- [ ] 自分で書いたコードとCopilotのコードを比較できる

---

### D. 概念理解（18項目）

#### 関数の概念
- [ ] 関数とは「処理のまとまり」であることを理解している
- [ ] 関数を使うことでコードを再利用できることを理解している
- [ ] 関数を使うとプログラムが読みやすくなることを理解している
- [ ] 関数を使うと修正が簡単になることを理解している

#### 引数と戻り値
- [ ] 引数とは「関数に渡すデータ」であることを理解している
- [ ] 戻り値とは「関数が返す結果」であることを理解している
- [ ] 引数の順序が重要であることを理解している
- [ ] 名前付き引数を使うと順序を気にしなくてよいことを理解している（R）
- [ ] デフォルト引数は省略可能であることを理解している
- [ ] デフォルト引数を使うと柔軟な関数が作れることを理解している

#### PythonとRの違い
- [ ] Pythonは`def`、Rは`function`で関数を定義することを理解している
- [ ] Pythonはインデント、Rは波括弧で構造を表現することを理解している
- [ ] Pythonは`return`が必須、Rは最後の値が自動で返ることを理解している
- [ ] Rには名前付き引数の柔軟性があることを理解している
- [ ] Rにはパイプ演算子（`%>%`）があることを理解している

#### 設計の考え方
- [ ] 1つの関数は1つの役割を持つべきことを理解している
- [ ] 複数の小さな関数を組み合わせる設計の利点を理解している
- [ ] 関数名は処理内容が分かるようにすべきことを理解している

---

### E. 課題完遂（8項目）

#### 演習1: 温度変換プログラム
- [ ] 演習1のPython版を完成させた
- [ ] 演習1のR版を完成させた
- [ ] 個別の変換関数がすべて正しく動作することを確認した
- [ ] 統合変換関数が正しく動作することを確認した

#### 演習2: 統計計算プログラム
- [ ] 演習2のPython版を完成させた
- [ ] 演習2のR版を完成させた
- [ ] すべての統計関数が正しい結果を返すことを確認した
- [ ] テストデータで動作を確認した

---

### 📊 達成度評価

チェックした項目数で、あなたの達成度を確認しましょう。

**合計項目数: 85項目**

#### 🌟 達成度レベル

- **85-80項目（94%以上）: 優秀（Excellent）**
  - この節の内容を完全にマスターしています
  - 次の節に進む準備が十分にできています
  - 発展版の内容にも挑戦してみましょう

- **79-70項目（82-93%）: 良好（Good）**
  - この節の内容をよく理解しています
  - いくつかの項目を復習すると、さらに理解が深まります
  - 次の節に進んでも大丈夫です

- **69-60項目（71-81%）: 合格（Pass）**
  - 基本的な内容は理解できています
  - チェックが入らなかった項目を重点的に復習しましょう
  - 特にB（プログラミング基礎スキル）とD（概念理解）を復習してください

- **59項目以下（70%未満）: 要復習（Need Review）**
  - もう一度この節を学習することをお勧めします
  - サンプルプログラムを実際に動かしながら復習しましょう
  - 分からない部分はGitHub Copilotや教員に質問してください

#### 📈 カテゴリ別の確認

各カテゴリの達成度も確認しましょう:

**A. 環境構築と基本操作（9項目）**
- 9項目: 完璧です
- 7-8項目: 十分です
- 6項目以下: 基本操作を復習しましょう

**B. プログラミング基礎スキル（38項目）**
- 36-38項目: 優秀です
- 30-35項目: 良好です
- 25-29項目: もう少し練習しましょう
- 24項目以下: サンプルプログラムを繰り返し実行して練習してください

**C. AI協働スキル（12項目）**
- 12項目: 完璧です
- 10-11項目: 十分です
- 8-9項目: Copilotをもっと活用してみましょう
- 7項目以下: Copilot活用ガイドを読み直してください

**D. 概念理解（18項目）**
- 18項目: 完璧です
- 15-17項目: 十分です
- 12-14項目: 重要な概念を復習しましょう
- 11項目以下: この節の説明部分を読み直してください

**E. 課題完遂（8項目）**
- 8項目: 完璧です
- 6-7項目: もう少しで完成です
- 4-5項目: 演習をやり直しましょう
- 3項目以下: 解答例を参考にしながら、もう一度挑戦してください

---

### 🎯 復習のポイント

チェックが入らなかった項目が多いカテゴリを重点的に復習しましょう:

#### 環境操作が不安な場合
- 2.4節「コマンドラインの基礎」を復習
- ファイル作成と実行を繰り返し練習
- `pwd`, `ls`, `cd`などの基本コマンドを確認

#### プログラミングが不安な場合
- サンプルプログラムを何度も実行
- コードを少し変更して実験
- エラーメッセージを読んで理解する練習
- 簡単な関数から作り始める

#### AI協働が不安な場合
- Copilot活用ガイドを読み直す
- プロンプト例を実際に試す
- 生成されたコードを1行ずつ理解する
- 質問の仕方を工夫する

#### 概念理解が不安な場合
- この節の説明部分をもう一度読む
- なぜ関数を使うのかを考える
- PythonとRの違いを表にまとめる
- 実際のコードと照らし合わせる

---

### 🚀 次の節へ

チェック項目の70%以上（60項目以上）にチェックが入れば、次の節に進む準備ができています。

- 60項目未満の場合は、この節をもう一度復習してから次に進みましょう
- 特にB（プログラミング基礎スキル）とD（概念理解）が重要です

次の節では、**データ構造**（リスト、辞書など）を学びます。関数と組み合わせることで、より実践的なプログラムが書けるようになります。

**お疲れ様でした！** 関数はプログラミングの基礎中の基礎です。しっかりマスターして、次のステップに進みましょう！ 🎓✨
