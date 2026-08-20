(() => {
  "use strict";

  const canvases = document.querySelectorAll(".vas-canvas");

  canvases.forEach((canvas) => {
    const context = canvas.getContext("2d");
    let selectedPosition = null;

    if (!context) {
      return;
    }

    const color = (name, fallback) =>
      getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;

    const geometry = () => {
      const bounds = canvas.getBoundingClientRect();
      const inset = Math.min(18, bounds.width / 4);

      return {
        bounds,
        inset,
        lineWidth: Math.max(0, bounds.width - inset * 2),
      };
    };

    const drawEndpoint = (x, y) => {
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      context.fillStyle = color("--accent", "#173f73");
      context.fill();

      context.beginPath();
      context.arc(x, y, 7, 0, Math.PI * 2);
      context.fillStyle = "#ffffff";
      context.fill();

      context.beginPath();
      context.arc(x, y, 4.5, 0, Math.PI * 2);
      context.fillStyle = color("--accent", "#173f73");
      context.fill();
    };

    const draw = () => {
      const { bounds, inset, lineWidth } = geometry();

      if (bounds.width === 0 || bounds.height === 0) {
        return;
      }

      const pixelRatio = window.devicePixelRatio || 1;
      const pixelWidth = Math.round(bounds.width * pixelRatio);
      const pixelHeight = Math.round(bounds.height * pixelRatio);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);

      const centerY = bounds.height / 2;
      const gradient = context.createLinearGradient(
        inset,
        centerY,
        bounds.width - inset,
        centerY,
      );
      gradient.addColorStop(0, color("--muted", "#52616f"));
      gradient.addColorStop(0.5, color("--cyan", "#167d9a"));
      gradient.addColorStop(1, color("--accent", "#173f73"));

      context.beginPath();
      context.moveTo(inset, centerY);
      context.lineTo(bounds.width - inset, centerY);
      context.lineWidth = 5;
      context.lineCap = "round";
      context.strokeStyle = gradient;
      context.stroke();

      drawEndpoint(inset, centerY);
      drawEndpoint(bounds.width - inset, centerY);

      if (selectedPosition !== null) {
        const markerX = inset + selectedPosition * lineWidth;

        context.save();
        context.shadowColor = "rgba(23, 63, 115, 0.28)";
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(markerX, centerY, 11, 0, Math.PI * 2);
        context.fillStyle = color("--orange", "#c75b24");
        context.fill();
        context.shadowColor = "transparent";
        context.lineWidth = 4;
        context.strokeStyle = "#ffffff";
        context.stroke();
        context.restore();
      }
    };

    const selectPosition = (position) => {
      selectedPosition = Math.min(1, Math.max(0, position));
      canvas.setAttribute("aria-valuenow", String(Math.round(selectedPosition * 100)));
      canvas.setAttribute("aria-valuetext", "選択済み");
      draw();
    };

    canvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const { bounds, inset, lineWidth } = geometry();
      selectPosition((event.clientX - bounds.left - inset) / lineWidth);
      canvas.focus({ preventScroll: true });
    });

    canvas.addEventListener("keydown", (event) => {
      const step = 0.01;
      const startingPosition = selectedPosition ?? 0.5;
      let nextPosition = null;

      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        nextPosition = startingPosition - step;
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        nextPosition = startingPosition + step;
      } else if (event.key === "Home") {
        nextPosition = 0;
      } else if (event.key === "End") {
        nextPosition = 1;
      }

      if (nextPosition !== null) {
        event.preventDefault();
        event.stopPropagation();
        selectPosition(nextPosition);
      }
    });

    if (typeof ResizeObserver === "function") {
      new ResizeObserver(draw).observe(canvas);
    }

    window.addEventListener("resize", draw);

    const initializeRevealEvents = () => {
      draw();

      if (window.Reveal && typeof window.Reveal.on === "function") {
        window.Reveal.on("slidechanged", draw);
        window.Reveal.on("resize", draw);
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeRevealEvents, {
        once: true,
      });
    } else {
      initializeRevealEvents();
    }
  });
})();
