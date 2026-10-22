const routes = new Map();

/** Registers a route renderer for a hash path. */
export function registerRoute(path, renderer) { routes.set(path, renderer); }

/** Returns the normalized current route. */
export function currentRoute() { return window.location.hash.slice(1) || "/welcome"; }

/** Navigates with a GitHub Pages-safe hash URL. */
export function navigate(path) {
  if (currentRoute() === path) renderCurrentRoute();
  else window.location.hash = path;
}

/** Renders the current route or the welcome fallback. */
export function renderCurrentRoute() {
  const renderer = routes.get(currentRoute()) || routes.get("/welcome");
  renderer();
}

/** Starts hash routing and renders the initial route. */
export function startRouter() {
  window.addEventListener("hashchange", renderCurrentRoute);
  renderCurrentRoute();
}
