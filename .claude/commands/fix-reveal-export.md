# vscode-reveal エクスポート修正

vscode-revealでエクスポートしたプレゼンテーションの破損ファイルを修正してください。

## 引数
$ARGUMENTS

形式: `[新規プレゼンディレクトリ] [元ソースディレクトリ]`

例: `bmfsa2025 ~/GitHub/bmfsa2025`

## 修正手順

1. **画像ファイルの確認と修正**
   - 新規プレゼンの`figures/`や`images/`内の画像を`file`コマンドで確認
   - 「data」と表示される破損ファイルを元ソースからコピー
   - `logo.png`等のルート画像も確認・修正

2. **libs内の破損ファイル修正**
   - `libs/reveal.js/4.3.1/plugin/chalkboard/img/*.png`を確認
   - 破損していれば`/home/naruki/nshrhm.github.io/iihmsp2025/libs/`からコピー
   - `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/`も同様に確認・コピー

3. **Font Awesome CDN更新**
   - index.htmlのFont Awesomeリンクを確認
   - 古いバージョン(4.5.0等)なら6.4.0に更新:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
   ```

4. **最終確認**
   - 全画像ファイルが正常なPNG形式か確認
   - webfontsが正常なwoff2形式か確認

## 参照プレゼン
正常に動作するプレゼン: `/home/naruki/nshrhm.github.io/iihmsp2025/`
