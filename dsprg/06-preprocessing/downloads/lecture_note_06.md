# 第6回　前処理：分析に使う記録を選ぼう

第4回ではコードの中に表を書き、第5回では乱数から標本を作りました。今回は配布されたCSVを読みます。分析を始める前に、数値の意味、空欄、使う記録の条件を確かめます。

## 今日できるようになること

1. CSVの行数・列名・型・欠損件数を確認する。
2. 必要な列の欠損と抽出条件を説明する。
3. 元データを残したままCSVを保存し、読み直して照合する。

## 1．準備：workの中に配布フォルダーを置く

スライド4の「教材一式ZIP」を保存して展開します。中にある `lesson06` フォルダーを、授業用の `work/exercises/` に置きます。ZIPを開いて中を見るだけでは準備が終わりません。授業用のVS Codeで **work全体** を開いてください。

学生ノートはZIPにも入っています。`exercises/lesson06/lecture_note_06.md` を開き、**Ctrl+Shift+V** でプレビューします。ノート単体をダウンロードした場合も同じ場所へ保存します。第7回の課題案内・ひな形は `lesson06/next/` にあり、このノートのリンクから開けます。

```text
work/
└─ exercises/
   └─ lesson06/
      ├─ lecture_note_06.md
      ├─ lesson06.py / lesson06.R
      ├─ exercise06.py / exercise06.R
      ├─ data/     ← study_records.csv などの入力
      ├─ next/     ← 第7回の課題案内・ひな形
      └─ output/   ← 実行時に作成される加工結果
```

授業中は各節のコードと「成功の目印」を確認します。詳しい説明は、実行結果を読めないときや授業後の自習で参照してください。変数・代入は第3回学生ノート3節、数値列と関数呼び出しは同4節、表の列は同5節で扱いました。単位と集計は第4回学生ノート3〜4節を参照してください。以下では第6回の主例で新しく使う操作を説明します。

1. エクスプローラーで `exercises` を開きます。
2. `lesson06` を開きます。
3. `data` を開きます。
4. `study_records.csv` をクリックします。

**成功の目印：** `id,place,study_minutes,quiz_score` という1行目と、A〜Lの12記録が見えます。`lesson06/lesson06/` のように二重になっている場合は担当教員と配置を直します。

このデータは架空の学習記録です。実学生の成績や調査結果ではありません。CSVはカンマで列を区切ったファイルで、1行目は列名です。12記録に列名の行は含めません。

| 列 | 意味 | 単位・種類 |
| --- | --- | --- |
| `id` | 記録につけた名前 | 文字列 |
| `place` | 学習場所 | 文字列 |
| `study_minutes` | 学習時間 | 分、数値 |
| `quiz_score` | 小テスト得点 | 点、数値 |

実行前に、C・F・G・Hの行を見ます。「0」と空欄は同じでしょうか。今回は学習時間と得点を使います。場所が空欄でも、この二つの値が分かる記録は使えるでしょうか。予想を短く書いてください。

## 2．Python：読む・確認する

`lesson06.py` を開き、保存して「授業: Pythonファイルを実行」を選びます。端末へコードを1行ずつ貼らず、ファイル全体を実行します。

```python
records = pd.read_csv(source, dtype=column_types,
                      keep_default_na=False, na_values=[""])
print(records.shape)
print(records.columns.tolist())
print(records.dtypes)
print(records.isna().sum())
```

### 2.1 読む場所と列の型を指定する

主例の先頭には次の準備があります。

```python
from pathlib import Path
import pandas as pd
source = Path("exercises/lesson06/data/study_records.csv")
column_types = {"id": "string", "place": "string",
                "study_minutes": "float64", "quiz_score": "float64"}
```

`from pathlib import Path` は、Python標準の機能からファイルの場所を扱う `Path` を使えるようにします。追加インストールは不要です。`import pandas as pd` は表を扱うpandasを `pd` という短い名前で使う指定です。

`Path("...")` は文字列を受け取り、ファイルの場所を表すオブジェクトを返します。この行ではまだCSVを読みません。`source` にその場所を保存します。先頭が `/` ではない相対パスは、**授業タスクの作業場所であるwork** からたどります。コードの置き場所からとは限らないため、work全体を開くことが必要です。

`{列名: 型, ...}` は対応を保存する**辞書**です。コロンの左が列名、右が読み込む型です。`string` は文字列、`float64` は小数を扱える数値型です。数値列は空欄もあるので、整数に見える値もこの型で読みます。

| `pd.read_csv` の引数 | 今回の指定と意味 |
| --- | --- |
| `source` | 読み込むファイルの場所 |
| `dtype=column_types` | 辞書に書いた列の型で読む |
| `keep_default_na=False` | pandasが標準で欠損扱いする文字列の一覧を使わない |
| `na_values=[""]` | 今回は空文字列、つまりこのCSVの空欄を欠損として読む |

戻り値は行と列を持つ表（DataFrame）で、`records` に代入します。`False` は「しない」を表す論理値で、文字列ではありません。この指定では0を欠損にはしません。読み込んだ表を変えても、元CSVは自動で書き換わりません。

### 2.2 四つの確認結果を読む

| 式 | 得られるもの・読み方 |
| --- | --- |
| `records.shape` | `(行数, 列数)`。今回は `(12, 4)`。属性を読むので末尾の `()` は不要 |
| `records.columns.tolist()` | 列名を取り出し、`tolist()` でPythonのリストにする |
| `records.dtypes` | 列ごとの型。id・placeはstring、残りはfloat64 |
| `records.isna().sum()` | 各セルの欠損判定をしてから、列ごとに欠損件数を合計する |

`isna()` は欠損なら `True`、それ以外なら `False` の表を返します。続く `.sum()` は各列の `True` を1、`False` を0として合計するので、欠損件数になります。このように左の結果へ次の処理をつなぐ書き方を順に読みます。`print(...)` は括弧内の結果を画面へ表示します。

**成功の目印：** 12行4列。IDの欠損は0件、場所・学習時間・得点は各1件です。型の表示では文字列列と数値列を区別します。空欄は `NaN` や `<NA>` と表示されます。どちらも、この例では元の値が不明であることを示します。

## 3．必要な値がある記録を残す

```python
complete = records.dropna(subset=["study_minutes", "quiz_score"])
print(len(complete))
print(complete["id"].tolist())
```

`dropna(subset=[...])` は指定した列のどれかが欠損の行を除いた、新しい表を返します。`subset` のリストは「どの列で判定するか」です。`complete` に返された表を保存し、元の `records` は残ります。`len(complete)` は行数を整数で返し、`complete["id"]` はid列、続く `tolist()` はその値のリストを返します。

`subset` に指定した2列を確認します。学習時間か得点が不明なC・Gを除き、10行が残ります。Fの0分は記録された数値です。Hは場所だけが不明なので残します。

すべての空欄を一律に除くのではなく、**今回の目的で必要な列**を決めます。この処理がどの分析でも正しいわけではありません。今回は補完する根拠がないため、必要な値が不明な行を除く方針です。

## 4．条件で選び、列を作る

```python
minimum_minutes = 30
selected = complete.loc[
    complete["study_minutes"] >= minimum_minutes,
    ["id", "study_minutes", "quiz_score"]
].copy()
selected["study_hours"] = selected["study_minutes"] / 60
```

`>=` は「以上」で、境界の30分も含みます。`complete["study_minutes"] >= minimum_minutes` は各行の学習時間を30と比較して、条件を満たすかどうかの列を返します。

`.loc[行の条件, 列名のリスト]` は、条件がTrueの行と、指定した列を順に選んだ表を返します。続く `.copy()` はその表のコピーを返し、後で列を追加する作業用の `selected` とします。

`selected["study_minutes"] / 60` は全行の分を一括で時間へ換算した列を返します。`selected["study_hours"] = ...` は、その結果を新しい列名で表へ追加する代入です。元CSVへ書き込む操作ではありません。

**成功の目印：** 30分以上の8行、4列です。30分は0.5時間、60分は1時間です。表の左に見える行の番号は、`id` 列とは別です。

## 5．保存し、読み直す

まず、保存する場所を用意します。

```python
output = Path("exercises/lesson06/output")
output.mkdir(parents=True, exist_ok=True)
output_file = output / "lesson06_python.csv"
```

`mkdir` はフォルダーを作る操作です。`parents=True` は途中の親フォルダーも必要なら作る指定、`exist_ok=True` は同じフォルダーが既にあってもエラーにしない指定です。戻り値は `None`（返す値なし）なので代入せず呼び出します。

`Path` 同士や `Path` と文字列の間の `/` は、ここでは数の割り算ではなく、場所をつなぐ演算です。`output_file` は `exercises/lesson06/output/lesson06_python.csv` という保存先を表します。入力の `data/` と分けることで元データを残します。

```python
selected.to_csv(output_file, index=False)
reloaded = pd.read_csv(output_file, dtype={"id": "string"})
print(selected.reset_index(drop=True).equals(reloaded))
```

`to_csv` は表を第1引数のファイルへ書き出します。この使い方では戻り値は `None` です。同名の出力ファイルがあれば更新されます。`index=False` で表の行番号をCSVへ書かず、idを含む4列だけを保存します。

`pd.read_csv` は保存したファイルを読み直して表を返します。`dtype={"id": "string"}` でidを元と同じ文字列型にします。他の3列はこのCSVでは数値として読み込まれます。再読込できたことに加え、件数・列名・値を確かめます。

`reset_index(drop=True)` は、抽出で飛び飛びになった行番号を0からの連番にした新しい表を返します。`drop=True` は古い行番号を列として残さない指定です。id列や数値は変えません。続く `.equals(reloaded)` は、行列の順序・値・列の型などが一致するかを調べ、`True` または `False` を返します。

この式は、**行番号を整える→再読込した表と比較→真偽を表示**の順です。`True` でも「分析に適した行を選んだ」ことまでは保証しません。元のIDと抽出理由の確認も必要です。

エクスプローラーで `output/lesson06_python.csv` を開きます。4列と8記録があり、画面には「保存前と一致: True」と出ます。入力は `data/`、加工結果は `output/` に分けます。

## 6．R：同じ操作を対応づける

`lesson06.R` を開き、保存して「授業: Rファイルを実行」を選びます。Python用タスクとは区別します。

### 6.1 パッケージ・場所・型を準備する

```r
library(readr)
library(dplyr)
source_file <- "exercises/lesson06/data/study_records.csv"
column_types <- cols(id = col_character(), place = col_character(),
                     study_minutes = col_double(), quiz_score = col_double())
```

`library(readr)` はCSVを読む・書く関数、`library(dplyr)` は表を加工する関数を使えるようにします。既に用意されたパッケージを読み込む操作で、インストールとは別です。`<-` は右側の値を左の名前へ代入します。

Rではここでパスを文字列として `source_file` に保存します。授業タスクの作業場所はPythonと同じworkです。`cols(...)` は列名と読み方の対応をまとめた指定を返します。`col_character()` は文字列として読む指定、`col_double()` は小数を扱う数値として読む指定を返し、ここでは引数は不要です。

```r
records <- read_csv(source_file, col_types = column_types, na = "",
                    show_col_types = FALSE, progress = FALSE)
print(dim(records))
print(names(records))
print(sapply(records, class))
print(colSums(is.na(records)))
```

`read_csv` は第1引数のCSVを読み、tibbleという表を返します。`col_types=column_types` は列の型、`na=""` は空欄を欠損として読む指定です。`show_col_types=FALSE` は型指定の案内表示を、`progress=FALSE` は進行表示を省く指定で、データの値は変えません。Rでは論理値を `TRUE` / `FALSE` と書き、欠損は `NA` です。

### 6.2 確認する式を内側から読む

| 式 | 戻り値と読み方 |
| --- | --- |
| `dim(records)` | 行数・列数の順の数値。今回は `12 4` |
| `names(records)` | 列名の文字列ベクトル |
| `sapply(records, class)` | 各列に `class` を適用した型の一覧。characterが文字列、numericが数値 |
| `colSums(is.na(records))` | 欠損をTRUEとする表を作り、列ごとに合計した件数 |

`sapply` の第1引数は処理対象、第2引数は各列に適用する関数です。ここでは `class` という関数自体を渡すので `class()` と呼び出しません。`is.na(records)` は表の各セルをTRUE/FALSEで判定し、外側の `colSums` がTRUEを1、FALSEを0として列ごとに合計します。`print` はそれを表示します。

### 6.3 欠損・行・列を選ぶ

```r
complete <- records |>
  filter(!is.na(study_minutes), !is.na(quiz_score))
```

`|>` は左の結果を右の関数の第1引数へ渡す記号です。上の式は `filter(records, !is.na(study_minutes), !is.na(quiz_score))` と同じ操作です。`filter` はすべての条件がTRUEの行を残した表を返します。コンマで並べた二つの条件を両方満たす必要があります。

`!` は「ではない」なので、必要な値が欠損ではない行を残します。`nrow(complete)` は行数、`complete$id` はid列の値を返します。主例の `cat("欠損処理後の件数:", nrow(complete), "\n")` は文字と値を順に表示し、`"\n"` で改行します。0分のF、場所だけ不明のHは残ります。

```r
minimum_minutes <- 30
selected <- complete |>
  filter(study_minutes >= minimum_minutes) |>
  select(id, study_minutes, quiz_score) |>
  mutate(study_hours = study_minutes / 60)
```

上から、行を選ぶ→列を選ぶ→列を作る、の順です。`filter` は30分以上の行を返し、`select` は指定した名前・順序の列を持つ表を返します。`mutate(study_hours = study_minutes / 60)` は、各行の分を60で割った列を追加した表を返します。各段階の表を次へ渡し、最後を `selected` に代入します。

### 6.4 保存先を作り、読み直す

```r
output <- "exercises/lesson06/output"
dir.create(output, recursive = TRUE, showWarnings = FALSE)
output_file <- file.path(output, "lesson06_r.csv")
write_csv(selected, output_file)
reloaded <- read_csv(output_file,
  col_types = cols(id = col_character(), .default = col_double()),
  show_col_types = FALSE, progress = FALSE)
```

`dir.create` は第1引数のフォルダーを作ります。`recursive=TRUE` は途中の親フォルダーも作る指定、`showWarnings=FALSE` は既にある場合などの警告表示を省く指定です。作成の成否を論理値で返しますが、この主例では代入しません。保存そのものに失敗した場合は後の `write_csv` のエラーを確認します。

`file.path` はフォルダーとファイル名をつなぎ、保存先の文字列を返します。`write_csv` は第1引数の表を第2引数の場所へ保存し、行番号を追加しません。同名の加工結果は更新されます。戻り値は入力の表を画面に自動表示しない形で返しますが、ここでは保存という操作を利用しています。

再読込の `cols` は、idだけを文字列、`.default=col_double()` で残りを数値として読む指定です。`reloaded` に新しく読み直した表を保存します。

### 6.5 保存前後の一致を確かめる

```r
cat("再読込の件数:", nrow(reloaded), "\n")
print(names(reloaded))
cat("保存前と一致:", isTRUE(all.equal(as.data.frame(selected),
                                      as.data.frame(reloaded))), "\n")
```

長い式は内側から読みます。

1. `as.data.frame(selected)` と `as.data.frame(reloaded)` は、二つの表を基本的なdata.frame形式にして返します。CSV読込時の付加情報などではなく、比較する表の形式を揃えます。
2. `all.equal(保存前, 再読込後)` は二つを比べます。一致と判定した場合は `TRUE`、違いがある場合は違いを説明する文字列などを返します。数値には小さな丸め誤差の許容があり、Pythonの `equals` と完全に同じ判定規則ではありません。
3. `isTRUE(...)` は内側の結果が単一のTRUEなら `TRUE`、それ以外なら `FALSE` を返します。文字列も返し得る比較結果を、真偽の表示に揃えています。
4. `cat` が見出しと真偽を表示します。FALSEなら `all.equal(...)` の部分を `print` して違いを確認できます。

今回の値では両言語とも一致の結果になります。件数だけが同じでも値やIDが違う可能性があるため、保存前後の比較と元データの目視確認を組み合わせます。

**成功の目印：** 12→10→8行、保存先は `output/lesson06_r.csv`。再読込の比較は `TRUE` になります。Pythonと同じID・列・数値を確認します。画面の桁数や表の飾りの違いは誤りではありません。

## 7．必須演習：30分以上を60分以上へ

1. `exercise06.py` を開きます。実行前に、60分以上で残るIDを元CSVから予想します。
2. `minimum_minutes = 30` の **30だけを60** に変えます。
3. 保存してPython用タスクで実行します。
4. `exercise06.R` を開き、`minimum_minutes <- 30` の30を60に変えます。
5. 保存してR用タスクで実行します。
6. 二つの演習用CSVを開き、予想したID・件数・時間換算を照合します。

変数名、入力パス、出力名は配布例を使います。入力確認、途中の `complete`、保存・再読込の処理を消しません。

確認すること：60分ちょうどの記録を含むか。場所が空欄のHは残るか。Fは欠損処理後には残り、時間条件で除外されているか。最後の結果だけでなく、途中の表も読んでください。

Copilotを使う場合の例：「必要な列は学習時間と得点です。場所が空欄の行を残す理由と、確認方法を一つ説明してください」。回答を読んだら、Hの元の値と実行結果を自分で確かめます。使わなくても同じ確認を行います。

## 8．確認問題と形式の比較

1. 0と空欄を同じものとして扱うと、何が変わりますか。
2. Hを残し、C・Gを除く理由を説明してください。
3. 60分を含める条件は `>= 60` と `> 60` のどちらですか。保存前後は何を比べますか。

JSONは「列名と値の組」を持つ記録の並びとしても表せます。CSVの空欄に当たる値は、今回のJSONでは `null` です。HTMLは表の見せ方、XMLはタグで構造を記述できます。教員が配布ファイルを読み比べます。ネットからの収集やHTML/XMLの実装は今回の必須課題ではありません。

## 9．第7回と提出

[第7回の課題案内](next/assignment.md)を読み、分布を調べるAか、時間と得点を見るBを選びます。主言語で分析し、もう一方で元CSVから結果を照合します。今回の「60分以上のCSV」を、そのまま全体分析に使わないことが大切です。

第6回はFormsへPythonとRの演習コード**全文**を提出します。コード欄でCtrl+A、Ctrl+Cして貼ります。実行結果や変更した1行だけではありません。各言語50点（実行・入力確認・欠損処理・条件と換算・保存と再読込の各10点）です。

予想・実行結果・確認方法と実行状況も回答します。Copilot利用欄は任意で、利用自体は加点・減点しません。未完でも取り組んだコードと支援が必要な点を提出します。URLと締切はClassroomの案内に従います。

## 自己チェック

- [ ] work全体を開き、入力CSVを見つけた。
- [ ] 型・欠損件数と、0が欠損ではないことを確認した。
- [ ] 除いた行と残した行の理由を説明できる。
- [ ] 両言語の演習を保存して実行し、出力CSVを読み直した。
- [ ] コード全文と確認方法を提出し、第7回の課題を確認した。

## 困ったときの確認順

| 状況 | 最初に確かめること |
| --- | --- |
| CSVが見つからない | work全体を開いたか。`exercises/lesson06/data/study_records.csv` があるか。ZIPの展開が二重になっていないか |
| 数値として読めない | 通常の主例で `type_error.csv` を選んでいないか。元CSVを編集していないか |
| 件数が違う | 入力12→必要2列の欠損除去10→30分以上8、のどの段階で違うか |
| 保存前と一致しない | 出力ファイル名・列名・列の型・行順・Pythonの行番号を確認する（5節、6.4〜6.5節） |
| パッケージを読み込めない | 授業用DSProg2026のworkを開き、対応する授業タスクで実行したか。自分で一括更新せず、エラー全文を教員へ示す |

`output/` のファイルを修正して数字を合わせず、コードと条件を確認して再実行してください。元の `data/` はそのまま残します。
