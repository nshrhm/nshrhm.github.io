# Voiceovers

このフォルダには、`slide.md` の話者ノートから生成したMP3を配置します。

- スライド数: 21
- ファイル名: `slide_01.mp3` ～ `slide_21.mp3`
- 対応: スライドN、N番目の `<aside class="notes">`、`slide_NN.mp3` が一対一
- 音声: `generate_voiceover.py` の既定値では `ja-JP-NanamiNeural`

全音声を生成する場合:

```bash
uv run python generate_voiceover.py
```

範囲を指定する場合:

```bash
uv run python generate_voiceover.py --start-slide 1 --end-slide 5
```

スライドを追加、削除、移動した場合は、音声生成前に `slide.md` の音声参照をスライド順へ再採番してください。生成後に構造を変えた場合は、古いMP3をそのまま流用せず、対応する話者ノートとファイルを再確認してください。
