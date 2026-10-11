(() => {
  "use strict";

  // Notes are the only caption text source. Reveal owns navigation and state.
  const initialize = () => {
    const deck = window.Reveal;
    if (!deck) {
      throw new Error("PROTOTYPE-01 requires Reveal to be loaded.");
    }

    const mount = () => {
      const speakerBlocks = new WeakMap();
      document.querySelectorAll(".reveal .slide-body[data-paper-page]").forEach((body) => {
        const slide = body.closest("section");
        if (slide.querySelector(".caption-rail")) return;
        const notes = slide.querySelector("aside.notes");
        const units = notes?.querySelectorAll("[data-caption]");
        if (!units?.length) throw new Error("Each prototype slide needs a caption in its notes.");

        // Keep every note paragraph, grouped by the existing caption boundaries.
        // Introductory paragraphs belong to the first block; unmarked paragraphs
        // after a caption stay with it until the next caption begins.
        const blocks = [[]];
        let captionCount = 0;
        Array.from(notes.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("data-caption") && captionCount++ > 0) {
            blocks.push([]);
          }
          blocks.at(-1).push(node.cloneNode(true));
        });
        speakerBlocks.set(slide, { notes, blocks });

        const rail = document.createElement("div");
        rail.className = "caption-rail";
        rail.setAttribute("role", "status");
        rail.setAttribute("aria-live", "polite");
        rail.setAttribute("aria-atomic", "true");
        rail.setAttribute("aria-label", "Speaker caption");

        units.forEach((unit, index) => {
          const cue = document.createElement("span");
          cue.textContent = unit.textContent.trim();
          cue.className = index === 0 ? "caption-initial" : "fragment";
          if (index > 0) cue.setAttribute("data-fragment-index", String(index - 1));
          rail.appendChild(cue);
        });
        slide.appendChild(rail);
      });

      const reflectCaption = () => {
        const slide = deck.getCurrentSlide();
        const rail = slide?.querySelector(".caption-rail");
        if (!rail) return;
        const current = Array.from(rail.querySelectorAll(".fragment.visible")).at(-1);
        const cues = Array.from(rail.children);
        const activeIndex = current ? cues.indexOf(current) : 0;
        cues.forEach((cue, index) => {
          const active = index === activeIndex;
          cue.setAttribute("aria-hidden", String(!active));
        });
        // Reveal's standard notes plugin publishes this block on the same
        // fragment/slide events. No separate notes-navigation state is needed.
        const speaker = speakerBlocks.get(slide);
        speaker.notes.replaceChildren(...speaker.blocks[activeIndex].map((node) => node.cloneNode(true)));
      };

      deck.on("fragmentshown", reflectCaption);
      deck.on("fragmenthidden", reflectCaption);
      deck.on("slidechanged", () => {
        // Re-entering by Previous, overview or direct navigation starts at cue 1.
        deck.navigateFragment(-1);
        reflectCaption();
      });
      deck.configure({
        width: 1600,
        height: 900,
        center: false,
        margin: 0.04,
        fragments: true,
        autoSlide: 0,
        transition: "none",
      });
      deck.sync();
      deck.navigateFragment(-1);
      reflectCaption();
    };

    if (deck.isReady()) mount();
    else deck.on("ready", mount);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
