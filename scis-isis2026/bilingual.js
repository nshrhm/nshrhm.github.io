(() => {
  "use strict";

  // This helper changes only caption text. The original helper owns fragments,
  // slide-entry resets and the English speaker-note blocks.
  const editable = (target) => Boolean(target?.closest?.(
    "input, textarea, select, [contenteditable]:not([contenteditable='false'])"
  ));
  const suppressed = (event) => event?.repeat || event?.isComposing ||
    event?.ctrlKey || event?.metaKey || event?.altKey || event?.shiftKey ||
    editable(event?.target);

  const initialize = () => {
    const deck = window.Reveal;
    const mount = () => {
      const data = window.SCIS_BILINGUAL_DATA;
      const rails = [];
      document.querySelectorAll(".slide-body[data-paper-page]").forEach((body) => {
        const rail = body.closest("section").querySelector(".caption-rail");
        const pairs = data[body.dataset.paperPage];
        if (!rail || !pairs || rail.children.length !== pairs.length) {
          throw new Error("Bilingual captions: caption count mismatch.");
        }
        const spans = Array.from(rail.children);
        spans.forEach((span, index) => {
          if (span.textContent.replace(/\s+/g, " ").trim() !== pairs[index].en || !pairs[index].ja) {
            throw new Error("Bilingual captions: translation/source mismatch.");
          }
        });
        rails.push({ rail, spans, pairs });
      });

      const button = document.createElement("button");
      button.className = "caption-language-toggle";
      button.type = "button";
      button.setAttribute("aria-keyshortcuts", "T");
      // Keep the small speaker previews clear; their keyboard bridge still works.
      if (!deck.isSpeakerNotes()) deck.getRevealElement().appendChild(button);
      const applyLocal = (language) => {
        rails.forEach(({ rail, spans, pairs }) => {
          rail.setAttribute("aria-label", language === "ja" ? "日本語字幕" : "English captions");
          spans.forEach((span, index) => {
            span.textContent = pairs[index][language];
            span.lang = language;
          });
        });
        document.documentElement.dataset.captionLanguage = language;
        button.textContent = `T: ${language === "ja" ? "日本語 → EN" : "EN → 日本語"}`;
        button.setAttribute("aria-label", language === "ja" ? "Switch captions to English" : "字幕を日本語に切り替える");
      };

      let control;
      if (deck.isSpeakerNotes()) {
        // The bundled notes popup and both preview frames share this origin.
        // Address its opener explicitly so separate rehearsal tabs stay isolated.
        control = window.parent.opener?.ScisCaptionLanguage;
        if (!control) throw new Error("Open speaker view with S from the main window.");
        const unsubscribe = control.subscribe(applyLocal);
        window.addEventListener("pagehide", unsubscribe, { once: true });
        control.attachSpeakerWindow(window.parent);
      } else {
        let language = "en";
        const listeners = new Set();
        const speakerDocuments = new WeakSet();
        control = {
          toggle() {
            language = language === "en" ? "ja" : "en";
            applyLocal(language);
            listeners.forEach((listener) => listener(language));
          },
          subscribe(listener) {
            listeners.add(listener);
            listener(language);
            return () => listeners.delete(listener);
          },
          attachSpeakerWindow(speaker) {
            const doc = speaker.document;
            if (speakerDocuments.has(doc)) return;
            speakerDocuments.add(doc);
            doc.addEventListener("keydown", (event) => {
              if (event.code !== "KeyT" && event.keyCode !== 84) return;
              // Notes 4.3.1 otherwise forwards only keyCode to its iframe,
              // losing repeat/IME/modifier/input information. Intercept T alone.
              event.stopImmediatePropagation();
              if (suppressed(event) || doc.activeElement?.tagName === "SELECT") return;
              event.preventDefault();
              control.toggle();
            }, true);
          },
        };
        window.ScisCaptionLanguage = control;
        applyLocal(language);
      }

      deck.addKeyBinding({ keyCode: 84, key: "T", description: "Caption language: EN / 日本語" }, (event) => {
        if (!suppressed(event)) control.toggle();
      });
      button.addEventListener("click", () => control.toggle());
    };
    if (deck.isReady()) mount();
    else deck.on("ready", mount);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else initialize();
})();
