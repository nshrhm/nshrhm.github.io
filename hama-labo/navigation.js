(() => {
  "use strict";
  const history = [];
  const slideFor = (id) => document.getElementById(id)?.closest("section");
  const go = (section) => {
    if (!section || !window.Reveal) return false;
    const { h, v } = window.Reveal.getIndices(section);
    window.Reveal.slide(h, v || 0);
    return true;
  };
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element && event.target.closest("a[data-slide], a[data-return]");
    if (!link || !window.Reveal) return;
    const current = window.Reveal.getCurrentSlide();
    if (link.hasAttribute("data-return")) {
      if (go(history.pop() || slideFor("topic-menu"))) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    const target = slideFor(link.dataset.slide);
    if (!target) return;
    if (current !== target && !current.querySelector("#topic-menu")) history.push(current);
    if (go(target)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, { capture: true });
})();
