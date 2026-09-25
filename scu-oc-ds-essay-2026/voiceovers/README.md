# Voiceover contract

`slide.md` の全88枚と、次のMP3を一対一で対応させます。

```text
slide_01.mp3
slide_02.mp3
...
slide_88.mp3
```

MP3はこのディレクトリに置きます。各スライドは、再生コントロールを表示する `<audio controls ... type="audio/mpeg">` 形式で参照します。スライドの追加、削除、並べ替えを行った場合は、目的コメント、`<audio>`、speaker notesとMP3を全スライドで再採番してください。

## 生成前の確認

通信もMP3生成も行わないdry-run：

```bash
make voiceovers-dry-run
```

範囲指定、入力、出力先、音声の上書き例：

```bash
UV_CACHE_DIR=/tmp/slide-oc2026-essay-uv-cache uv run python generate_voiceover.py \
  --input presentation/slide.md \
  --output-dir presentation/voiceovers \
  --voice ja-JP-NanamiNeural \
  --start-slide 1 \
  --end-slide 88 \
  --dry-run
```

## ユーザーによる生成

`make voiceovers` は外部の音声サービスへ接続し、既存の同名MP3を上書きし得ます。内容を確認してから、ユーザーが実行してください。

```bash
make voiceovers
make check-audio
```

このパッケージ作成時点ではMP3を生成していません。
