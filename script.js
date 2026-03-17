function fadeOutPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  preloader.style.opacity = 0;
  setTimeout(() => preloader.style.display = "none", 500);
}

function waitForImagesToLoad(CARD_IMAGES, MENU_IMAGES, visited) {
  const imagesToLoad = [];

  visited.forEach(id => {
    if (CARD_IMAGES[id]) imagesToLoad.push(CARD_IMAGES[id]);
    if (MENU_IMAGES[id]) imagesToLoad.push(MENU_IMAGES[id]);
  });

  const promises = imagesToLoad.map(src => {
    const img = new Image();
    img.src = src;
    return img.decode().catch(() => true);
  });

  return Promise.all(promises);
}

document.addEventListener("DOMContentLoaded", () => {
  const visited = JSON.parse(localStorage.getItem("visitedPages")) || [];

  waitForImagesToLoad(CARD_IMAGES, MENU_IMAGES, visited).then(() => {
    fadeOutPreloader();
  });
});

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
  if (!src) return;
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

function lazyLoadCardSlots(visited, CARD_IMAGES) {
  document.querySelectorAll(".card-slot").forEach(slot => {
    const id = slot.dataset.card;
    if (visited.includes(id)) {
      const src = CARD_IMAGES[id];
      if (src) preloadImage(src);
    }
  });
}

function preloadUnlockedMenuImages(visited, MENU_IMAGES) {
  visited.forEach(id => {
    const src = MENU_IMAGES[id];
    if (src) preloadImage(src);
  });
}

function initWebPLoader(visited, CARD_IMAGES, MENU_IMAGES) {
  requestIdleCallback(() => {
    lazyLoadImages();
    lazyLoadCardSlots(visited, CARD_IMAGES);
    preloadUnlockedMenuImages(visited, MENU_IMAGES);
  });
}

const REQUIRED = ["1", "2", "3", "4", "5", "6"];

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

function saveVisited(list) {
  localStorage.setItem("visitedPages", JSON.stringify(list));
}

function markPageVisited(pageId) {
  if (!REQUIRED.includes(pageId)) return;
  const visited = getVisited();
  if (!visited.includes(pageId)) {
    visited.push(pageId);
    saveVisited(visited);
  }
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

  const CURRENT_PAGE = document.body.dataset.page;

  if (CURRENT_PAGE) markPageVisited(CURRENT_PAGE);

  const visited = getVisited();
  const progress = getProgress();
  const progressPanel = document.getElementById("progress-panel");
  const progressFill = document.getElementById("progress-bar-fill");
  const soccerBall = document.getElementById("soccer-ball");
  const finalBtn = document.getElementById("final-cta-btn");

  if (progressPanel)
    progressPanel.style.display = progress.completed === REQUIRED.length ? "none" : "block";

  if (progressFill) progressFill.style.width = `${progress.percent}%`;
  if (soccerBall) soccerBall.style.left = `${progress.percent}%`;

  const finalOverlay = document.getElementById("final-overlay");
  const goFinalBtn = document.getElementById("go-final-card");

  if (progress.completed === REQUIRED.length) {

    finalOverlay.style.display = "block";

    goFinalBtn.addEventListener("click", () => {
      window.location.href = "page7.html";
    });

  }

  document.querySelectorAll(".card-slot").forEach(slot => {
    const id = slot.dataset.card;
    if (visited.includes(id) && CARD_IMAGES[id]) {
      slot.classList.add("completed");
      applyImageWhenReady(slot, CARD_IMAGES[id], true);
    } else {
      slot.classList.remove("completed");
      slot.style.backgroundImage = "none";
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
      if (id === "7" && !REQUIRED.every(x => visited.includes(x))) {
        alert("Completa tutte e 6 le carte per sbloccare questo contenuto!");
        return;
      }
      const page = btn.dataset.page;
      if (page) window.location.href = page;
    });
  });


  const button7 = document.querySelector('.menu-btn[data-id="7"]');
  if (button7 && progress.completed === REQUIRED.length) button7.classList.remove("locked");


  const parallaxContainer = document.querySelector(".parallax-layers");
  if (parallaxContainer) {
    const layers = [
      { el: parallaxContainer.querySelector(".layer-1"), speed: 0.1, idleAmp: 4, idleSpeed: 0.0008 },
      { el: parallaxContainer.querySelector(".layer-2"), speed: 0.25, idleAmp: 3, idleSpeed: 0.001 },
      { el: parallaxContainer.querySelector(".layer-3"), speed: 0.15, idleAmp: 2, idleSpeed: 0.0012 }
    ];

    let scrollY = window.scrollY;
    let lastScrollTime = performance.now();

    function updateParallax(time) {
      const idleStrength = Math.min((time - lastScrollTime) / 1200, 1);
      layers.forEach(layer => {
        if (!layer.el) return;
        const scrollOffset = scrollY * layer.speed;
        const idleOffset = Math.sin(time * layer.idleSpeed) * layer.idleAmp * idleStrength;
        layer.el.style.transform = `translate3d(0, ${scrollOffset + idleOffset}px, 0)`;
      });
    }

    function animate(time) {
      updateParallax(time);
      requestAnimationFrame(animate);
    }

    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
      lastScrollTime = performance.now();
    }, { passive: true });

    requestAnimationFrame(animate);
  }

  if (typeof initWebPLoader === "function") {
    requestIdleCallback(() => initWebPLoader(visited, CARD_IMAGES, MENU_IMAGES));
  }

});

function getVisited() {
  let visited = JSON.parse(localStorage.getItem("visitedPages")) || [];

  // Remove duplicates and invalid IDs
  visited = [...new Set(visited)].filter(id => REQUIRED.includes(id));

  localStorage.setItem("visitedPages", JSON.stringify(visited));

  return visited;
}