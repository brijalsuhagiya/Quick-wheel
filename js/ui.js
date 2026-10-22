/** Loads a reusable HTML component into a target element. */
export async function loadComponent(selector, path) {
  const target = document.querySelector(selector);
  if (!target) return;
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Component unavailable: ${path}`);
  target.innerHTML = await response.text();
}

/** Replaces the app content and moves focus to the main region. */
export function render(html) {
  const app = document.querySelector("#app");
  app.innerHTML = html;
  window.scrollTo(0,0);
  app.focus({ preventScroll:true });
}

/** Shows a temporary accessible status message. */
export function toast(message) {
  const region = document.querySelector("#toast-region");
  region.innerHTML = `<div class="toast" role="status">${message}</div>`;
  window.setTimeout(() => { region.innerHTML = ""; }, 3200);
}

/** Shows an honest simulated network wait and runs the supplied callback. */
export function showLoading(title, message, callback, delay = 1800) {
  const root = document.querySelector("#modal-root");
  root.innerHTML = `<div class="loading-overlay" role="status" aria-live="assertive"><div class="loading-card"><div class="spinner" aria-hidden="true"></div><p class="eyebrow">Demo processing</p><h2>${title}</h2><p class="muted">${message}</p><small>Your progress is saved if this takes longer than expected.</small></div></div>`;
  window.setTimeout(() => { root.innerHTML = ""; callback(); }, delay);
}

/** Opens the fetched support sheet and binds its close controls. */
export async function openSupport() {
  await loadComponent("#modal-root", "components/support-sheet.html");
  document.querySelector(".bottom-sheet button")?.focus();
  document.querySelectorAll("[data-close-sheet]").forEach((el) => el.addEventListener("click", closeSheet));
}

/** Closes the support sheet and restores focus to the trigger. */
export function closeSheet() {
  document.querySelector("#modal-root").innerHTML = "";
  document.querySelector(".support-trigger")?.focus();
}
