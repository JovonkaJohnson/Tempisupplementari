const REQUIRED = ["1", "2", "3", "4", "5", "6"];
const FORCE_UNLOCK = ["1", "2", "3", "4", "5", "6", "7"];

localStorage.setItem("visitedPages", JSON.stringify(FORCE_UNLOCK));

function fadeOutPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  preloader.style.opacity = 0;
  setTimeout(() => preloader.style.display = "none", 500);
}

function waitForImagesToLoad(CARD_IMAGES, MENU_IMAGES) {

  const imagesToLoad = [...Object.values(CARD_IMAGES), ...Object.values(MENU_IMAGES)];

  const promises = imagesToLoad.map(src => {
    const img = new Image();
    img.src = src;
    return img.decode().catch(() => true);
  });

  return Promise.all(promises);
}

function applyImageWhenReady(el, src, isBg = false) {

  if (!src) return;

  const img = new Image();
  img.src = src;

  img.decode().then(() => {

    if (isBg) {
      el.style.backgroundImage = `url("${src}")`;
    } else {
      el.src = src;
    }

  }).catch(() => {

    if (isBg) {
      el.style.backgroundImage = `url("${src}")`;
    } else {
      el.src = src;
    }

  });

}

function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

function lazyLoadImages() {

  const imgs = document.querySelectorAll("img[data-src]");

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const img = entry.target;
      img.src = img.dataset.src;

      img.removeAttribute("data-src");

      observer.unobserve(img);

    });

  }, { rootMargin: "200px" });

  imgs.forEach(img => observer.observe(img));

}

const CARD_IMAGES = {
  "1": "images/Goalkeeping no text.webp",
  "2": "images/Workteam Card no text.webp",
  "5": "images/Close Contol Card no text.webp",
  "4": "images/Free Kick Card no text.webp",
  "3": "images/Assisting Card no text.webp",
  "6": "images/Giant Killer no text.webp"
};

const MENU_IMAGES = {
  "1": "images/Goalkeeping.webp",
  "2": "images/Workteam Card.webp",
  "5": "images/Close Contol Card.webp",
  "4": "images/Free Kick Card.webp",
  "3": "images/Assisting Card.webp",
  "6": "images/Giant Killer.webp"
};


function getVisited() {
  return JSON.parse(localStorage.getItem("visitedPages")) || [];
}

function getProgress() {

  const visited = getVisited();

  const completed = REQUIRED.filter(id => visited.includes(id)).length;

  return {
    completed,
    percent: (completed / REQUIRED.length) * 100
  };

}

document.addEventListener("DOMContentLoaded", () => {

  const visited = getVisited();

  const progress = getProgress();

  waitForImagesToLoad(CARD_IMAGES, MENU_IMAGES).then(() => {
    fadeOutPreloader();
  });


  const progressPanel = document.getElementById("progress-panel");
  const progressFill = document.getElementById("progress-bar-fill");
  const soccerBall = document.getElementById("soccer-ball");

  if (progressPanel)
    progressPanel.style.display = progress.completed === REQUIRED.length ? "none" : "block";

  if (progressFill)
    progressFill.style.width = `${progress.percent}%`;

  if (soccerBall)
    soccerBall.style.left = `${progress.percent}%`;

  const finalOverlay = document.getElementById("final-overlay");
  const goFinalBtn = document.getElementById("go-final-card");

  if (progress.completed === REQUIRED.length && finalOverlay) {

    finalOverlay.style.display = "block";

    if (goFinalBtn) {

      goFinalBtn.addEventListener("click", () => {

        const target = document.getElementById("final-section");

        if (target) {

          finalOverlay.style.display = "none";

          target.scrollIntoView({ behavior: "smooth" });

        } else {

          window.location.href = "index.html#final-section";

        }

      });

    }

  }


  document.querySelectorAll(".card-slot").forEach(slot => {

    const id = slot.dataset.card;

    if (visited.includes(id) && CARD_IMAGES[id]) {

      slot.classList.add("completed");

      applyImageWhenReady(slot, CARD_IMAGES[id], true);

    }

  });


  document.querySelectorAll(".menu-btn").forEach(btn => {

    const id = btn.dataset.id;

    if (visited.includes(id) && MENU_IMAGES[id]) {

      applyImageWhenReady(btn, MENU_IMAGES[id]);

      btn.classList.remove("locked");

      btn.classList.add("unlocked");

    }

    btn.addEventListener("click", () => {

      const page = btn.dataset.page;

      if (page)
        window.location.href = page;

    });

  });

  const parallaxContainer = document.querySelector(".parallax-layers");

  if (parallaxContainer) {

    const layers = [
      { el: parallaxContainer.querySelector(".layer-1"), speed: 0.1 },
      { el: parallaxContainer.querySelector(".layer-2"), speed: 0.25 },
      { el: parallaxContainer.querySelector(".layer-3"), speed: 0.15 }
    ];

    window.addEventListener("scroll", () => {

      const scrollY = window.scrollY;

      layers.forEach(layer => {

        if (!layer.el) return;

        layer.el.style.transform =
          `translate3d(0, ${scrollY * layer.speed}px, 0)`;

      });

    }, { passive: true });

  }

  requestIdleCallback(() => {
    lazyLoadImages();
  });

});