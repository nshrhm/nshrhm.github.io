# Reveal export 修復記録

- 修正対象: `/home/naruki/GitHub/slide-oc2026-essay/presentation-20260927/export`
- 元ソース: `/home/naruki/GitHub/slide-oc2026-essay/presentation-20260927`
- ライブラリコピー元: `/home/naruki/.vscode-server/extensions/evilz.vscode-reveal-4.3.3`（同じReveal 4.3.1。関連CSSの同一性も確認）
- 既知の正常プレゼン候補 `/home/naruki/nshrhm.github.io/iihmsp2025/` は存在しなかったため使用していません。
- 元スライド、元音声、生成スクリプトなどexport外の201ファイルは作業前後のハッシュが一致。

## 修復内容

- PNG 7件とフォント3件を置換し、不足フォント24件を追加しました。再エクスポートで破損したMP3 20件も元音声から復元しました（音声生成は未実施）。
- `index.html` はFont Awesome参照を更新し、djlintで整形しました。リンク更新以外のHTML要素・属性・本文は空白正規化した比較で一致しています。
- CSSリンクは修復前後とも `./style.css`。CSSと図表拡大JSは元ファイルと同一で、修正不要でした。
- 元スライドのfront matterは既にCSSのリスト形式です。修正・修正提案はありません。
- 断片CSSファイルはありません。未解決ファイルはありません。

Font Awesome参照：

- 変更前: `https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css`
- 変更後: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`

## 置換・追加したファイル

コピー元をS（元ソース）、L（インストール済み拡張）と表記します。コピー元・コピー先はそれぞれのディレクトリから同じ相対パスです。完全パス、変更前後SHA-256、file判定は `repair-report.json` に記録しています。

| 対象相対パス | コピー元 | 操作 |
|---|---|---|
| `assets/2026-suisen-p05.png` | S | 置換 |
| `assets/qr-admissions.png` | S | 置換 |
| `assets/qr-past-exams.png` | S | 置換 |
| `libs/reveal.js/4.3.1/plugin/chalkboard/img/blackboard.png` | L | 置換 |
| `libs/reveal.js/4.3.1/plugin/chalkboard/img/boardmarker-black.png` | L | 置換 |
| `libs/reveal.js/4.3.1/plugin/chalkboard/img/chalk-white.png` | L | 置換 |
| `libs/reveal.js/4.3.1/plugin/chalkboard/img/sponge.png` | L | 置換 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-brands-400.eot` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-brands-400.svg` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-brands-400.ttf` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-brands-400.woff` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-brands-400.woff2` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-regular-400.eot` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-regular-400.svg` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-regular-400.ttf` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-regular-400.woff` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-regular-400.woff2` | L | 置換 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-solid-900.eot` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-solid-900.svg` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-solid-900.ttf` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-solid-900.woff` | L | 追加 |
| `libs/reveal.js/4.3.1/plugin/menu/font-awesome/webfonts/fa-solid-900.woff2` | L | 置換 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-italic.eot` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-italic.ttf` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-italic.woff` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-regular.eot` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-regular.ttf` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-regular.woff` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-semibold.eot` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-semibold.ttf` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-semibold.woff` | L | 置換 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-semibolditalic.eot` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-semibolditalic.ttf` | L | 追加 |
| `libs/reveal.js/4.3.1/theme/fonts/source-sans-pro/source-sans-pro-semibolditalic.woff` | L | 追加 |
| `voiceovers/slide_01.mp3` | S | 置換 |
| `voiceovers/slide_02.mp3` | S | 置換 |
| `voiceovers/slide_03.mp3` | S | 置換 |
| `voiceovers/slide_04.mp3` | S | 置換 |
| `voiceovers/slide_05.mp3` | S | 置換 |
| `voiceovers/slide_06.mp3` | S | 置換 |
| `voiceovers/slide_07.mp3` | S | 置換 |
| `voiceovers/slide_08.mp3` | S | 置換 |
| `voiceovers/slide_09.mp3` | S | 置換 |
| `voiceovers/slide_10.mp3` | S | 置換 |
| `voiceovers/slide_11.mp3` | S | 置換 |
| `voiceovers/slide_12.mp3` | S | 置換 |
| `voiceovers/slide_13.mp3` | S | 置換 |
| `voiceovers/slide_14.mp3` | S | 置換 |
| `voiceovers/slide_15.mp3` | S | 置換 |
| `voiceovers/slide_16.mp3` | S | 置換 |
| `voiceovers/slide_17.mp3` | S | 置換 |
| `voiceovers/slide_18.mp3` | S | 置換 |
| `voiceovers/slide_19.mp3` | S | 置換 |
| `voiceovers/slide_20.mp3` | S | 置換 |

## 検証結果

- `file`: PNG 7件はPNG image data、フォント27件はWOFF/WOFF2/TrueType/EOT/SVGの妥当な形式、MP3 20件はMPEG。WOFF/WOFF2の埋め込みサイズも実サイズと一致。
- HTMLタグ対応・20スライド・20ノート・20音声を確認。HTML/CSSのローカル参照93件はすべて解決。
- djlint: 整形実施、`--check` は `0 files would be updated`、lintエラー0件。除外はH014/H021/H031のみ。
- `make -C presentation-20260927 check-audio`: PASS（構造、ノート、音声、ハッシュ、汎用音声生成テストを含む）。
- Chromiumで修復後のexport/index.htmlを直接開き、全20枚の画像欠落0・画面外はみ出し0・ノート非表示を確認。図表のクリック／Enterによる拡大、Escape／背景クリック／スライド切替による終了を確認。
- ブラウザーはHTTP(S)通信を遮断。外部CDNの応答と全音声の通し聴取は未確認。

## 作業中の上書きへの対応

最初の修復後に別のエクスポート処理が画像・HTML等を上書き。ユーザーによるエクスポート完了の確認後、再検査・再修復。追加で破損MP3全20件を元音声から復元した。
