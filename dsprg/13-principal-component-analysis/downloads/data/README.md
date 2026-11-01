# iris固定データ仕様

出所: [R datasets::iris](https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/iris.html)。R 4.6.1の組み込みデータを元の行順で書き出し、列名を統一しI001〜I150を付加した。Python/Rで同じCSVを読み、第14回にもバイト一致で引き継ぐ。

150行、欠損なし。idとspeciesは文字列。sepal_length_cm、sepal_width_cm、petal_length_cm、petal_width_cmは数値で単位cm。種類はsetosa、versicolor、virginica各50行。PCAに種類・IDを混ぜず、4数値列のみを使用する。全150行の探索であり、予測評価用の分割は設けない。

CSVはUTF-8、LF、列順はid,4測定値,species。原データを変更せず、データ生成コマンドは既存ファイルが異なれば停止する。

SHA-256: `96491fd98b0a8a98fc8bcc5c0ca6708ee0b9245a69a9d4a959a06a8eb239b7d7`

出所情報はデータの説明であり、特定の分類器の正解や将来性能を保証しない。
