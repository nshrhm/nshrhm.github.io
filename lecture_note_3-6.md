# 3.6 Rのパッケージ, Pythonのモジュール
## 📋 本節の目標

プログラミング言語には、言語自体に標準で含まれている機能と、追加で読み込むことで使えるようになる機能があります。この追加機能は、Rでは**パッケージ**、Pythonでは**モジュール**や**パッケージ**と呼ばれ、まとめて**ライブラリ**と総称されます。

本節では、こうした追加機能を読み込んで使う方法を学びます。

### 本節で学ぶこと

1. **Rのパッケージシステム**
   - パッケージとは何か
   - `library()`によるパッケージの読み込み
   - `install.packages()`によるインストール
   - よく使われるパッケージの紹介

2. **Pythonのモジュールシステム**
   - モジュール、パッケージ、ライブラリの違い
   - `import`文の4つの書き方
   - よく使われるライブラリの紹介
   - `pip install`によるインストール

3. **実践的な使い方**
   - データ分析でよく使うライブラリの活用
   - トラブルシューティング
   - GitHub Copilotとの協働

## 3.6.0 本節の準備
### 作業ディレクトリの確認

まず、適切な場所で作業できるように準備しましょう。

```bash
# ターミナルで以下を実行
$ cd ~/work
$ pwd
/home/datasci/work
```

本節では、パッケージやモジュールをインストールする操作も行います。仮想環境を有効にしておきましょう。

```bash
# 仮想環境の有効化
$ venvc
(class) $
```

プロンプトに `(class)` が表示されていることを確認してください。

### GitHub Copilotの確認

本節では、パッケージやモジュールを使った実践的なプログラムを書いていきます。GitHub Copilotは、こうしたライブラリの使い方を提案してくれる強力な味方です。

**確認事項:**
- VS Codeで GitHub Copilot が有効になっている
- Copilot Chat が使える状態である
- 必要に応じて Ctrl+I (Windows/Linux) でインラインチャットが開ける

### なぜパッケージ/モジュールが必要なのか

プログラミング言語の標準機能だけでも、多くのことができます。しかし、データサイエンスの実務では以下のような専門的な処理が必要になります：

- **データの読み込みと整形**: CSVファイル、Excelファイルの読み込み
- **統計分析**: 回帰分析、検定、機械学習
- **可視化**: グラフやチャートの作成
- **数値計算**: 行列演算、数学関数

これらを毎回ゼロから書くのは非効率的です。そこで、**よく使う機能をまとめたパッケージ/モジュール**を読み込んで使うのが一般的です。

**メリット:**
- ✅ 車輪の再発明をしなくて済む
- ✅ 実績のあるコードを使える
- ✅ 開発時間を大幅に短縮できる
- ✅ コミュニティの知識を活用できる

### 本節の学習の流れ

```
1. パッケージ/モジュールの概念を理解する
   ↓
2. 読み込み方（library, import）を学ぶ
   ↓
3. インストール方法を学ぶ
   ↓
4. 実際のライブラリを使ってみる
   ↓
5. GitHub Copilotと協働して実践する
```

それでは、Rのパッケージから見ていきましょう！

## 3.6.1 Rのパッケージ

### パッケージとライブラリの概念

Rでは、追加機能を**パッケージ**と呼びます。そして、パッケージをまとめて保管する場所を**ライブラリ**と呼びます。

**イメージ:**
```
ライブラリ（図書館）
├── パッケージA（本）
├── パッケージB（本）
└── パッケージC（本）
```

`library()` 関数は、「ライブラリから特定のパッケージを取り出して使えるようにする」機能です。

### library()によるパッケージの読み込み

最も基本的な使い方は以下の通りです：

```r
library(パッケージ名)
```

#### 📝 サンプル01: library()の基本的な使い方

**ファイル名**: `sample01_library_basic.R`

```r
# tidyverseパッケージの読み込み
# tidyverseはデータ分析のための便利な関数をまとめたパッケージ集
library(tidyverse)

# パッケージが読み込まれたことを確認
print("tidyverseパッケージを読み込みました")

# tidyverseに含まれるdplyrパッケージの関数を使ってみる
# データフレームを作成
my_data <- data.frame(
  name = c("Alice", "Bob", "Charlie"),
  score = c(85, 92, 78)
)

# データを表示
print(my_data)

# dplyrのfilter関数でスコアが80以上のデータを抽出
high_scores <- filter(my_data, score >= 80)
print("スコア80以上の学生:")
print(high_scores)
```

**実行方法:**
```bash
$ Rscript sample01_library_basic.R
```

**期待される出力:**
```
[1] "tidyverseパッケージを読み込みました"
     name score
1   Alice    85
2     Bob    92
3 Charlie    78
[1] "スコア80以上の学生:"
   name score
1 Alice    85
2   Bob    92
```

**ポイント:**
- `library(tidyverse)` でパッケージを読み込む
- 読み込み後は、そのパッケージの関数が使えるようになる
- `filter()` などの関数は tidyverse（正確には dplyr）が提供している

### パッケージのインストール

パッケージを初めて使う場合、まずインストールする必要があります。

#### エラーメッセージ: "there is no package called..."

以下のようなエラーが出た場合、パッケージがインストールされていません：

```r
Error in library(tidyverse) : 
  there is no package called 'tidyverse'
```

**対処法**: `install.packages()` でインストールします。

#### 📝 サンプル02: パッケージのインストール

**ファイル名**: `sample02_install_packages.R`

```r
# パッケージのインストール例
# 注意: 実際にインストールすると時間がかかるので、必要な時だけ実行してください

# 単一のパッケージをインストール
install.packages("dplyr")

# インストール完了後、パッケージを読み込む
library(dplyr)

print("dplyrパッケージをインストールして読み込みました")

# 簡単なデータ操作の例
my_numbers <- c(10, 20, 30, 40, 50)
print(paste("平均:", mean(my_numbers)))
```

**実行方法:**
```bash
$ Rscript sample02_install_packages.R
```

**注意点:**
- インストールは**一度だけ**行えば良い
- インターネット接続が必要
- インストールには時間がかかる場合がある
- 既にインストール済みの場合、再度実行する必要はない

#### 複数のパッケージを同時にインストール

複数のパッケージが必要な場合、ベクトルで指定してまとめてインストールできます：

```r
# 複数パッケージのインストール
install.packages(c("dplyr", "ggplot2", "readr"))
```

### パッケージ名::関数名の形式

パッケージを `library()` で読み込まずに、特定の関数だけを使いたい場合があります。その場合、`パッケージ名::関数名` という形式を使います。

#### 📝 サンプル03: パッケージ名::関数名の形式

**ファイル名**: `sample03_package_function.R`

```r
# パッケージを読み込まずに、直接関数を呼び出す例

# データフレームを作成
my_data <- data.frame(
  product = c("Apple", "Banana", "Cherry", "Date"),
  price = c(100, 80, 150, 200)
)

print("商品データ:")
print(my_data)

# dplyrパッケージのarrange関数を使って価格順にソート
# library(dplyr) せずに直接呼び出す
sorted_data <- dplyr::arrange(my_data, price)

print("価格順に並べ替え:")
print(sorted_data)

# dplyrのfilter関数で価格が100以上の商品を抽出
expensive <- dplyr::filter(my_data, price >= 100)

print("価格100以上の商品:")
print(expensive)
```

**実行方法:**
```bash
$ Rscript sample03_package_function.R
```

**期待される出力:**
```
[1] "商品データ:"
  product price
1   Apple   100
2  Banana    80
3  Cherry   150
4    Date   200
[1] "価格順に並べ替え:"
  product price
1  Banana    80
2   Apple   100
3  Cherry   150
4    Date   200
[1] "価格100以上の商品:"
  product price
1   Apple   100
2  Cherry   150
3    Date   200
```

**メリット:**
- どのパッケージの関数を使っているか明確になる
- 複数のパッケージに同名の関数がある場合の混乱を避けられる
- 一つの関数だけ使いたい場合に便利

### tidyverseパッケージの紹介

データサイエンスでRを使う場合、**tidyverse**は最もよく使われるパッケージ集です。

**tidyverseに含まれる主要パッケージ:**
- `dplyr`: データ操作（フィルタ、ソート、集計など）
- `ggplot2`: グラフ作成
- `readr`: CSVファイルの読み書き
- `tidyr`: データ整形
- `stringr`: 文字列操作
- `purrr`: 関数型プログラミング

#### 📝 サンプル04: tidyverseを使った簡単なデータ処理

**ファイル名**: `sample04_tidyverse_example.R`

```r
# tidyverseパッケージを読み込む
library(tidyverse)

# 学生の成績データを作成
students <- data.frame(
  name = c("Alice", "Bob", "Charlie", "David", "Eve"),
  math = c(85, 92, 78, 88, 95),
  english = c(90, 85, 88, 92, 87)
)

print("学生の成績データ:")
print(students)

# 数学の成績が85点以上の学生を抽出
high_math <- filter(students, math >= 85)
print("数学85点以上の学生:")
print(high_math)

# 数学の成績でソート（降順）
sorted_by_math <- arrange(students, desc(math))
print("数学の成績順:")
print(sorted_by_math)

# 数学と英語の平均点を計算
students$average <- (students$math + students$english) / 2
print("平均点を追加:")
print(students)
```

**実行方法:**
```bash
$ Rscript sample04_tidyverse_example.R
```

**期待される出力:**
```
[1] "学生の成績データ:"
     name math english
1   Alice   85      90
2     Bob   92      85
3 Charlie   78      88
4   David   88      92
5     Eve   95      87
[1] "数学85点以上の学生:"
  name math english
1 Alice   85      90
2   Bob   92      85
3 David   88      92
4   Eve   95      87
[1] "数学の成績順:"
     name math english
1     Eve   95      87
2     Bob   92      85
3   David   88      92
4   Alice   85      90
5 Charlie   78      88
[1] "平均点を追加:"
     name math english average
1   Alice   85      90    87.5
2     Bob   92      85    88.5
3 Charlie   78      88    83.0
4   David   88      92    90.0
5     Eve   95      87    91.0
```

### 複数のパッケージを同時に使う

実際のデータ分析では、複数のパッケージを組み合わせて使うことが一般的です。

#### 📝 サンプル05: 複数パッケージの同時使用

**ファイル名**: `sample05_multiple_packages.R`

```r
# 複数のパッケージを読み込む
library(dplyr)    # データ操作
library(readr)    # ファイル読み込み（この例では使わないが、通常はよく使う）

# サンプルデータ
sales_data <- data.frame(
  month = c("January", "February", "March", "April", "May"),
  sales = c(120, 135, 148, 162, 155),
  costs = c(80, 85, 90, 95, 92)
)

print("売上データ:")
print(sales_data)

# 利益を計算（売上 - コスト）
sales_data <- mutate(sales_data, profit = sales - costs)

print("利益を追加:")
print(sales_data)

# 売上の合計を計算
total_sales <- sum(sales_data$sales)
total_profit <- sum(sales_data$profit)

print(paste("総売上:", total_sales))
print(paste("総利益:", total_profit))

# 利益率を計算
sales_data <- mutate(sales_data, profit_rate = profit / sales * 100)

print("利益率を追加:")
print(sales_data)
```

**実行方法:**
```bash
$ Rscript sample05_multiple_packages.R
```

**期待される出力:**
```
[1] "売上データ:"
     month sales costs
1  January   120    80
2 February   135    85
3    March   148    90
4    April   162    95
5      May   155    92
[1] "利益を追加:"
     month sales costs profit
1  January   120    80     40
2 February   135    85     50
3    March   148    90     58
4    April   162    95     67
5      May   155    92     63
[1] "総売上: 720"
[1] "総利益: 278"
[1] "利益率を追加:"
     month sales costs profit profit_rate
1  January   120    80     40    33.33333
2 February   135    85     50    37.03704
3    March   148    90     58    39.18919
4    April   162    95     67    41.35802
5      May   155    92     63    40.64516
```

### パッケージの更新

インストール済みのパッケージは、定期的に更新されます。最新版に更新するには以下を実行してください。

```r
# すべてのパッケージを更新（確認なし）
update.packages(ask = FALSE)
```

---

### その他の入手先

通常、パッケージはCRAN（Comprehensive R Archive Network）からインストールされます。しかし、開発版や未公開のパッケージが必要な場合、GitHubから直接インストールすることもあります。

```r
# devtoolsパッケージが必要
install.packages("devtools")

# GitHubからパッケージをインストール
devtools::install_github("ユーザー名/パッケージ名")
```

### トラブルシューティング
#### 問題1: インストールが失敗する

**症状**: `install.packages()` がエラーで終了する

**考えられる原因と対処法:**
1. **インターネット接続**: ネットワークに接続されているか確認
2. **CRANミラー**: 別のミラーサイトを指定してみる
   ```r
   install.packages("パッケージ名", repos = "https://cran.ism.ac.jp/")
   ```
3. **権限**: 管理者権限が必要な場合がある

#### 問題2: パッケージが読み込めない

**症状**: `library()` でエラーが出る

**対処法:**
1. パッケージがインストールされているか確認
   ```r
   installed.packages()
   ```
2. 再インストールしてみる

#### 問題3: 関数が見つからない

**症状**: `Error: could not find function "関数名"`

**原因**: パッケージを読み込んでいない

**対処法:**
```r
library(必要なパッケージ)
```

## 💡 GitHub Copilot活用ガイド
### このセクションで学んだことをCopilotで実践

Rのパッケージシステムを理解したところで、GitHub Copilotを使って実践的なプログラムを書いてみましょう。Copilotは、どのパッケージを使うべきか、どの関数が適切かを提案してくれます。
パッケージを使ったデータ処理は、データサイエンスの基本です。Copilotと協働することで、効率的にパッケージの使い方を学べます。

### 🚀 使えるプロンプト例
#### プロンプト例1: パッケージを使ったデータ処理 [★☆☆]

**Copilot Chatに入力**:
```
Rで、tidyverseパッケージを使って、以下のデータ処理を行うプログラムを書いてください:
1. 5人の学生の名前と3科目（数学、英語、理科）の成績をデータフレームで作成
2. 各学生の平均点を計算
3. 平均点が80点以上の学生を抽出
4. 結果を表示

初心者向けに、コメントを丁寧に付けてください。
```

**期待される動作**:
- `library(tidyverse)` でパッケージを読み込むコード
- `data.frame()` でデータ作成
- `mutate()` で平均点を計算
- `filter()` で条件抽出
- 各ステップに日本語コメント

**やってみよう**:
1. Copilot Chatを開く（Ctrl+Alt+I または Command+Shift+I）
2. 上記のプロンプトを入力
3. 生成されたコードを `copilot_test01.R` として保存
4. `Rscript copilot_test01.R` で実行
5. コードを読んで、どの関数が何をしているか理解する

#### プロンプト例2: パッケージのインストールチェック [★★☆]

**Copilot Chatに入力**:
```
Rで、特定のパッケージがインストールされているかチェックし、
インストールされていなければインストールするコードを書いてください。
パッケージ名は "ggplot2" とします。
初心者向けに、動作を確認しやすいようにメッセージも表示してください。
```

**期待される動作**:
- パッケージの存在確認
- 条件分岐でインストール処理
- ユーザーへのメッセージ表示

**やってみよう**:
1. 生成されたコードを確認
2. `if` 文でどのように条件分岐しているか理解する
3. 既にインストール済みのパッケージと、未インストールのパッケージで動作を試す
4. メッセージが適切に表示されるか確認

#### プロンプト例3: 複数パッケージを使ったデータ分析 [★★★]

**Copilot Chatに入力**:
```
Rで、dplyrとggplot2を使って、以下のデータ分析を行うプログラムを書いてください:
1. 月別の売上データ（12ヶ月分）を作成
2. 売上の基本統計量（平均、最大、最小）を計算
3. 売上が平均以上の月を抽出
4. 結果をわかりやすく表示

初心者向けに、各処理の意味をコメントで説明してください。
```

**期待される動作**:
- 複数パッケージの読み込み
- データ作成と基本統計の計算
- 条件抽出と結果の整形
- 分かりやすい出力

**やってみよう**:
1. 生成されたコードを段階的に実行
2. 各パッケージの関数が何をしているか確認
3. データを変更して（例: 売上金額を変える）動作を確認
4. 他の条件（最大値の70%以上など）でも試してみる

### 📚 Copilot活用のコツ

1. **パッケージ名を明示する**
   - ❌ 「データ処理をするコードを書いて」
   - ✅ 「tidyverseパッケージを使ってデータ処理をするコードを書いて」
   
   パッケージ名を指定することで、より適切なコードが生成されます。

2. **段階的に機能を追加する**
   ```
   ステップ1: まずデータを作成するコードを生成
   ステップ2: データ処理を追加
   ステップ3: 結果の表示を改善
   ```
   
   一度に全部ではなく、段階的に機能を追加していくと理解しやすくなります。

3. **生成されたコードを必ず理解する**
   - どのパッケージの関数を使っているか確認
   - 各関数の役割を調べる
   - わからない部分はCopilotに質問する
   
   例: 「このfilter関数は何をしていますか？」

4. **エラーが出たらCopilotに聞く**
   ```
   「このエラーメッセージの意味を教えて: Error in library(xxx) : there is no package called 'xxx'」
   ```
   
   Copilotは、エラーの原因と対処法を説明してくれます。

### ⚠️ 注意事項

- **AIは完璧ではない**: 生成されたコードが動かない場合もあります。エラーメッセージをよく読み、必要に応じてCopilotに質問しましょう。
- **理解が第一**: コードをコピー&ペーストするだけでなく、各行が何をしているか理解することが大切です。
- **パッケージのインストール**: Copilotが提案するパッケージが未インストールの場合、`install.packages()` で先にインストールしてください。
- **自分で考える**: Copilotは提案をしてくれますが、最終的な判断は自分で行います。「なぜこのパッケージを使うのか」「他の方法はないか」と考える習慣を付けましょう。

### 🎓 推奨される学習の流れ

```
1. 教材を読んでパッケージの概念を理解
   ↓
2. サンプルプログラムを実行して動作を確認
   ↓
3. Copilotに簡単なプロンプトを入力して実験
   ↓
4. 生成されたコードを読んで理解する
   ↓
5. 自分でコードを少し変更してみる
   ↓
6. うまくいかない部分はCopilotに質問
   ↓
7. 練習問題で定着させる
```

**大切なのは「AIと協働する」姿勢です。丸投げではなく、一緒に学ぶパートナーとして活用しましょう！**


---

## 3.6.2 Pythonのモジュール
### モジュール、パッケージ、ライブラリの概念

Pythonでは、追加機能について以下のような用語が使われます。

- **モジュール**: 単一のPythonファイル（`.py`）。関数やクラスをまとめたもの
- **パッケージ**: 複数のモジュールをまとめたもの（ディレクトリ構造）
- **ライブラリ**: モジュールやパッケージの総称

実際の会話では、これらの用語は厳密に区別されず、「ライブラリ」という言葉がよく使われます。

**イメージ:**
```
ライブラリ（図書館）
├── パッケージA（棚）
│   ├── モジュール1（本）
│   └── モジュール2（本）
└── パッケージB（棚）
    └── モジュール3（本）
```

### Pythonの主要なライブラリ
データサイエンスでよく使われるライブラリには、以下のものがあります。

#### 標準ライブラリ（Pythonに最初から付属）
- `math`: 数学関数
- `random`: 乱数生成
- `datetime`: 日付・時刻処理
- `os`: オペレーティングシステム機能

#### 外部ライブラリ（インストールが必要）
- `NumPy`: 数値計算、配列操作
- `pandas`: データ分析、表形式データ処理
- `matplotlib`: グラフ作成
- `SciPy`: 科学計算
- `scikit-learn`: 機械学習

本節では、これらのライブラリを使う方法を学びます。

### import文の4つの方法
Pythonでモジュールやパッケージを読み込むには、`import`文を使います。基本的な4つの書き方を見ていきましょう。

#### 方法1: `import 名前`
最も基本的な形式です。モジュール全体を読み込み、`モジュール名.関数名` の形式で使います。

##### 📝 サンプル06: 基本的なimport
**ファイル名**: `sample06_import_basic.py`

```python
# 標準ライブラリのmathモジュールを読み込む
import math

# 円周率を表示
print(f"円周率: {math.pi}")

# 平方根を計算
number = 16
sqrt_result = math.sqrt(number)
print(f"{number}の平方根: {sqrt_result}")

# 三角関数を使う
angle = 45  # 度
angle_rad = math.radians(angle)  # ラジアンに変換
sin_value = math.sin(angle_rad)
print(f"sin({angle}度) = {sin_value}")

# 対数を計算
log_result = math.log(10)
print(f"log(10) = {log_result}")
```

**実行方法:**
```bash
$ python sample06_import_basic.py
```

**期待される出力:**
```
円周率: 3.141592653589793
16の平方根: 4.0
sin(45度) = 0.7071067811865475
log(10) = 2.302585092994046
```

**ポイント:**
- `import math` でmathモジュール全体を読み込む
- 使うときは `math.pi`, `math.sqrt()` のように `math.` を付ける
- どのモジュールの機能を使っているか明確

#### 方法2: `import 名前 as 別名` ★推奨★
モジュール名が長い場合や、慣習的に短い別名を使う場合に便利です。これが**最も推奨される方法**です。

##### 📝 サンプル07: import asの使い方（推奨パターン）
**ファイル名**: `sample07_import_as.py`

```python
# NumPyを慣習的な別名npで読み込む
import numpy as np

# 配列（アレイ）を作成
my_array = np.array([1, 2, 3, 4, 5])
print("配列:")
print(my_array)

# 配列の平均を計算
average = np.mean(my_array)
print(f"平均: {average}")

# 配列の合計を計算
total = np.sum(my_array)
print(f"合計: {total}")

# 配列の最大値と最小値
max_value = np.max(my_array)
min_value = np.min(my_array)
print(f"最大値: {max_value}")
print(f"最小値: {min_value}")

# 0から9までの配列を作成
range_array = np.arange(10)
print("0から9までの配列:")
print(range_array)
```

**実行方法:**
```bash
$ python sample07_import_as.py
```

**期待される出力:**
```
配列:
[1 2 3 4 5]
平均: 3.0
合計: 15
最大値: 5
最小値: 1
0から9までの配列:
[0 1 2 3 4 5 6 7 8 9]
```

**ポイント:**
- `import numpy as np` で、`numpy`を`np`という短い名前で使える
- 業界の慣習として、NumPyは`np`、pandasは`pd`と略すのが一般的
- コードが簡潔になり、他の人のコードとも統一しやすい

**慣習的な別名:**
```python
import numpy as np          # NumPy → np
import pandas as pd         # pandas → pd
import matplotlib.pyplot as plt  # matplotlib.pyplot → plt
```

#### 方法3: `from 名前 import 要素名`
特定の関数やクラスだけを直接使いたい場合に便利です。

##### 📝 サンプル08: from importの使い方
**ファイル名**: `sample08_from_import.py`

```python
# mathモジュールから特定の関数だけを読み込む
from math import sqrt, pi, sin, radians

# 直接関数名で使える（math.を付けない）
print(f"円周率: {pi}")

# 平方根を計算
number = 25
result = sqrt(number)
print(f"{number}の平方根: {result}")

# 三角関数を計算
angle = 30  # 度
angle_rad = radians(angle)
sin_value = sin(angle_rad)
print(f"sin({angle}度) = {sin_value}")

# NumPyから特定の関数を読み込む例
from numpy import array, mean, sum

# 配列を作成
my_numbers = array([10, 20, 30, 40, 50])
print(f"配列: {my_numbers}")
print(f"平均: {mean(my_numbers)}")
print(f"合計: {sum(my_numbers)}")
```

**実行方法:**
```bash
$ python sample08_from_import.py
```

**期待される出力:**
```
円周率: 3.141592653589793
25の平方根: 5.0
sin(30度) = 0.49999999999999994
配列: [10 20 30 40 50]
平均: 30.0
合計: 150
```

**ポイント:**
- `from math import sqrt` で、`sqrt()`を直接使える
- `math.sqrt()` ではなく `sqrt()` と書ける
- 複数の要素は カンマ`,` で区切って指定
- コードは短くなるが、どのモジュールの関数か分かりにくくなる場合も

#### 方法4: `from 名前 import *` ⚠️非推奨
モジュールのすべての要素を直接使えるようにします。しかし、**この方法は推奨されません**。

```python
# この書き方は避けましょう
from numpy import *

# すべての関数が直接使えるが...
my_array = array([1, 2, 3])  # どのモジュールのarrayか不明確
result = mean(my_array)      # どのモジュールのmeanか不明確
```

**なぜ非推奨なのか:**
- どのモジュールの機能を使っているか分からなくなる
- 異なるモジュールに同名の関数があると混乱する
- チーム開発や公開するコードでは特に避けるべき
- コードの可読性が低下する

**本書では、この方法は今後使いません。**

### どの方法を使うべきか？
実務では、以下の使い分けが推奨されます。

| 状況 | 推奨される方法 | 例 |
|------|--------------|-----|
| NumPy, pandasなど頻繁に使うライブラリ | `import as` | `import numpy as np` |
| 標準ライブラリ全般 | `import` | `import math` |
| 特定の関数を少しだけ使う | `from import` | `from math import sqrt` |
| すべてをインポート | **使わない** | ~~`from numpy import *`~~ |

**迷ったら `import as` を使いましょう！**

### NumPyを使った実例
NumPyは、数値計算のための最も重要なライブラリです。配列（array）を使った高速な計算ができます。

##### 📝 サンプル09: NumPyを使った数値計算
**ファイル名**: `sample09_numpy_example.py`

```python
# NumPyを慣習的な別名で読み込む
import numpy as np

# 1次元配列を作成
temperatures = np.array([22.5, 24.0, 23.5, 25.0, 26.5, 24.5, 23.0])
print("今週の気温（℃）:")
print(temperatures)

# 基本統計量を計算
print(f"平均気温: {np.mean(temperatures):.2f}℃")
print(f"最高気温: {np.max(temperatures):.2f}℃")
print(f"最低気温: {np.min(temperatures):.2f}℃")
print(f"標準偏差: {np.std(temperatures):.2f}℃")

# 配列の演算（すべての要素に対して計算）
fahrenheit = temperatures * 9/5 + 32
print("華氏温度:")
print(fahrenheit)

# 条件に合う要素を抽出
hot_days = temperatures[temperatures >= 25.0]
print("25℃以上の日の気温:")
print(hot_days)

# 2次元配列（行列）を作成
matrix = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])
print("3×3行列:")
print(matrix)
print(f"行列の合計: {np.sum(matrix)}")
```

**実行方法:**
```bash
$ python sample09_numpy_example.py
```

**期待される出力:**
```
今週の気温（℃）:
[22.5 24.  23.5 25.  26.5 24.5 23. ]
平均気温: 24.14℃
最高気温: 26.50℃
最低気温: 22.50℃
標準偏差: 1.34℃
華氏温度:
[72.5 75.2 74.3 77.  79.7 76.1 73.4]
25℃以上の日の気温:
[25.  26.5]
3×3行列:
[[1 2 3]
 [4 5 6]
 [7 8 9]]
行列の合計: 45
```

**NumPyの利点:**
- 配列全体に対する高速な計算
- 豊富な数学関数
- 多次元配列（行列、テンソル）のサポート
- メモリ効率が良い

### pandasを使った実例
pandasは、表形式のデータ（スプレッドシートのようなデータ）を扱うためのライブラリです。

##### 📝 サンプル10: pandasを使ったデータ処理
**ファイル名**: `sample10_pandas_example.py`

```python
# pandasを慣習的な別名で読み込む
import pandas as pd

# データフレーム（表形式のデータ）を作成
students = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'math': [85, 92, 78, 88, 95],
    'english': [90, 85, 88, 92, 87],
    'science': [88, 90, 85, 87, 92]
})

print("学生の成績データ:")
print(students)
print()

# 基本統計量を表示
print("各科目の基本統計量:")
print(students.describe())
print()

# 各学生の平均点を計算
students['average'] = students[['math', 'english', 'science']].mean(axis=1)
print("平均点を追加:")
print(students)
print()

# 平均点が85点以上の学生を抽出
high_performers = students[students['average'] >= 85]
print("平均85点以上の学生:")
print(high_performers)
print()

# 数学の成績でソート（降順）
sorted_by_math = students.sort_values('math', ascending=False)
print("数学の成績順:")
print(sorted_by_math)
```

**実行方法:**
```bash
$ python sample10_pandas_example.py
```

**期待される出力:**
```
学生の成績データ:
      name  math  english  science
0    Alice    85       90       88
1      Bob    92       85       90
2  Charlie    78       88       85
3    David    88       92       87
4      Eve    95       87       92

各科目の基本統計量:
            math    english    science
count   5.000000   5.000000   5.000000
mean   87.600000  88.400000  88.400000
std     6.653299   2.880972   2.880972
min    78.000000  85.000000  85.000000
25%    85.000000  87.000000  87.000000
50%    88.000000  88.000000  88.000000
75%    92.000000  90.000000  90.000000
max    95.000000  92.000000  92.000000

平均点を追加:
      name  math  english  science    average
0    Alice    85       90       88  87.666667
1      Bob    92       85       90  89.000000
2  Charlie    78       88       85  83.666667
3    David    88       92       87  89.000000
4      Eve    95       87       92  91.333333

平均85点以上の学生:
    name  math  english  science    average
0  Alice    85       90       88  87.666667
1    Bob    92       85       90  89.000000
3  David    88       92       87  89.000000
4    Eve    95       87       92  91.333333

数学の成績順:
      name  math  english  science    average
4      Eve    95       87       92  91.333333
1      Bob    92       85       90  89.000000
3    David    88       92       87  89.000000
0    Alice    85       90       88  87.666667
2  Charlie    78       88       85  83.666667
```

**pandasの利点:**
- 表形式データの直感的な操作
- CSVやExcelファイルの読み書き
- 欠損値の処理
- グループ化と集計
- データベースのような操作

### ライブラリのインストール
外部ライブラリを使うには、まずインストールする必要があります。

#### pipによるインストール
Pythonのパッケージマネージャー `pip` を使います。

**基本的な使い方:**
```bash
# 仮想環境を有効化してから実行
(class) $ pip install パッケージ名
```

**具体例:**
```bash
# NumPyをインストール
(class) $ pip install numpy

# pandasをインストール
(class) $ pip install pandas

# matplotlibをインストール
(class) $ pip install matplotlib
```

**複数のパッケージを同時にインストール:**
```bash
(class) $ pip install numpy pandas matplotlib
```

#### ModuleNotFoundError への対処

以下のようなエラーが出た場合、ライブラリがインストールされていません。

```python
ModuleNotFoundError: No module named 'numpy'
```

**対処法:**

1. **ターミナルでインストール（推奨）:**
   ```bash
   (class) $ pip install numpy
   ```

2. **Jupyter Notebookの場合:**
   ```python
   !pip install numpy
   ```
   （先頭に `!` を付ける）

#### インストール済みパッケージの確認

```bash
# インストール済みのパッケージ一覧を表示
(class) $ pip list

# 特定のパッケージがインストールされているか確認
(class) $ pip show numpy
```

#### パッケージのアップグレード

```bash
# 特定のパッケージを最新版に更新
(class) $ pip install --upgrade numpy

# pipそのものを更新
(class) $ pip install --upgrade pip
```

### トラブルシューティング

#### 問題1: インストールが失敗する

**症状**: `pip install` がエラーで終了する

**考えられる原因と対処法:**

1. **インターネット接続**: ネットワークに接続されているか確認

2. **仮想環境の確認**: プロンプトに `(class)` が表示されているか確認
   ```bash
   # 表示されていなければ
   $ venvc
   ```

3. **権限の問題**: まれに管理者権限が必要な場合がある
   ```bash
   # システム全体にインストール（非推奨）
   $ pip install --user パッケージ名
   ```

#### 問題2: importしてもエラーが出る

**症状**: インストールしたはずなのに `ModuleNotFoundError`

**原因**: 異なるPython環境にインストールした可能性

**対処法:**
1. 仮想環境が有効か確認
   ```bash
   $ which python
   /home/datasci/venv/class/bin/python  # これが表示されればOK
   ```

2. 仮想環境内で再インストール
   ```bash
   (class) $ pip install numpy
   ```

#### 問題3: 古いバージョンのパッケージ

**症状**: コードが動かない、非推奨の警告が出る

**対処法:**
```bash
# パッケージを最新版に更新
(class) $ pip install --upgrade パッケージ名
```

### 標準ライブラリと外部ライブラリの違い

| 項目 | 標準ライブラリ | 外部ライブラリ |
|------|--------------|--------------|
| インストール | 不要（Python付属） | 必要（pip install） |
| 例 | math, random, os | numpy, pandas, matplotlib |
| 読み込み | `import math` | `import numpy as np` |
| 用途 | 基本的な機能 | 専門的な機能 |

## 📚 参考: より実践的な書き方
ここまでは、モジュールを直接読み込んで使う基本的な方法を学びました。実務では、以下のようなより構造化されたコードを書くこともあります。

**現時点では基本版で十分です。**意欲的な学生は、参考として以下のコードを見てみてください。

### 発展版サンプル: エラーハンドリング付きインポート

**ファイル名**: `sample07_advanced.py`

```python
"""
モジュールのインポートを安全に行う発展的な例

このプログラムは、モジュールが存在しない場合の
エラーハンドリングを含みます。
"""

def safe_import_and_calculate():
    """
    NumPyを安全にインポートして計算を行う関数
    
    Returns:
        bool: 成功した場合True、失敗した場合False
    """
    try:
        import numpy as np
        print("NumPyのインポートに成功しました")
        
        # 計算を実行
        data = np.array([1, 2, 3, 4, 5])
        mean_value = np.mean(data)
        
        print(f"データ: {data}")
        print(f"平均: {mean_value}")
        
        return True
        
    except ModuleNotFoundError:
        print("エラー: NumPyがインストールされていません")
        print("以下のコマンドでインストールしてください:")
        print("  pip install numpy")
        return False
    
    except Exception as e:
        print(f"予期しないエラーが発生しました: {e}")
        return False

def main():
    """メイン処理"""
    print("=== NumPyを使った計算プログラム ===")
    
    success = safe_import_and_calculate()
    
    if success:
        print("\n処理が正常に完了しました")
    else:
        print("\n処理が失敗しました")

if __name__ == "__main__":
    main()
```

**発展版の特徴:**
- エラーハンドリング（try-except）
- 関数化による構造化
- docstringによるドキュメント
- main関数による明確なエントリーポイント

**いつこの書き方を学ぶべきか:**
- 基本的なimportに慣れてから
- より大規模なプログラムを書くとき
- チームでコードを共有するとき

---

## 💡 GitHub Copilot活用ガイド
### このセクションで学んだことをCopilotで実践

Pythonのモジュールシステムを理解したところで、GitHub Copilotを使って実践的なプログラムを書いてみましょう。Copilotは、適切なライブラリの選択や、慣習的な書き方（`import numpy as np`など）を提案してくれます。
モジュールを使いこなすことは、Pythonでのデータサイエンスの第一歩です。Copilotと協働して、効率的に学習を進めましょう。

### 🚀 使えるプロンプト例
#### プロンプト例1: NumPyを使った基本的な計算 [★☆☆]

**Copilot Chatに入力**:
```
Pythonで、NumPyを使って以下の計算を行うプログラムを書いてください:
1. 1から10までの整数の配列を作成
2. 配列の合計、平均、最大値、最小値を計算
3. 結果をわかりやすく表示

初心者向けに、import文から含めて、コメントを丁寧に付けてください。
```

**期待される動作**:
- `import numpy as np` で始まる
- `np.array()` または `np.arange()` で配列作成
- `np.sum()`, `np.mean()` などの関数を使用
- 各ステップに日本語コメント

**やってみよう**:
1. Copilot Chatを開く
2. 上記のプロンプトを入力
3. 生成されたコードを `copilot_test02.py` として保存
4. `python copilot_test02.py` で実行
5. コードを読んで、各関数の役割を理解する
6. 配列の範囲を変えて（1から20など）実験してみる

#### プロンプト例2: pandasでデータフレームを作成 [★★☆]

**Copilot Chatに入力**:
```
Pythonで、pandasを使って以下の処理を行うプログラムを書いてください:
1. 5つの商品名（Apple, Banana, Cherry, Date, Elderberry）と
   それぞれの価格（100, 80, 150, 200, 120）をデータフレームで作成
2. 価格の平均を計算
3. 価格が100以上の商品を抽出
4. 価格順に並べ替えて表示

初心者向けに、各ステップをコメントで説明してください。
```

**期待される動作**:
- `import pandas as pd` で始まる
- `pd.DataFrame()` でデータ作成
- `mean()`, フィルタリング, `sort_values()` の使用
- わかりやすい出力

**やってみよう**:
1. 生成されたコードを確認
2. データフレームの構造を理解する
3. 商品や価格を変更して動作を確認
4. 他の条件（価格が150以下など）でもフィルタリングしてみる

#### プロンプト例3: 複数のライブラリを組み合わせる [★★☆]

**Copilot Chatに入力**:
```
Pythonで、NumPyとpandasを組み合わせて、以下の処理を行うプログラムを書いてください:
1. NumPyで10個のランダムな整数（1-100の範囲）を生成
2. そのデータをpandasのデータフレームに変換
3. 基本統計量（平均、中央値、最大、最小）を計算
4. 平均以上の値を抽出して表示

初心者向けに、なぜ各ライブラリを使うのかコメントで説明してください。
```

**期待される動作**:
- NumPyとpandasの両方をインポート
- `np.random.randint()` でランダム生成
- pandasで統計計算
- 条件抽出

**やってみよう**:
1. NumPyの乱数生成機能を理解する
2. pandasでの統計計算方法を確認する
3. 実行するたびに異なる結果になることを確認
4. ランダム生成の範囲や個数を変えて実験

#### プロンプト例4: import方法の比較 [★★★]

**Copilot Chatに入力**:
```
Pythonで、import文の3つの方法（import, import as, from import）を
それぞれ使って、mathモジュールの平方根を計算するコードを書いてください。
3つの方法の違いを初心者にわかりやすくコメントで説明してください。
```

**期待される動作**:
- 3つの異なるimport方法の提示
- それぞれのメリット・デメリットの説明
- 実際の使用例

**やってみよう**:
1. 各import方法の違いを理解する
2. どの方法が読みやすいか考える
3. 実務でどの方法を選ぶべきか判断する基準を学ぶ

### 📚 Copilot活用のコツ

1. **ライブラリ名を明示する**
   - ❌ 「配列を作って計算して」
   - ✅ 「NumPyを使って配列を作成し、平均を計算して」
   
   具体的なライブラリ名を指定すると、より適切なコードが生成されます。

2. **慣習的な書き方を学ぶ**
   ```
   「NumPyとpandasの慣習的なimport文を教えて」
   ```
   
   業界標準の書き方（`np`, `pd`など）を学べます。

3. **エラーメッセージを活用する**
   ```
   「ModuleNotFoundError: No module named 'numpy' というエラーが出ました。どうすれば良いですか？」
   ```
   
   Copilotは、エラーの原因と対処法を教えてくれます。

4. **段階的に学習する**
   ```
   ステップ1: まず基本的なimport文を生成
   ステップ2: 簡単な計算を追加
   ステップ3: データフレームを使った処理に発展
   ```

5. **比較して学ぶ**
   ```
   「NumPyとpandasでそれぞれ平均を計算する方法を比較して」
   ```
   
   異なるライブラリの使い分けを理解できます。

### ⚠️ 注意事項
- **インストールが必要**: Copilotが提案するライブラリが未インストールの場合、まず `pip install` でインストールしてください。
- **バージョンの違い**: ライブラリのバージョンによって、一部の機能や書き方が異なる場合があります。エラーが出たら、Copilotに最新の書き方を聞いてみましょう。
- **慣習を理解する**: `import numpy as np` のような慣習的な書き方は、他の人のコードを読む際にも重要です。積極的に慣習を学びましょう。
- **理解してから使う**: 生成されたコードをコピー&ペーストするだけでなく、各行が何をしているか理解することが大切です。わからない部分は、Copilotに質問しましょう。
   ```
   「この np.mean() は何をする関数ですか？」
   ```
- **ドキュメントも参照**: 重要なライブラリについては、公式ドキュメントも参照すると理解が深まります。Copilotにドキュメントのリンクを聞いてみましょう。

### 🎓 推奨される学習の流れ

```
1. 教材を読んでimport文の種類を理解
   ↓
2. サンプルプログラムを実行して動作を確認
   ↓
3. Copilotに簡単なプロンプトを入力
   ↓
4. 生成されたコードの各行を理解する
   ↓
5. NumPyやpandasの公式ドキュメントを参照
   ↓
6. 自分でコードを改変してみる
   ↓
7. エラーが出たらCopilotに質問
   ↓
8. 練習問題で定着させる
```

**大切なのは「どのライブラリを、いつ、どう使うか」を判断できるようになることです。Copilotはその判断を助けてくれる強力なツールです！**

---

## 3.6.3 統合演習

ここまで学んだ知識を使って、実践的なデータ分析プログラムを作成しましょう。RとPythonの両方で、パッケージ/モジュールを使ったデータ処理を行います。

---

### 演習課題: 月別売上データの分析
#### 📋 課題の目的
あなたは、小売店の売上データを分析する担当者です。12ヶ月分の月別売上データが与えられたので、基本的な統計分析を行い、経営判断に役立つ情報を抽出してください。

この課題を通じて、以下のスキルを実践します。
- Rのパッケージ（tidyverse/dplyr）を使ったデータ処理
- Pythonのモジュール（pandas/NumPy）を使ったデータ処理
- 基本的な統計計算
- データのフィルタリングとソート

#### 📊 入力データ

以下の12ヶ月分の売上データを使用します。

| 月 | 売上（万円） |
|----|------------|
| 1月 | 450 |
| 2月 | 420 |
| 3月 | 480 |
| 4月 | 510 |
| 5月 | 530 |
| 6月 | 490 |
| 7月 | 520 |
| 8月 | 550 |
| 9月 | 500 |
| 10月 | 540 |
| 11月 | 580 |
| 12月 | 620 |

#### 🎯 実装する機能
以下の分析を、**RとPythonの両方**で実装してください。

1. **データの作成**
   - 月と売上のデータを作成する

2. **基本統計量の計算**
   - 年間の総売上
   - 月平均売上
   - 最高売上とその月
   - 最低売上とその月

3. **条件抽出**
   - 売上が500万円以上の月を抽出

4. **ソート**
   - 売上の多い順に並べ替える

5. **結果の表示**
   - 分析結果をわかりやすく表示する

#### ✅ 期待される出力

**プログラムの実行結果として、以下のような情報が表示されること：**

```
=== 売上データ分析 ===

【基本統計量】
年間総売上: 6190万円
月平均売上: 515.83万円
最高売上: 620万円 (12月)
最低売上: 420万円 (2月)

【売上500万円以上の月】
4月: 510万円
5月: 530万円
7月: 520万円
8月: 550万円
10月: 540万円
11月: 580万円
12月: 620万円

【売上ランキング（上位5位）】
1位: 12月 - 620万円
2位: 11月 - 580万円
3位: 8月 - 550万円
4位: 10月 - 540万円
5位: 5月 - 530万円
```

#### 📝 提出形式

以下の2つのファイルを作成してください。

1. **Rバージョン**: `exercise01_sales_analysis.R`
   - dplyrまたはtidyverseパッケージを使用
   - library()でパッケージを読み込む
   - コメントで各処理を説明

2. **Pythonバージョン**: `exercise01_sales_analysis.py`
   - pandasまたはNumPyを使用
   - import文で適切にモジュールを読み込む
   - コメントで各処理を説明

**両方のプログラムが、同じ分析結果を出力すること。**

#### 🌟 評価基準

| 項目 | 配点 |
|------|------|
| データを正しく作成できている | 20点 |
| 基本統計量を正しく計算できている | 30点 |
| 条件抽出が正しく動作する | 20点 |
| ソートが正しく動作する | 15点 |
| 結果が読みやすく表示されている | 10点 |
| コメントが適切に記述されている | 5点 |
| **合計** | **100点** |

#### 💡 ヒント

**Rで使えるパッケージと関数:**
- `library(dplyr)` または `library(tidyverse)`
- `data.frame()` でデータ作成
- `sum()`, `mean()`, `max()`, `min()` で統計計算
- `filter()` で条件抽出
- `arrange()` でソート
- `desc()` で降順ソート

**Pythonで使えるモジュールと関数:**
- `import pandas as pd` または `import numpy as np`
- `pd.DataFrame()` でデータ作成
- `.sum()`, `.mean()`, `.max()`, `.min()` で統計計算
- `[]` や `.query()` で条件抽出
- `.sort_values()` でソート

**困ったときは:**
- GitHub Copilotに質問する
- サンプルプログラムを参考にする
- 教材の該当セクションを読み返す

### 解答例（基本版）
以下は、課題の解答例です。自分で取り組んだ後に確認してください。

#### 📝 Rバージョンの解答例
**ファイル名**: `exercise01_sales_analysis.R`

```r
# パッケージの読み込み
library(dplyr)

# === データの作成 ===
sales_data <- data.frame(
  month = c("1月", "2月", "3月", "4月", "5月", "6月", 
            "7月", "8月", "9月", "10月", "11月", "12月"),
  sales = c(450, 420, 480, 510, 530, 490, 
            520, 550, 500, 540, 580, 620)
)

print("=== 売上データ分析 ===")
print("")

# === 基本統計量の計算 ===
total_sales <- sum(sales_data$sales)
average_sales <- mean(sales_data$sales)
max_sales <- max(sales_data$sales)
min_sales <- min(sales_data$sales)

# 最高売上の月を特定
max_month <- sales_data$month[sales_data$sales == max_sales]
# 最低売上の月を特定
min_month <- sales_data$month[sales_data$sales == min_sales]

print("【基本統計量】")
print(paste("年間総売上:", total_sales, "万円"))
print(paste("月平均売上:", round(average_sales, 2), "万円"))
print(paste("最高売上:", max_sales, "万円 (", max_month, ")", sep=""))
print(paste("最低売上:", min_sales, "万円 (", min_month, ")", sep=""))
print("")

# === 条件抽出: 売上500万円以上 ===
high_sales <- filter(sales_data, sales >= 500)

print("【売上500万円以上の月】")
for (i in 1:nrow(high_sales)) {
  print(paste(high_sales$month[i], ": ", high_sales$sales[i], "万円", sep=""))
}
print("")

# === ソート: 売上の多い順 ===
sorted_sales <- arrange(sales_data, desc(sales))

print("【売上ランキング（上位5位）】")
for (i in 1:5) {
  print(paste(i, "位: ", sorted_sales$month[i], " - ", 
              sorted_sales$sales[i], "万円", sep=""))
}
```

**実行方法:**
```bash
$ Rscript exercise01_sales_analysis.R
```

#### 📝 Pythonバージョンの解答例

**ファイル名**: `exercise01_sales_analysis.py`

```python
# モジュールの読み込み
import pandas as pd

# === データの作成 ===
sales_data = pd.DataFrame({
    'month': ['1月', '2月', '3月', '4月', '5月', '6月',
              '7月', '8月', '9月', '10月', '11月', '12月'],
    'sales': [450, 420, 480, 510, 530, 490,
              520, 550, 500, 540, 580, 620]
})

print("=== 売上データ分析 ===")
print()

# === 基本統計量の計算 ===
total_sales = sales_data['sales'].sum()
average_sales = sales_data['sales'].mean()
max_sales = sales_data['sales'].max()
min_sales = sales_data['sales'].min()

# 最高売上の月を特定
max_month = sales_data[sales_data['sales'] == max_sales]['month'].values[0]
# 最低売上の月を特定
min_month = sales_data[sales_data['sales'] == min_sales]['month'].values[0]

print("【基本統計量】")
print(f"年間総売上: {total_sales}万円")
print(f"月平均売上: {average_sales:.2f}万円")
print(f"最高売上: {max_sales}万円 ({max_month})")
print(f"最低売上: {min_sales}万円 ({min_month})")
print()

# === 条件抽出: 売上500万円以上 ===
high_sales = sales_data[sales_data['sales'] >= 500]

print("【売上500万円以上の月】")
for index, row in high_sales.iterrows():
    print(f"{row['month']}: {row['sales']}万円")
print()

# === ソート: 売上の多い順 ===
sorted_sales = sales_data.sort_values('sales', ascending=False)

print("【売上ランキング（上位5位）】")
for i, (index, row) in enumerate(sorted_sales.head(5).iterrows(), 1):
    print(f"{i}位: {row['month']} - {row['sales']}万円")
```

**実行方法:**
```bash
$ python exercise01_sales_analysis.py
```

### 📚 参考: より実践的な書き方（発展版）

**現時点では基本版で十分です。**意欲的な学生は、以下の発展版も参考にしてください。

#### 発展版のポイント

1. **関数化**: 処理を関数にまとめる
2. **エラーハンドリング**: データの妥当性チェック
3. **可視化**: グラフでの表示（matplotlib使用）
4. **CSV読み込み**: 外部ファイルからデータを読む

#### 📝 Pythonバージョンの発展版

**ファイル名**: `exercise01_advanced.py`

```python
"""
月別売上データの分析プログラム（発展版）

このプログラムは、売上データの統計分析を行い、
結果を整形して表示します。
"""

import pandas as pd
import numpy as np

def load_sales_data():
    """
    売上データを作成する
    
    Returns:
        pd.DataFrame: 売上データ
    """
    data = pd.DataFrame({
        'month': ['1月', '2月', '3月', '4月', '5月', '6月',
                  '7月', '8月', '9月', '10月', '11月', '12月'],
        'sales': [450, 420, 480, 510, 530, 490,
                  520, 550, 500, 540, 580, 620]
    })
    return data

def calculate_statistics(df):
    """
    基本統計量を計算する
    
    Args:
        df (pd.DataFrame): 売上データ
        
    Returns:
        dict: 統計情報を含む辞書
    """
    stats = {
        'total': df['sales'].sum(),
        'average': df['sales'].mean(),
        'max': df['sales'].max(),
        'min': df['sales'].min(),
        'max_month': df[df['sales'] == df['sales'].max()]['month'].values[0],
        'min_month': df[df['sales'] == df['sales'].min()]['month'].values[0]
    }
    return stats

def filter_high_sales(df, threshold=500):
    """
    指定した売上以上のデータを抽出
    
    Args:
        df (pd.DataFrame): 売上データ
        threshold (int): 閾値（デフォルト: 500）
        
    Returns:
        pd.DataFrame: フィルタされたデータ
    """
    return df[df['sales'] >= threshold]

def display_results(df, stats):
    """
    分析結果を表示する
    
    Args:
        df (pd.DataFrame): 売上データ
        stats (dict): 統計情報
    """
    print("=== 売上データ分析 ===")
    print()
    
    # 基本統計量
    print("【基本統計量】")
    print(f"年間総売上: {stats['total']}万円")
    print(f"月平均売上: {stats['average']:.2f}万円")
    print(f"最高売上: {stats['max']}万円 ({stats['max_month']})")
    print(f"最低売上: {stats['min']}万円 ({stats['min_month']})")
    print()
    
    # 高売上月
    high_sales = filter_high_sales(df)
    print("【売上500万円以上の月】")
    for _, row in high_sales.iterrows():
        print(f"{row['month']}: {row['sales']}万円")
    print()
    
    # ランキング
    sorted_df = df.sort_values('sales', ascending=False)
    print("【売上ランキング（上位5位）】")
    for i, (_, row) in enumerate(sorted_df.head(5).iterrows(), 1):
        print(f"{i}位: {row['month']} - {row['sales']}万円")

def main():
    """メイン処理"""
    try:
        # データ読み込み
        sales_data = load_sales_data()
        
        # 統計計算
        stats = calculate_statistics(sales_data)
        
        # 結果表示
        display_results(sales_data, stats)
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
```

**発展版の特徴:**
- 関数による処理の分割
- docstringによるドキュメント
- エラーハンドリング
- main関数による明確な構造
- 引数によるカスタマイズ可能性

**いつこの書き方を学ぶべきか:**
- 基本的なデータ処理に慣れてから
- より大規模なプログラムを書くとき
- チームでコードを共有するとき
- 再利用可能なコードを書きたいとき

### 🎯 演習のポイント

この演習を通じて、以下のことを確認してください。

#### ✅ チェックポイント

1. **パッケージ/モジュールの読み込み**
   - [ ] Rで`library()`を使えた
   - [ ] Pythonで`import`文を使えた
   - [ ] 慣習的な別名（pd, npなど）を理解した

2. **データの作成**
   - [ ] Rで`data.frame()`を使えた
   - [ ] Pythonで`pd.DataFrame()`を使えた
   - [ ] 列名とデータの対応を理解した

3. **統計計算**
   - [ ] 合計、平均、最大、最小を計算できた
   - [ ] 各言語の関数の違いを理解した

4. **データ操作**
   - [ ] 条件でデータを抽出できた
   - [ ] データをソートできた
   - [ ] インデックスでデータにアクセスできた

5. **結果の表示**
   - [ ] わかりやすい出力を作成できた
   - [ ] ループ処理を使えた

### 💡 さらなる挑戦

基本課題ができた人は、以下の機能追加にも挑戦してみましょう。

#### 追加課題1: 四半期別の分析
- 1-3月、4-6月、7-9月、10-12月で売上を集計
- 各四半期の合計と平均を表示

#### 追加課題2: 前年比の計算
- 前年の売上データを追加
- 各月の前年比（成長率）を計算
- 成長率が高い月を抽出

#### 追加課題3: グラフの作成
- Rで`ggplot2`、Pythonで`matplotlib`を使用
- 月別売上の棒グラフを作成
- 平均線を追加

これらの挑戦を通じて、より実践的なデータ分析スキルを身につけることができます！

---

### 🤝 GitHub Copilotとの協働

演習中に困ったら、Copilotに以下のように質問してみましょう。

```
「pandasでデータフレームから最大値の行を取得する方法を教えて」
「Rのdplyrでデータを降順にソートするには？」
「このエラーの意味を教えて: KeyError: 'sales'」
```

Copilotは、具体的な問題に対して具体的な解決策を提案してくれます。


---

## 3.6.4 まとめ
### 本節で学んだこと

お疲れさまでした！本節では、RとPythonで外部の機能を読み込んで使う方法を学びました。ここで学んだ内容を振り返ってみましょう。

#### 🎯 主要な学習内容
##### 1. Rのパッケージシステム

**概念:**
- パッケージ: 追加機能をまとめたもの
- ライブラリ: パッケージを保管する場所
- CRAN: Rパッケージの配布元

**使い方:**
```r
# パッケージの読み込み
library(パッケージ名)

# パッケージのインストール
install.packages("パッケージ名")

# パッケージを読み込まずに関数を使う
パッケージ名::関数名()
```

**主要なパッケージ:**
- tidyverse: データ分析の総合パッケージ集
- dplyr: データ操作
- ggplot2: グラフ作成
- readr: ファイル読み込み

##### 2. Pythonのモジュールシステム

**概念:**
- モジュール: 単一のPythonファイル
- パッケージ: モジュールの集合
- ライブラリ: モジュール/パッケージの総称

**4つのimport方法:**
```python
# 方法1: 基本形
import math

# 方法2: 別名を付ける（推奨）
import numpy as np

# 方法3: 特定の要素だけ読み込む
from math import sqrt

# 方法4: すべて読み込む（非推奨）
from numpy import *  # 使わない
```

**主要なライブラリ:**
- NumPy: 数値計算、配列操作
- pandas: データ分析、表形式データ
- matplotlib: グラフ作成
- scikit-learn: 機械学習

#### 📊 RとPythonの比較

| 項目 | R | Python |
|------|---|--------|
| **用語** | パッケージ | モジュール/パッケージ |
| **読み込み** | `library(パッケージ名)` | `import モジュール名` |
| **インストール** | `install.packages("名前")` | `pip install 名前` |
| **慣習的な書き方** | そのまま使う | 別名を付ける（np, pd） |
| **パッケージなし使用** | `パッケージ名::関数名()` | 方法1または方法3 |
| **配布元** | CRAN | PyPI |

**共通点:**
- どちらも外部機能を読み込んで使う仕組みがある
- インストールは一度だけ、読み込みは毎回必要
- データサイエンス用の豊富なライブラリがある

**違い:**
- Rは`library()`という関数で読み込む
- Pythonは`import`という構文で読み込む
- Pythonは慣習的に別名（np, pd）を付けることが多い

#### 💡 重要なポイント
##### パッケージ/モジュールを使う理由

1. **効率的**: よく使う機能を毎回書かなくて済む
2. **信頼性**: 実績のあるコードを使える
3. **専門性**: 高度な機能（統計、機械学習など）を簡単に使える
4. **コミュニティ**: 多くの人が使っているので情報が豊富

##### インストールと読み込みの違い

```
インストール（一度だけ）
    ↓
読み込み（プログラムを実行するたびに）
    ↓
使用
```

**インストール:**
- パッケージをコンピュータにダウンロード
- 一度だけ実行すれば良い

**読み込み:**
- インストール済みのパッケージをプログラムで使えるようにする
- プログラムを実行するたびに必要

##### エラーへの対処

**Rのエラー:**
```
Error: there is no package called 'xxx'
→ install.packages("xxx") でインストール
```

**Pythonのエラー:**
```
ModuleNotFoundError: No module named 'xxx'
→ pip install xxx でインストール
```

### 🎓 データサイエンスにおける位置づけ

パッケージ/モジュールの活用は、データサイエンスの実務で**最も基本的で重要なスキル**です。

```
データサイエンスの実務
    ↓
ライブラリの選択
    ↓
データの読み込み（readr, pandas）
    ↓
データの加工（dplyr, pandas）
    ↓
統計分析（stats, scipy）
    ↓
可視化（ggplot2, matplotlib）
    ↓
機械学習（caret, scikit-learn）
```

これらすべてのステップで、パッケージ/モジュールを使います。

### 📚 学習の継続
#### 次のステップ

1. **よく使うライブラリに慣れる**
   - R: tidyverse（dplyr, ggplot2, readr）
   - Python: NumPy, pandas, matplotlib

2. **ドキュメントを読む習慣**
   - 公式ドキュメントの参照方法を学ぶ
   - 関数のヘルプを活用する

3. **実践的な課題に取り組む**
   - 実際のデータセットで分析
   - より複雑なデータ処理

4. **GitHub Copilotとの協働**
   - ライブラリの使い方を質問
   - コード例を生成して学習

#### おすすめの学習リソース

**Rのパッケージ:**
- tidyverse公式サイト: https://www.tidyverse.org/
- RDocumentation: https://www.rdocumentation.org/

**Pythonのライブラリ:**
- NumPy公式ドキュメント: https://numpy.org/doc/
- pandas公式ドキュメント: https://pandas.pydata.org/docs/

**GitHub Copilot:**
- わからないことは積極的に質問する
- 生成されたコードを理解してから使う
- 実験を繰り返して学ぶ

---

### ✅ 学習到達度チェックリスト
以下のチェックリストで、本節の理解度を確認しましょう。各項目にチェックを入れて、自分の学習状況を把握してください。

#### A. 環境構築と基本操作（10項目）
##### 作業環境
- [ ] 作業ディレクトリ（`~/work`）に移動できる
- [ ] 仮想環境（`venvc`）を有効化できる
- [ ] プロンプトに`(class)`が表示されることを確認した
- [ ] VS Codeでファイルを作成・保存できる

##### ファイル操作
- [ ] `touch`コマンドでファイルを作成できる
- [ ] Rのプログラムファイル（`.R`）を作成できる
- [ ] Pythonのプログラムファイル（`.py`）を作成できる
- [ ] `Rscript`コマンドでRプログラムを実行できる
- [ ] `python`コマンドでPythonプログラムを実行できる
- [ ] プログラムの実行結果を確認できる

#### B. プログラミング基礎スキル（25項目）
##### Rのパッケージ操作
- [ ] `library()`でパッケージを読み込める
- [ ] パッケージ読み込み後、その機能を使える
- [ ] `install.packages()`でパッケージをインストールできる
- [ ] 複数のパッケージを同時にインストールできる
- [ ] エラーメッセージ"there is no package called..."の意味を理解している
- [ ] `パッケージ名::関数名()`の形式を使える
- [ ] tidyverseパッケージの役割を理解している
- [ ] dplyrパッケージでデータを操作できる
- [ ] `filter()`でデータを抽出できる
- [ ] `arrange()`でデータをソートできる
- [ ] `desc()`で降順ソートができる

##### Pythonのモジュール操作
- [ ] `import`文でモジュールを読み込める
- [ ] `import 名前`の形式を使える
- [ ] `import 名前 as 別名`の形式を使える（推奨）
- [ ] `from 名前 import 要素名`の形式を使える
- [ ] `from 名前 import *`が非推奨である理由を理解している
- [ ] NumPyを`np`として読み込める
- [ ] pandasを`pd`として読み込める
- [ ] `pip install`でライブラリをインストールできる
- [ ] エラーメッセージ"ModuleNotFoundError"の意味を理解している
- [ ] 仮想環境内でライブラリをインストールできる

##### データ操作の実践
- [ ] NumPyで配列（array）を作成できる
- [ ] NumPyで基本統計量（平均、最大、最小など）を計算できる
- [ ] pandasでデータフレームを作成できる
- [ ] pandasでデータをフィルタリングできる
- [ ] pandasでデータをソートできる

#### C. AI協働スキル（10項目）
##### GitHub Copilotの基本
- [ ] GitHub Copilotが有効になっていることを確認した
- [ ] Copilot Chatを開くことができる
- [ ] Copilotに適切なプロンプトを入力できる
- [ ] 生成されたコードを読んで理解できる

##### 効果的な活用
- [ ] ライブラリ名を明示したプロンプトを書ける
- [ ] 段階的にコードを生成してもらえる
- [ ] エラーメッセージをCopilotに質問できる
- [ ] 生成されたコードを実行して動作を確認した
- [ ] コードを理解してから使う習慣を持っている
- [ ] Copilotの提案を鵜呑みにせず、検証する姿勢を持っている

#### D. 概念理解（15項目）
##### パッケージ/モジュールの概念
- [ ] パッケージ/モジュールが何かを説明できる
- [ ] なぜパッケージ/モジュールが必要かを理解している
- [ ] Rの「パッケージ」と「ライブラリ」の違いを理解している
- [ ] Pythonの「モジュール」「パッケージ」「ライブラリ」の違いを理解している
- [ ] インストールと読み込みの違いを理解している

##### RとPythonの比較
- [ ] RとPythonのパッケージ/モジュール読み込み方法の違いを説明できる
- [ ] RとPythonのインストール方法の違いを説明できる
- [ ] なぜPythonで別名（np, pd）を使うかを理解している
- [ ] 両言語で同じようなデータ処理ができることを理解している

##### エラーと対処法
- [ ] "there is no package called..."エラーの原因を理解している
- [ ] "ModuleNotFoundError"エラーの原因を理解している
- [ ] パッケージが読み込めないときの対処法を知っている
- [ ] インストールが失敗したときの対処法を知っている

##### データサイエンスへの応用
- [ ] データ分析でライブラリが重要な理由を理解している
- [ ] 主要なライブラリ（tidyverse, NumPy, pandasなど）の役割を知っている

#### E. 課題完遂（10項目）
##### 統合演習の完成
- [ ] Rバージョンの課題プログラムを完成させた
- [ ] Pythonバージョンの課題プログラムを完成させた
- [ ] 両方のプログラムが正常に実行されることを確認した
- [ ] データを正しく作成できた
- [ ] 基本統計量を正しく計算できた
- [ ] 条件抽出が正しく動作することを確認した
- [ ] ソートが正しく動作することを確認した
- [ ] 結果が読みやすく表示されることを確認した
- [ ] コメントを適切に記述した
- [ ] プログラムファイルを適切な名前で保存した

### 📊 達成度評価
チェック数に応じて、自分の学習到達度を評価してみましょう。

#### 評価基準

| チェック数 | 評価 | コメント |
|-----------|------|----------|
| 65-70項目 | ⭐⭐⭐⭐⭐ 優秀 | 本節の内容を完全にマスターしています！次の節に進みましょう。 |
| 55-64項目 | ⭐⭐⭐⭐ 良好 | ほぼ理解できています。チェックが付いていない項目を復習しましょう。 |
| 45-54項目 | ⭐⭐⭐ 普通 | 基本は理解できています。実践を繰り返して定着させましょう。 |
| 35-44項目 | ⭐⭐ 要復習 | いくつかの重要な概念が抜けています。該当箇所を読み直しましょう。 |
| 34項目以下 | ⭐ 要再学習 | 本節をもう一度最初から学習することをお勧めします。 |

### 🎯 復習のポイント

チェックが付かなかった項目がある場合、以下の方法で復習しましょう。

#### 実践的な復習方法

1. **該当箇所を読み直す**
   - チェックが付かなかった項目に関連するセクションを再読
   - サンプルプログラムを再度実行

2. **サンプルプログラムを改変する**
   - 変数名を変える
   - データの値を変える
   - 新しい処理を追加する

3. **GitHub Copilotに質問する**
   ```
   「Rのlibrary()とinstall.packages()の違いを教えて」
   「Pythonでimport numpy as npと書く理由は？」
   「pandasでデータフレームをフィルタリングする方法を教えて」
   ```

4. **自分でプログラムを書く**
   - サンプルを見ずに、似たようなプログラムを書いてみる
   - エラーが出たら、自分で解決してみる
   - わからなければCopilotに聞く

5. **統合演習をもう一度やる**
   - データを変えてやり直す
   - 新しい機能を追加する
   - より効率的なコードを書く

### 🚀 次のステップへ

本節で学んだパッケージ/モジュールの使い方は、データサイエンスのすべての作業で使います。今後の節では、これらのライブラリを使って、

- **データの読み込み**: CSVファイル、Excelファイルの処理
- **データの可視化**: グラフやチャートの作成
- **統計分析**: 回帰分析、検定
- **機械学習**: 予測モデルの構築

などを学んでいきます。

**ここでしっかりと基礎を固めておくことが重要です！**

### 💬 質問がある場合

わからないことや、もっと知りたいことがあれば、

1. **GitHub Copilotに聞く**
   - 具体的な質問をする
   - コード例を生成してもらう

2. **公式ドキュメントを見る**
   - より詳しい情報が載っている
   - 関数の全オプションを知ることができる

3. **実験する**
   - 試行錯誤は最高の学習方法
   - エラーを恐れずに挑戦する

4. **教員やTA（ティーチングアシスタント）に質問する**
   - 授業や演習の時間を活用
   - オフィスアワーを利用

### 🎓 まとめ

お疲れさまでした！本節を通じて、以下のことを学びました。

✅ **Rのパッケージシステム**
- library()による読み込み
- install.packages()によるインストール
- tidyverseなどの主要パッケージ

✅ **Pythonのモジュールシステム**
- import文の4つの方法
- NumPy, pandasなどの主要ライブラリ
- pip installによるインストール

✅ **実践的なデータ処理**
- 統計計算
- データのフィルタリング
- データのソート

✅ **AI協働スキル**
- GitHub Copilotの効果的な活用
- プロンプトの書き方
- 生成コードの理解と検証

### 📝 最後に

パッケージ/モジュールは、データサイエンスの**道具箱**です。これから学ぶすべての内容で、これらの道具を使っていきます。

**大切なこと:**
- 完璧に理解しようとしなくても大丈夫
- 実践しながら少しずつ慣れていく
- エラーは学習の機会
- GitHub Copilotを活用する
- 楽しんで学ぶ！

次の節でお会いしましょう！🎉

## 📚 付録: よく使うコマンドまとめ

### Rのコマンド

```r
# パッケージの読み込み
library(パッケージ名)

# パッケージのインストール
install.packages("パッケージ名")

# 複数パッケージのインストール
install.packages(c("パッケージA", "パッケージB"))

# パッケージを読み込まずに関数を使う
パッケージ名::関数名()

# パッケージの更新
update.packages(ask = FALSE)

# インストール済みパッケージの確認
installed.packages()
```

### Pythonのコマンド

```python
# モジュールの読み込み
import モジュール名
import モジュール名 as 別名
from モジュール名 import 要素名

# よく使うimport文
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

### ターミナルコマンド

```bash
# 仮想環境の有効化
$ venvc

# ライブラリのインストール
(class) $ pip install ライブラリ名

# 複数ライブラリのインストール
(class) $ pip install numpy pandas matplotlib

# インストール済みライブラリの確認
(class) $ pip list

# 特定のライブラリの情報確認
(class) $ pip show numpy

# ライブラリの更新
(class) $ pip install --upgrade ライブラリ名

# Rプログラムの実行
$ Rscript ファイル名.R

# Pythonプログラムの実行
$ python ファイル名.py
```