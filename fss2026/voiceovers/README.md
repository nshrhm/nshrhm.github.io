# Voiceover contract

The presentation contains 26 slides. Each MP3 file must map one-to-one
to the slide at the same position.

Expected filenames are zero-padded and continuous:

```text
slide_01.mp3
slide_02.mp3
...
slide_26.mp3
```

The Markdown reference for each slide is `./voiceovers/slide_XX.mp3`. MP3
generation is deferred for the current deck update. Slides 4 through 6 contain
revised explanations of the study scope and `H*`, slide 7 defines the
membership-function family, and the new funding slide is position 15.
The S/Z/pi appendix is position 23, followed by artifact and provenance
appendices at positions 24 and 25. The breakpoint and endpoint-handling
appendix is position 26. Slide 16 now announces the published Public repository
and requires regenerated narration. Regenerate slides 4 through 26 before
using the updated deck's audio playback:

```bash
uv run python paper/fss2026/presentation/generate_voiceover.py --start-slide 4 --end-slide 26
```

If slides are inserted, deleted, or reordered again, update all later
references and revalidate the full sequence before producing audio.
