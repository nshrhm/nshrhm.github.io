(() => {
  "use strict";

  const zoomableImageSelector = ".reveal .image-card img";
  let activeImage = null;
  let overlay = null;
  let overlayImage = null;

  const closeZoom = (restoreFocus = true) => {
    if (!overlay || !overlay.classList.contains("is-open")) {
      return;
    }

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    overlayImage.removeAttribute("src");
    overlayImage.setAttribute("alt", "");
    document.body.classList.remove("image-zoom-open");

    if (restoreFocus && activeImage && activeImage.isConnected) {
      activeImage.focus({ preventScroll: true });
    }

    activeImage = null;
  };

  const openZoom = (image) => {
    activeImage = image;
    overlayImage.src = image.currentSrc || image.src;
    overlayImage.alt = image.alt || "Enlarged presentation image";
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("image-zoom-open");
    overlay.focus({ preventScroll: true });
  };

  const initializeZoom = () => {
    overlay = document.createElement("div");
    overlay.className = "image-zoom-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Enlarged presentation image");
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("tabindex", "-1");

    overlayImage = document.createElement("img");
    overlayImage.alt = "";
    overlay.appendChild(overlayImage);
    document.body.appendChild(overlay);

    document.querySelectorAll(zoomableImageSelector).forEach((image) => {
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");
      image.setAttribute(
        "aria-label",
        `Enlarge image: ${image.alt || "presentation image"}`,
      );
    });

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (event.target.closest(".image-zoom-overlay")) {
        event.preventDefault();
        event.stopPropagation();
        closeZoom();
        return;
      }

      const image = event.target.closest(zoomableImageSelector);
      if (!image) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openZoom(image);
    });

    document.addEventListener("keydown", (event) => {
      const isActivationKey = event.key === "Enter" || event.key === " ";

      if (overlay.classList.contains("is-open")) {
        if (event.key === "Escape" || isActivationKey) {
          event.preventDefault();
          event.stopPropagation();
          closeZoom();
        }
        return;
      }

      if (!isActivationKey || !(event.target instanceof Element)) {
        return;
      }

      const image = event.target.closest(zoomableImageSelector);
      if (!image) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openZoom(image);
    });

    if (window.Reveal) {
      window.Reveal.on("slidechanged", () => closeZoom(false));
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeZoom, { once: true });
  } else {
    initializeZoom();
  }
})();
