# /fix-reveal-export 使い方

`/fix-reveal-export [新規ディレクトリ] [元ソースディレクトリ]`

## 例:

`/fix-reveal-export bmfsa2025 ~/GitHub/bmfsa2025`

## カスタムコマンドの仕組み

|項目|説明|
|:-|:-|
|保存場所|.claude/commands/|
|ファイル名|コマンド名.md → /コマンド名 で呼び出し|
|引数|$ARGUMENTS で受け取り|
|スコープ|このリポジトリ内でのみ有効|

## 確認

`ls .claude/commands/`

で作成したコマンドを確認できます。次回のvscode-revealエクスポート後に /fix-reveal-export を使ってみてください。