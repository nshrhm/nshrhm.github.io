# Voiceover contract

The presentation contains 32 slides. Each MP3 must map one-to-one to the slide at the same position.

Expected filenames are zero-padded and continuous:

```text
slide_01.mp3
...
slide_32.mp3
```

Each Markdown reference uses `./voiceovers/slide_XX.mp3`. MP3 generation is deferred unless separately authorized.

If slides are inserted, deleted, or reordered, renumber every later reference and rerun the structural audit before producing audio.

現在の対応（2026-09-29）：

- `slide_01.mp3`〜`slide_11.mp3`：既存ファイルを保持。
- `slide_12.mp3`〜`slide_16.mp3`：インストール準備の5枚。現在はファイルあり。
- `slide_17.mp3`〜`slide_31.mp3`：授業方針・GitHub Education・Copilot利用の15枚。現在はファイルあり。
- `slide_32.mp3`：既存の質問スライドの音声を `slide_17.mp3` から改名（初稿では `slide_12.mp3`）。ノートの本文・音声バイト列は変更していない。
- 改名前後の質問スライド音声のSHA-256：`5dd100b09be2e365d113c5962dd772ab978d506b9ea2c4c3512515aa4cace494`。

既存音声の再生・読み上げ内容との一致は今回未確認。CSS変更時に全32ファイルの存在と変更前後のハッシュ一致を確認した。今回のCSS変更作業では音声の生成・置換を行っていない。
