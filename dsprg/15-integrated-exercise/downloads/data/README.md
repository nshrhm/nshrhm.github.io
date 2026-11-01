# データの出所と継承

`equipment.csv` は第8回で作った架空設備の合成データ80行です。訓練60・検証20のIDと分割を維持しています。稼働時間は時間、処理量は個、消費電力量はkWhです。最終確認20行は収録せず、今回使用しません。

`iris.csv` は登録済みDSProg2026のR 4.6.1 `datasets::iris` から第13回で固定した150行です。元の順にI001〜I150を付け、4測定値はcmです。種類は入力や正解に使いません。
[R公式のiris仕様](https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/iris.html)。

SHA-256:
- equipment.csv: `48be320fe66b9d95ae4abe810154e47ad8e8ee3e1217da58120202c52b42f4f0`
- iris.csv: `96491fd98b0a8a98fc8bcc5c0ca6708ee0b9245a69a9d4a959a06a8eb239b7d7`

原CSVを編集せず、条件変更はコードの指定箇所で行います。
