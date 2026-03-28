const cursor = document.querySelector(".cursor");
const cursorImage = cursor?.querySelector("img");

if (cursor && cursorImage) {
  const defaultCursorSrc = "./mouse_pixel.png";
  const hoverCursorSrc = "./mouse_pixel_hover.png";

  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursor.style.opacity = "1";
  });

  window.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  cursor.style.opacity = "0";

  const hoverTargets = document.querySelectorAll("a, button, [role='button']");

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursorImage.src = hoverCursorSrc;
    });

    target.addEventListener("mouseleave", () => {
      cursorImage.src = defaultCursorSrc;
    });
  });
}

const wheelTrack = document.querySelector(".wheel-track");
const wheelZone = document.querySelector(".portfolio-hero");

if (wheelTrack && wheelZone) {
  const orbitCards = Array.from(document.querySelectorAll(".orbit-card"));

  const updateWheel = () => {
    const rect = wheelZone.getBoundingClientRect();
    const available = Math.max(wheelZone.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / available, 0), 1);
    const rotation = progress * 220;

    wheelTrack.style.transform = `rotate(${rotation}deg)`;

    orbitCards.forEach((card) => {
      card.style.transform = `rotate(${-rotation}deg)`;
    });
  };

  updateWheel();
  window.addEventListener("scroll", updateWheel, { passive: true });
  window.addEventListener("resize", updateWheel);
}

const liveClock = document.querySelector("[data-live-clock]");

if (liveClock) {
  const formatClock = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const updateClock = () => {
    liveClock.textContent = formatClock();
  };

  updateClock();
  window.setInterval(updateClock, 1000);
}

const infoModal = document.querySelector("[data-info-modal]");
const openInfoButtons = document.querySelectorAll("[data-open-info]");
const closeInfoButtons = document.querySelectorAll("[data-close-info]");

if (infoModal) {
  const openInfoModal = () => {
    infoModal.hidden = false;
    infoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeInfoModal = () => {
    infoModal.hidden = true;
    infoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  openInfoButtons.forEach((button) => {
    button.addEventListener("click", openInfoModal);
  });

  closeInfoButtons.forEach((button) => {
    button.addEventListener("click", closeInfoModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !infoModal.hidden) {
      closeInfoModal();
    }
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("overlay") === "info") {
    openInfoModal();
  }
}

const draggableCards = document.querySelectorAll(".draggable-card");
const isPortfolioBoard = document.body.classList.contains("portfolio-main-body");

if (draggableCards.length > 0 && isPortfolioBoard) {
  draggableCards.forEach((card) => {
    let isDragging = false;
    let moved = false;
    let offsetX = 0;
    let offsetY = 0;

    const onPointerMove = (event) => {
      if (!isDragging) {
        return;
      }

      moved = true;
      card.style.left = `${event.clientX - offsetX}px`;
      card.style.top = `${event.clientY - offsetY}px`;
    };

    const onPointerUp = () => {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      window.setTimeout(() => {
        moved = false;
      }, 0);
    };

    card.addEventListener("pointerdown", (event) => {
      const rect = card.getBoundingClientRect();
      isDragging = true;
      moved = false;
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      card.style.left = `${rect.left}px`;
      card.style.top = `${rect.top}px`;
      card.style.zIndex = String(Date.now());
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    });

    card.addEventListener("click", (event) => {
      if (moved) {
        event.preventDefault();
      }
    });
  });
}
