const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("nexa-theme");

if (savedTheme === "dark") {
  root.dataset.theme = "dark";
  themeToggle?.setAttribute("aria-pressed", "true");
  themeToggle?.setAttribute("aria-label", "Switch to light mode");
}

themeToggle?.addEventListener("click", () => {
  const isDark = root.dataset.theme === "dark";
  root.dataset.theme = isDark ? "light" : "dark";
  localStorage.setItem("nexa-theme", isDark ? "light" : "dark");
  themeToggle.setAttribute("aria-pressed", String(!isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to dark mode" : "Switch to light mode");
});

document.querySelector("#year").textContent = new Date().getFullYear();
