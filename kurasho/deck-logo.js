(() => {
  "use strict";

  if (document.querySelector(".deck-logo")) {
    return;
  }

  const logoLink = document.createElement("a");
  logoLink.className = "deck-logo";
  logoLink.href = "https://www.shimonoseki-cu.ac.jp/";
  logoLink.target = "_blank";
  logoLink.rel = "noopener noreferrer";
  logoLink.setAttribute(
    "aria-label",
    "下関市立大学公式サイトを新しいタブで開く",
  );
  logoLink.title = "下関市立大学公式サイト";

  logoLink.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });
  logoLink.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.body.prepend(logoLink);
})();
