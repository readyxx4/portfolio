// =========================================================
// Theme toggle (light / dark) — remembers choice in localStorage
// =========================================================
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const iconMoon = document.getElementById("icon-moon");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  iconMoon.style.transform = theme === "dark" ? "rotate(180deg)" : "rotate(0deg)";
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  applyTheme("dark");
}

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

// =========================================================
// Scrollspy — highlight the nav link for the section in view
// =========================================================
const sections = document.querySelectorAll("main .section");
const navLinks = document.querySelectorAll(".nav-links a");
const navMenu = document.getElementById("nav-links");
const navToggle = document.getElementById("nav-toggle");

function closeMobileNav() {
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "เปิดเมนู");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "ปิดเมนู" : "เปิดเมนู");
});

navLinks.forEach((link) => link.addEventListener("click", closeMobileNav));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
    closeMobileNav();
    navToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) closeMobileNav();
});

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);

sections.forEach((section) => {
  if (section.id !== "hero") spyObserver.observe(section);
});

// =========================================================
// Typing effect for the "$ whoami" line in the hero terminal
// =========================================================
const typedLine = document.getElementById("typed-line");
const fullText = "รัฐติพงษ์ บุญปัน (อายุ 21 ปี) — นักศึกษาสาขาเทคโนโลยีธุรกิจดิจิทัล";
let charIndex = 0;

function typeNextChar() {
  if (charIndex <= fullText.length) {
    typedLine.textContent = fullText.slice(0, charIndex);
    charIndex++;
    setTimeout(typeNextChar, 35);
  }
}

// Respect users who prefer reduced motion: show full text immediately
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typedLine.textContent = fullText;
} else {
  typeNextChar();
}

// =========================================================
// Back-to-top button
// =========================================================
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =========================================================
// Project screenshot lightbox
// =========================================================
const projectLightbox = document.getElementById("project-lightbox");
const projectLightboxImage = document.querySelector(".project-lightbox-image");
const projectLightboxClose = document.querySelector(".project-lightbox-close");
const projectLightboxPrev = document.querySelector(".project-lightbox-prev");
const projectLightboxNext = document.querySelector(".project-lightbox-next");
const projectLightboxCaption = document.querySelector(".project-lightbox-caption");
const projectLightboxCounter = document.querySelector(".project-lightbox-counter");
const projectImageLinks = Array.from(document.querySelectorAll(".project-step-image-link"));
const lineQr = document.querySelector(".line-qr");
let currentProjectImageIndex = 0;
let projectLightboxMode = "project";
let touchStartX = null;
let touchStartY = null;

function setProjectLightboxImage(src, alt, caption, counter) {
  projectLightboxImage.classList.add("is-changing");
  projectLightboxImage.addEventListener(
    "load",
    () => projectLightboxImage.classList.remove("is-changing"),
    { once: true }
  );
  projectLightboxImage.src = src;
  projectLightboxImage.alt = alt;
  projectLightboxCaption.textContent = caption;
  projectLightboxCounter.textContent = counter;

  if (projectLightboxImage.complete) {
    requestAnimationFrame(() => projectLightboxImage.classList.remove("is-changing"));
  }
}

function updateLightbox(index) {
  if (!projectImageLinks.length) return;

  currentProjectImageIndex = (index + projectImageLinks.length) % projectImageLinks.length;
  const link = projectImageLinks[currentProjectImageIndex];
  const image = link.querySelector(".project-step-image");
  const title = link.closest(".project-step-card")?.querySelector(".project-step-title")?.textContent.trim();

  if (!image) return;

  setProjectLightboxImage(
    image.currentSrc || image.src,
    image.alt,
    title || image.alt,
    `${currentProjectImageIndex + 1} / ${projectImageLinks.length}`
  );
}

function showNextImage() {
  updateLightbox(currentProjectImageIndex + 1);
}

function showPreviousImage() {
  updateLightbox(currentProjectImageIndex - 1);
}

function closeProjectLightbox() {
  projectLightbox.classList.remove("is-open");
  projectLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("project-lightbox-open");
}

projectImageLinks.forEach((link, index) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    projectLightboxMode = "project";
    projectLightboxPrev.hidden = false;
    projectLightboxNext.hidden = false;
    updateLightbox(index);
    projectLightbox.classList.add("is-open");
    projectLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("project-lightbox-open");
    projectLightboxClose.focus();
  });
});

if (lineQr) {
  lineQr.addEventListener("click", () => {
    projectLightboxMode = "single";
    projectLightboxPrev.hidden = true;
    projectLightboxNext.hidden = true;
    setProjectLightboxImage(
      lineQr.currentSrc || lineQr.src,
      lineQr.alt,
      "LINE QR Code",
      ""
    );
    projectLightbox.classList.add("is-open");
    projectLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("project-lightbox-open");
    projectLightboxClose.focus();
  });
}

projectLightboxClose.addEventListener("click", closeProjectLightbox);
projectLightboxPrev.addEventListener("click", showPreviousImage);
projectLightboxNext.addEventListener("click", showNextImage);

projectLightbox.addEventListener("click", (event) => {
  if (event.target === projectLightbox) closeProjectLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!projectLightbox.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeProjectLightbox();
  } else if (projectLightboxMode === "project" && event.key === "ArrowLeft") {
    event.preventDefault();
    showPreviousImage();
  } else if (projectLightboxMode === "project" && event.key === "ArrowRight") {
    event.preventDefault();
    showNextImage();
  }
});

projectLightbox.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 1) return;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });

projectLightbox.addEventListener("touchend", (event) => {
  if (projectLightboxMode !== "project" || touchStartX === null || touchStartY === null) {
    touchStartX = null;
    touchStartY = null;
    return;
  }

  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;
  touchStartX = null;
  touchStartY = null;

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
  if (deltaX < 0) showNextImage();
  else showPreviousImage();
}, { passive: true });
