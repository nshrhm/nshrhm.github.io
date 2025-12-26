# FILE: lecture_note_4-3.md
# 第4章3節: 乱数とシミュレーション入門

## この節のゴール（学習目標）
- 乱数（本書では「疑似乱数」を含めて乱数と呼ぶ）を「シミュレーションに使う道具」として説明できる
- 一様乱数（離散/連続）を生成し、ヒストグラムで「だいたい均一」を確認できる
- 二項乱数（コイン投げ）を生成し、結果分布をヒストグラムで確認できる
- 正規乱数を生成し、平均・標準偏差と「釣鐘型」の関係を説明できる
- RとPythonの乱数関数の対応関係（表4.5）を表で整理できる
- （発展）二項分布が正規分布に近づく直観（中心極限定理への入口）を言葉で説明できる

---

## 前提（できていると良いこと）
- VS Code の統合ターミナルを開ける
- `/home/datasci/work` に移動してファイルを作れる
- `python ...` と `Rscript ...` でプログラムを実行できる
- 「ヒストグラム」は、値の出現回数を棒グラフで見える化するものだと知っている（詳しい理屈は後でもOK）

---

## 環境チェック（WSL2 + venvc + 実行確認）

### 1) 作業ディレクトリへ移動
```bash
cd /home/datasci/work
pwd
#> /home/datasci/work
```

### 2) 仮想環境を有効化（`venvc`）
```bash
venvc
#> (class) ...
```

### 3) Python と R の動作確認
```bash
python -V
#> Python 3.12.x

Rscript --version
#> Rscript (R) version 4.x.x
```

### 4) 必要パッケージの確認（Python）
本節のPython例では `numpy` と `matplotlib` を使います。
```bash
python -c "import numpy, matplotlib; print('OK')"
#> OK
```

もし `ModuleNotFoundError` が出たら（環境によっては必要）：
```bash
python -m pip install -U numpy matplotlib
#> （インストールログが流れる）
```

---

## 概念をつかむ（やさしい説明）

### 乱数（疑似乱数）とは何か
シミュレーション（現象をコンピュータで再現して調べる方法）では、毎回同じ結果にならない「ゆらぎ」を作るために乱数が必要です。  
ただし、プログラムで作る乱数は、厳密には「疑似乱数」であり、仕組みとしては再現可能です。本節でも、簡単に「乱数」と呼びます。

ポイントは次の2つです。
- **多数回試すと傾向が見える**（1回1回はバラつくが、分布として形が出る）
- **ヒストグラムで形を目で確認する**（まずは直感をつかむ）

### 表4.5：RとPythonの関数対応（本節で扱う4種類）
本節では、次の4種類を扱います。

| 種類 | R | Python（その1） | Python（その2：推奨） |
|---|---|---|---|
| 一様乱数（離散） | `sample` | `np.random.choice` / `np.random.randint` | `rng.integers` |
| 一様乱数（連続） | `runif` | `np.random.random` | `rng.random` |
| 二項乱数 | `rbinom` | `np.random.binomial` | `rng.binomial` |
| 正規乱数 | `rnorm` | `np.random.normal` | `rng.normal` |

Pythonは乱数の作り方が複数ありますが、**`rng = np.random.default_rng()` を作って `rng.xxx` を使う方法（その2）が比較的新しく、推奨**される流儀です。  
この講義ノートでも、基本は「その2」を主として書き、必要に応じて「その1」も補足します。

---

## Pythonでやってみる
ここでは **最小で動く** 例を、ファイル単位で作ります。  
ヒストグラムは「画面表示」より「画像ファイル保存」にしておくと、WSL2環境でも確実です。

### サンプル1：一様乱数（離散）でサイコロ（1〜6）を1万回
- ファイル名：`my4-3-01_dice.py`
- ねらい：出目（1〜6）が **だいたい同じ回数** 出ることをヒストグラムで確認

#### ファイル作成
```bash
touch my4-3-01_dice.py
code my4-3-01_dice.py
```

#### コード（Python）
```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2025)  # 乱数のタネ（再現性のため）

x = rng.integers(low=1, high=7, size=10000)  # 1〜6（highは「最大+1」）
plt.hist(x, bins=6)

plt.savefig("fig4-3-01_dice.png", dpi=150, bbox_inches="tight")
print("saved: fig4-3-01_dice.png")
```

#### 実行
```bash
python my4-3-01_dice.py
#> saved: fig4-3-01_dice.png
```

> 補足：`np.random.randint(...)` や `np.random.choice(...)` でも作れます。  
> ただし初心者のうちは、まず `rng = np.random.default_rng()` から始めると迷いにくいです。

---

### サンプル2：一様乱数（連続）で0〜1を1000個
- ファイル名：`my4-3-02_uniform01.py`
- ねらい：0〜1の連続値が **だいたい均一** に分布するのをヒストグラムで確認

#### ファイル作成
```bash
touch my4-3-02_uniform01.py
code my4-3-02_uniform01.py
```

#### コード（Python）
```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2025)

x = rng.random(1000)  # 0〜1の一様乱数（連続）
plt.hist(x, bins=20)

plt.savefig("fig4-3-02_uniform01.png", dpi=150, bbox_inches="tight")
print("saved: fig4-3-02_uniform01.png")
```

#### 実行
```bash
python my4-3-02_uniform01.py
#> saved: fig4-3-02_uniform01.png
```

---

### サンプル3：二項乱数でコイン投げ（100回投げて表の回数）を1万回
- ファイル名：`my4-3-03_binom_coin.py`
- ねらい：コイン投げの「表の回数」は、ばらつきながらも中心付近に集まることをヒストグラムで確認

> 注意：RとPythonで `n` と `size` の意味が逆になりやすいので、ここでは変数名を丁寧に分けます。

#### ファイル作成
```bash
touch my4-3-03_binom_coin.py
code my4-3-03_binom_coin.py
```

#### コード（Python）
```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2025)

trials = 100      # 1回の実験で投げる回数（n）
p = 0.5           # 表が出る確率
repeats = 10000   # 実験の繰り返し回数（乱数の数）

x = rng.binomial(n=trials, p=p, size=repeats)  # 「表の回数」がrepeats個
plt.hist(x, bins=40)

plt.savefig("fig4-3-03_binom_coin.png", dpi=150, bbox_inches="tight")
print("min, mean, max:", int(x.min()), float(x.mean()), int(x.max()))
print("saved: fig4-3-03_binom_coin.png")
```

#### 実行
```bash
python my4-3-03_binom_coin.py
#> min, mean, max: ... ... ...
#> saved: fig4-3-03_binom_coin.png
```

> 数値（min/mean/max）は乱数なので環境で多少変わります。大事なのは、ヒストグラムが中央（だいたい50付近）で山になることです。

---

### サンプル4：正規乱数（平均50、標準偏差5）を1万個
- ファイル名：`my4-3-04_normal_hist.py`
- ねらい：平均と標準偏差を指定すると、釣鐘型の分布が得られることを確認

#### ファイル作成
```bash
touch my4-3-04_normal_hist.py
code my4-3-04_normal_hist.py
```

#### コード（Python）
```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2025)

x = rng.normal(loc=50, scale=5, size=10000)  # 平均=50, 標準偏差=5
plt.hist(x, bins=40)

plt.savefig("fig4-3-04_normal_hist.png", dpi=150, bbox_inches="tight")
print("mean, std:", float(x.mean()), float(x.std(ddof=0)))
print("saved: fig4-3-04_normal_hist.png")
```

#### 実行
```bash
python my4-3-04_normal_hist.py
#> mean, std: ... ...
#> saved: fig4-3-04_normal_hist.png
```

---

## Rでやってみる
Pythonと同じ学習目標・同じ難易度で進めます。  
Rは「乱数の関数名が規則的」なのが特徴です（`runif`, `rbinom`, `rnorm` など）。

### サンプル1：一様乱数（離散）でサイコロ（1〜6）を1万回
- ファイル名：`my4-3-01_dice.R`

#### ファイル作成
```bash
touch my4-3-01_dice.R
code my4-3-01_dice.R
```

#### コード（R）
```r
set.seed(2025)  # 乱数のタネ（再現性のため）

x <- sample(x = 1:6, size = 10000, replace = TRUE)

png("fig4-3-01_dice_R.png", width = 900, height = 650)
hist(x, breaks = 0:6)
dev.off()

cat("saved: fig4-3-01_dice_R.png\n")
```

#### 実行
```bash
Rscript my4-3-01_dice.R
#> saved: fig4-3-01_dice_R.png
```

---

### サンプル2：一様乱数（連続）で0〜1を1000個
- ファイル名：`my4-3-02_uniform01.R`

#### ファイル作成
```bash
touch my4-3-02_uniform01.R
code my4-3-02_uniform01.R
```

#### コード（R）
```r
set.seed(2025)

x <- runif(n = 1000, min = 0, max = 1)

png("fig4-3-02_uniform01_R.png", width = 900, height = 650)
hist(x, breaks = 20)
dev.off()

cat("saved: fig4-3-02_uniform01_R.png\n")
```

#### 実行
```bash
Rscript my4-3-02_uniform01.R
#> saved: fig4-3-02_uniform01_R.png
```

---

### サンプル3：二項乱数でコイン投げ（100回投げて表の回数）を1万回
- ファイル名：`my4-3-03_binom_coin.R`

> 注意：Rの `rbinom()` は `rbinom(n, size, prob)` です。  
> - `n` は「乱数の個数（実験の繰り返し回数）」  
> - `size` は「1回の実験での試行回数（コインを投げる回数）」  
> Python例と見比べて、引数の意味が入れ替わって見える点に注意しましょう。

#### ファイル作成
```bash
touch my4-3-03_binom_coin.R
code my4-3-03_binom_coin.R
```

#### コード（R）
```r
set.seed(2025)

trials <- 100     # 1回の実験で投げる回数（size）
p <- 0.5
repeats <- 10000  # 実験の繰り返し回数（n）

x <- rbinom(n = repeats, size = trials, prob = p)

png("fig4-3-03_binom_coin_R.png", width = 900, height = 650)
hist(x, breaks = 40)
dev.off()

cat("min, mean, max:", min(x), mean(x), max(x), "\n")
cat("saved: fig4-3-03_binom_coin_R.png\n")
```

#### 実行
```bash
Rscript my4-3-03_binom_coin.R
#> min, mean, max: ... ... ...
#> saved: fig4-3-03_binom_coin_R.png
```

---

### サンプル4：正規乱数（平均50、標準偏差5）を1万個
- ファイル名：`my4-3-04_normal_hist.R`

#### ファイル作成
```bash
touch my4-3-04_normal_hist.R
code my4-3-04_normal_hist.R
```

#### コード（R）
```r
set.seed(2025)

x <- rnorm(n = 10000, mean = 50, sd = 5)

png("fig4-3-04_normal_hist_R.png", width = 900, height = 650)
hist(x, breaks = 40)
dev.off()

cat("mean, sd:", mean(x), sd(x), "\n")
cat("saved: fig4-3-04_normal_hist_R.png\n")
```

#### 実行
```bash
Rscript my4-3-04_normal_hist.R
#> mean, sd: ... ...
#> saved: fig4-3-04_normal_hist_R.png
```

---

## PythonとRの対応関係（差分まとめ）
この節で混乱しやすい点を、対応表にまとめます。

| やりたいこと | Python（推奨） | R | つまずきやすい点 |
|---|---|---|---|
| 乱数生成器を用意 | `rng = np.random.default_rng(2025)` | `set.seed(2025)` | 「タネ」を固定すると再現できる |
| サイコロ（1〜6） | `rng.integers(1, 7, size=...)` | `sample(1:6, size=..., replace=TRUE)` | Pythonの `high` は最大+1 |
| 0〜1の一様（連続） | `rng.random(n)` | `runif(n, 0, 1)` | Pythonは `random` が「0〜1」 |
| 二項（コイン投げ） | `rng.binomial(n=trials, p=p, size=repeats)` | `rbinom(n=repeats, size=trials, prob=p)` | **Rの`n`は「乱数の数」**（実験回数） |
| 正規 | `rng.normal(loc=mean, scale=sd, size=...)` | `rnorm(n=..., mean=..., sd=...)` | Pythonの `scale` は標準偏差 |
| ヒストグラム | `plt.hist(x, bins=...)` | `hist(x, breaks=...)` | bins/breaks の感覚が少し違う |
| 図を保存 | `plt.savefig("x.png", ...)` | `png("x.png"); ...; dev.off()` | Rは `dev.off()` を忘れがち |

---

## よくあるつまずき（トラブルシュート）
- **（Python）`ModuleNotFoundError: No module named 'matplotlib'`**
  - 対処：`python -m pip install -U matplotlib numpy` を実行してから再実行
- **（Python）WSL2で図が表示されない**
  - 対処：この教材のように `savefig()` で保存し、VS CodeでPNGを開く（確実）
- **（R）`there is no package called ...` が出る**
  - 対処：この節の例は基本的に追加パッケージ不要。もし別のコードを試して出たなら、いったん本節の最小例に戻る
- **（R）画像が空っぽ、または更新されない**
  - 対処：`dev.off()` を書き忘れていないか確認
- **二項乱数の引数が混乱する**
  - 対処：変数名を `trials`（1回の試行回数）と `repeats`（実験の回数）に分けて書く
- **ヒストグラムが毎回違う**
  - 対処：乱数なので当然ゆらぐ。再現したいときは `set.seed()` / `default_rng(タネ)` を固定する

---

## 💡 GitHub Copilot活用ガイド
Copilotは「答えを出す装置」ではなく、手を動かす速度を上げる相棒です。特に乱数と可視化は、関数名や引数を忘れやすい分野なので、まずは最小例をCopilotに作らせ、あなたが目的に合わせて削って整えるのが効果的です。必ず「理解→実行→結果の確認」の順で検証し、動いた理由を自分の言葉で説明できる形に仕上げましょう。

### プロンプト例（Copilot Chatにそのまま貼れる形）
1) ★☆☆（最小例を作らせる）
- 入力する文章：
  - 「Pythonで `numpy.random.default_rng()` を使って1〜6の乱数を1万個作り、`matplotlib` でヒストグラムを保存する最小コードを書いて。ファイル保存まで。」
- 期待される動作：
  - `rng.integers` と `plt.savefig` を含む短いコードを返す
- やってみよう（3ステップ）：
  1. 返ってきたコードを `my4-3-01_dice.py` に貼る
  2. コメントを日本語に直し、変数名を `x`, `rng` に統一
  3. 実行してPNGができることを確認

2) ★★☆（引数の意味を整理させる）
- 入力する文章：
  - 「Rの `rbinom(n, size, prob)` とPythonの `rng.binomial(n, p, size)` の違いを、初心者向けに短く説明して。具体例（コイン投げ100回×1万実験）で。」
- 期待される動作：
  - 「n/sizeの意味」が混乱ポイントだと指摘し、例で整理する
- やってみよう（3ステップ）：
  1. 説明文を自分の言葉に直してノートに貼る
  2. 変数名を `trials`, `repeats` に統一してコードに反映
  3. ヒストグラムが中央に山になることを確認

3) ★★★（演習を自分用に拡張）
- 入力する文章：
  - 「サイコロをN回振った平均値を、N=100,1000,10000で比較する演習を作りたい。Python/Rの両方で、読みやすい最小コードと、結果をMarkdown表にする例を提案して。」
- 期待される動作：
  - Nごとの平均計算、表の作り方（print/cat）まで提案する
- やってみよう（3ステップ）：
  1. まずN=100だけで動かす
  2. Nを3種類に増やして表を出す
  3. 結果の「だいたい6面の平均3.5に近づく」ことを文章で書く

### コツ（最低4項目）
- まず「最小で動く例」を作らせてから、あなたが削って短くする
- 変数名を意味で分ける（`trials` と `repeats` など）とバグが減る
- 期待する形（例：釣鐘型、均一）を先に文章で書き、結果と照合する
- 図は「表示」より「保存」に寄せると環境差で詰まりにくい

### 注意事項（最低4項目）
- 出てきたコードをそのまま信じず、必ず実行して結果を確認する
- 引数の意味（特に二項乱数）は、言語差で取り違えが起きやすい
- 長いコードを提案されたら、目的に必要な行だけに削る（10〜20行を目標）
- 乱数は毎回変わる。比較・提出では「タネ（seed）」を固定する

### 推奨学習フロー（固定の6ステップ）
1. 目的を1文で書く（例：サイコロの出目が均一かをヒストグラムで見る）
2. Copilotに「最小コード」を作らせる
3. 自分でコメントと変数名を整えて、短くする
4. 実行し、出力（PNGや数値）を確認する
5. 1つだけ条件を変えて再実験する（回数、bins、平均/標準偏差など）
6. 結果を2〜3行でまとめる（期待と一致した点・違った点）

---

## 演習（提出用）

### 演習1（必須）：サイコロ平均値が回数で安定するか
**目的**  
乱数の「1回はブレるが、多数回で安定する」感覚を、平均値で確かめます。

**やること**  
サイコロ（1〜6）を N 回振り、平均値を計算する。N を次の3つにする：  
- N = 100, 1000, 10000

**入力**  
- 乱数のタネ（seed）を固定する（Python/Rどちらも）

**出力（提出物）**  
- Python：`ex4-3-01_dice_mean.py`
- R：`ex4-3-01_dice_mean.R`
- それぞれ、次をターミナルに表示する：
  - N と平均値
- さらに、結果をMarkdown表にしたもの（`ex4-3-01_result.md`）を作る（手書きでOK）

**評価基準（ルーブリック）**
- 正しく実行できる（Python/R両方）
- コードが読みやすい（コメント、変数名、短さ）
- 結果が妥当（平均が3.5付近へ近づく傾向を確認できる）
- `ex4-3-01_result.md` に簡単な考察（3〜6行）がある

**提出形式**
- `ex4-3/` フォルダを作り、3ファイルを入れてZIPにして提出：
  - `ex4-3-01_dice_mean.py`
  - `ex4-3-01_dice_mean.R`
  - `ex4-3-01_result.md`

---

## 解答例

### 基本版（必須）：Python
- ファイル名：`ex4-3-01_dice_mean.py`
```python
import numpy as np

rng = np.random.default_rng(2025)

Ns = [100, 1000, 10000]
for N in Ns:
    x = rng.integers(low=1, high=7, size=N)
    print("N =", N, "mean =", float(x.mean()))
```

実行：
```bash
python ex4-3-01_dice_mean.py
#> N = 100 mean = ...
#> N = 1000 mean = ...
#> N = 10000 mean = ...
```

### 基本版（必須）：R
- ファイル名：`ex4-3-01_dice_mean.R`
```r
set.seed(2025)

Ns <- c(100, 1000, 10000)
for (N in Ns) {
  x <- sample(x = 1:6, size = N, replace = TRUE)
  cat("N =", N, "mean =", mean(x), "\n")
}
```

実行：
```bash
Rscript ex4-3-01_dice_mean.R
#> N = 100 mean = ...
#> N = 1000 mean = ...
#> N = 10000 mean = ...
```

### 発展版（参考）：平均値とヒストグラムを同時に保存
- 基本版で十分です。余力があれば、NごとにヒストグラムPNGも保存して比較してみましょう。

---

## まとめ
この節では、乱数を「シミュレーションの道具」として扱い、4種類（離散一様・連続一様・二項・正規）をPython/Rで生成しました。  
乱数は1回ごとにブレますが、たくさん集めると分布の形（均一、釣鐘型など）が見えてきます。  
まずはヒストグラムで直感をつかみ、次に平均や分散などの数値で確かめる、という順番が初心者にはおすすめです。  
二項乱数の引数は言語で混乱しやすいので、`trials` と `repeats` を分けて書く習慣をつけましょう。

---

## 自己チェックリスト（50〜85項目）

### A. 環境構築と基本操作
- [ ] `/home/datasci/work` に移動できる
- [ ] `venvc` を実行して `(class)` 表示を確認した
- [ ] `python -V` でPythonのバージョンを確認した
- [ ] `Rscript --version` でRのバージョンを確認した
- [ ] `touch` で `.py` と `.R` のファイルを作成できる
- [ ] `code ファイル名` でVS Codeで編集できる
- [ ] `python ファイル名.py` で実行できる
- [ ] `Rscript ファイル名.R` で実行できる
- [ ] Pythonで `numpy` をimportできる
- [ ] Pythonで `matplotlib` をimportできる
- [ ] `pip install` が必要なときに実行できる
- [ ] PNGファイルをVS Codeで開いて確認できる

### B. プログラミング基礎スキル
- [ ] 変数に値を入れる（代入）ができる（Python/R）
- [ ] コメントで処理の意図を書ける（Python/R）
- [ ] 乱数の個数を変数で管理できる
- [ ] 乱数の範囲（1〜6など）を指定できる
- [ ] 配列（Python）/ベクトル（R）として乱数を扱える
- [ ] 平均値を計算できる（`mean()` / `.mean()`）
- [ ] 最小値・最大値を確認できる
- [ ] `for` でN=100,1000,10000を順に処理できる
- [ ] 画面出力（`print` / `cat`）ができる
- [ ] ファイル名を規則通りに付けられる（`my4-3-..`, `ex4-3-..`）

### C. AI協働スキル
- [ ] Copilotに「最小例」を依頼するプロンプトを書ける
- [ ] 返ってきたコードを短く削れる
- [ ] 変数名を意味が分かる名前に直せる
- [ ] 引数の意味をCopilotに質問できる
- [ ] 出力の「期待する形」を先に文章で書ける
- [ ] Copilotの提案をそのまま使わず、実行で検証した
- [ ] エラー文を貼って原因候補を絞れる
- [ ] 自分の理解を優先し、丸投げしない

### D. 概念理解
- [ ] 乱数がシミュレーションに必要な理由を説明できる
- [ ] 疑似乱数という言葉の意味を知っている
- [ ] 「タネ（seed）」を固定すると再現できる理由を説明できる
- [ ] ヒストグラムが何を表すか説明できる
- [ ] 離散一様（サイコロ）と連続一様（0〜1）の違いを説明できる
- [ ] 二項分布が「成功回数」を表す分布だと説明できる
- [ ] コイン投げを二項乱数で表現できる
- [ ] 正規分布が平均と標準偏差で形が決まることを説明できる
- [ ] `loc/scale`（Python）と `mean/sd`（R）の対応を説明できる
- [ ] RとPythonで二項乱数の引数が混乱ポイントだと理解している
- [ ] 乱数は毎回同じにならない（揺れる）ことを受け入れられる
- [ ] 多数回で傾向が見える、という考え方を説明できる

### E. 課題完遂
- [ ] 演習のPython版が動作した
- [ ] 演習のR版が動作した
- [ ] N=100,1000,10000の結果を出力できた
- [ ] 結果を `ex4-3-01_result.md` に表としてまとめた
- [ ] 3〜6行の考察を書いた
- [ ] 提出用フォルダ `ex4-3/` を作った
- [ ] 必要な3ファイルが揃っていることを確認した
- [ ] ファイル名の打ち間違いがない
- [ ] コードが10〜20行程度で読みやすい
- [ ] コメントが入っている
- [ ] seedを固定した
- [ ] ZIPにして提出できる

### 達成度評価（チェック数 → 評価）
- 0〜20：要復習（まずは環境と実行を安定させましょう）
- 21〜40：基礎はOK（例を写経して動かせる段階です）
- 41〜60：実践に進める（演習を自力で調整できる段階です）
- 61〜85：十分に定着（分布の違いを説明しながら実験できます）