import { loadComponent, closeSheet, openSupport, toast } from "./ui.js";
import { registerRoute, startRouter, navigate } from "./router.js";
import { resetState } from "./state.js";
import { welcomeView, setupView, ridesView, sharedView, confirmedView, pickupView, tripView, completeView, recoveryView, driverRecoveryView } from "./views.js";

/** Registers every bookmarkable prototype route. */
function registerRoutes() {
  registerRoute("/welcome", welcomeView); registerRoute("/setup", setupView);
  registerRoute("/rides", ridesView); registerRoute("/shared", sharedView);
  registerRoute("/confirmed", confirmedView); registerRoute("/pickup", pickupView);
  registerRoute("/trip", tripView); registerRoute("/complete", completeView);
  registerRoute("/recovery", recoveryView); registerRoute("/driver-recovery", driverRecoveryView);
}

/** Binds controls shared across every route. */
function bindShell() {
  document.querySelector(".demo-close")?.addEventListener("click", () => document.querySelector("#demo-banner").replaceChildren());
  document.querySelector(".support-trigger")?.addEventListener("click", openSupport);
  document.querySelector("#modal-root").addEventListener("click", handleModalAction);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSheet(); });
}

/** Handles delegated support actions from the fetched sheet. */
function handleModalAction(event) {
  const action = event.target.closest("[data-support-action]")?.dataset.supportAction;
  if (!action) return;
  if (action === "reset") { resetState(); closeSheet(); navigate("/welcome"); return; }
  closeSheet();
  toast(action === "driver" ? "Masked driver call simulated. No call was placed." : "Safety desk check-in simulated. No emergency service was contacted.");
}

/** Loads the reusable shell before starting the application router. */
async function init() {
  try {
    await Promise.all([loadComponent("#demo-banner", "components/demo-banner.html"), loadComponent("#site-header", "components/header.html")]);
    bindShell(); registerRoutes(); startRouter();
  } catch {
    document.querySelector("#app").innerHTML = `<section class="fallback-page"><h1>The prototype shell could not load.</h1><p>The local server owns this issue. Confirm you opened the app over HTTP and refresh; recovery usually takes under a minute.</p><button class="button button-primary" id="reload-app" type="button">Reload app</button></section>`;
    document.querySelector("#reload-app")?.addEventListener("click", () => window.location.reload());
  }
}

init();
