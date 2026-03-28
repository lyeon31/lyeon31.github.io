const cursor = document.querySelector(".cursor");
const cursorImage = cursor?.querySelector("img");

if (cursor && cursorImage) {
  const defaultCursorSrc = "./mouse_pixel.png";
  const hoverCursorSrc = "./mouse_pixel_hover.png";
  let isPointerDown = false;
  const keepCursorVisible = document.body.classList.contains("portfolio-main-body");

  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursor.style.opacity = "1";
  });

  window.addEventListener("mouseleave", () => {
    if (!isPointerDown && !keepCursorVisible) {
      cursor.style.opacity = "0";
    }
  });

  cursor.style.opacity = keepCursorVisible ? "1" : "0";

  window.addEventListener("mousedown", () => {
    isPointerDown = true;
    cursor.style.opacity = "1";
  });

  window.addEventListener("mouseup", () => {
    isPointerDown = false;
    cursor.style.opacity = "1";
  });

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

const draggableItems = document.querySelectorAll(".draggable-card, .project-chip");
const isDraggablePage =
  document.body.classList.contains("portfolio-main-body") ||
  document.body.classList.contains("home-body");

if (draggableItems.length > 0 && isDraggablePage) {
  draggableItems.forEach((card) => {
    let isDragging = false;
    let moved = false;
    let offsetX = 0;
    let offsetY = 0;

    const onPointerMove = (event) => {
      if (!isDragging) {
        return;
      }

      event.preventDefault();
      moved = true;
      if (cursor) {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.style.opacity = "1";
      }
      const parentRect = card.offsetParent?.getBoundingClientRect();

      if (!parentRect) {
        return;
      }

      const nextLeft = event.clientX - parentRect.left - offsetX;
      const nextTop = event.clientY - parentRect.top - offsetY;

      card.style.left = `${nextLeft}px`;
      card.style.top = `${nextTop}px`;
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
      event.preventDefault();
      const rect = card.getBoundingClientRect();
      const parentRect = card.offsetParent?.getBoundingClientRect();

      if (!parentRect) {
        return;
      }

      isDragging = true;
      moved = false;
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      if (cursor) {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.style.opacity = "1";
      }
      card.style.left = `${rect.left - parentRect.left}px`;
      card.style.top = `${rect.top - parentRect.top}px`;
      card.style.zIndex = String(Date.now());
      card.setPointerCapture(event.pointerId);
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
