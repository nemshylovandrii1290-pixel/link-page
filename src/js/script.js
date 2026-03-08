const yearNode = document.getElementById("year");
const bodyNode = document.body;
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const themeIcon = document.getElementById("theme-icon");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

let themeSwitchLock = false;

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

function updateThemeControls(theme) {
  if (!themeToggle || !themeLabel || !themeIcon) {
    return;
  }

  const isDark = theme === "dark";
  themeLabel.textContent = isDark ? "Light" : "Dark";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");

  themeIcon.classList.remove("fa-sun", "fa-moon");
  themeIcon.classList.add(isDark ? "fa-sun" : "fa-moon");
}

function applyTheme(theme) {
  bodyNode.dataset.theme = theme;
  updateThemeControls(theme);
}

const storedTheme = localStorage.getItem("corevia-theme");
const initialTheme = storedTheme || (prefersDarkScheme.matches ? "dark" : "light");
applyTheme(initialTheme);

function switchThemeWithMotion(nextTheme) {
  if (themeSwitchLock) {
    return;
  }

  themeSwitchLock = true;
  bodyNode.classList.add("theme-animating");
  themeToggle?.classList.add("is-busy");

  requestAnimationFrame(() => {
    applyTheme(nextTheme);
    localStorage.setItem("corevia-theme", nextTheme);

    window.setTimeout(() => {
      bodyNode.classList.remove("theme-animating");
      themeToggle?.classList.remove("is-busy");
      themeSwitchLock = false;
    }, 220);
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = bodyNode.dataset.theme === "dark" ? "light" : "dark";
    switchThemeWithMotion(nextTheme);
  });
}

prefersDarkScheme.addEventListener("change", (event) => {
  if (!localStorage.getItem("corevia-theme")) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

function bindPressState(selector) {
  document.querySelectorAll(selector).forEach((node) => {
    node.addEventListener("pointerdown", () => {
      node.classList.add("is-pressed");
    });

    ["pointerup", "pointercancel", "mouseleave", "blur"].forEach((eventName) => {
      node.addEventListener(eventName, () => {
        node.classList.remove("is-pressed");
      });
    });
  });
}

bindPressState(".button");
bindPressState(".theme-toggle");
