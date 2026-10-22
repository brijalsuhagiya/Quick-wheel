import { demoData as d } from "./mock-data.js";
import { getState, hasSavedJourney, setState } from "./state.js";
import { navigate } from "./router.js";
import { render, toast } from "./ui.js";
import { beginTrip, completeTrip, requestMatch } from "./flows/booking-flow.js";

const progress = (label, value) => `<div class="progress" aria-label="Journey progress: ${label}"><span>${label}</span><div class="progress-track"><div class="progress-bar progress-${value}"></div></div></div>`;
const page = (body, narrow = false) => `<section class="page ${narrow ? "page-narrow" : ""}">${body}</section>`;
const routeSummary = () => `<div class="route-summary"><div class="route-place"><small>From</small><strong>${d.route.from}</strong></div><span class="route-arrow" aria-hidden="true">→</span><div class="route-place"><small>To</small><strong>${d.route.to}</strong></div></div>`;

/** Renders the product entry and saved-journey affordance. */
export function welcomeView() {
  const resume = hasSavedJourney() ? `<button class="button button-secondary" data-action="resume">Resume saved journey</button>` : "";
  render(page(`<div class="hero"><div><p class="eyebrow">Station rides, made certain</p><h1>From platform to doorstep—without the guesswork.</h1><p class="hero-copy">Compare fixed fares before your train arrives, know the maximum detour, and follow clear station pickup directions.</p><div class="actions"><button class="button button-primary" data-action="start">Plan my station ride</button>${resume}</div></div><aside class="hero-panel"><div><p class="eyebrow">Arriving in Surat</p><h2>One journey.<br>Three promises.</h2></div><div class="stack"><div><strong>₹140 means ₹140</strong><br><span>Fixed before you book</span></div><div><strong>No surprise detours</strong><br><span>Maximum +5 minutes</span></div><div><strong>Find the right bay</strong><br><span>Gate-by-gate pickup guidance</span></div></div></aside></div>`));
  document.querySelector('[data-action="start"]')?.addEventListener("click", () => navigate("/setup"));
  document.querySelector('[data-action="resume"]')?.addEventListener("click", () => navigate(`/${getState().step}`));
}

/** Renders minimal pre-arrival route setup with visible labels. */
export function setupView() {
  const state = getState();
  render(page(`${progress("Plan",8)}<div class="page-head"><div class="page-head-copy"><p class="eyebrow">Before your train arrives</p><h1>Where should we meet you?</h1><p class="muted">We’ve prepared a demo arrival at Surat Railway Station. Confirm the route and one sharing preference.</p></div><span class="status-pill">● ${d.route.train}</span></div><form id="setup-form" class="split"><div class="stack"><div class="form-field"><label for="phone">Mobile number</label><input id="phone" name="phone" inputmode="numeric" autocomplete="tel" value="${state.phone}" placeholder="10-digit mobile number" minlength="10" maxlength="10" required><p class="form-hint">Demo only. Enter any 10 digits; no message is sent.</p></div><div class="form-field"><label for="destination">Destination</label><input id="destination" value="${d.route.to}" readonly></div><fieldset class="card"><legend>Sharing preference</legend><div class="choice-row"><button class="choice ${state.preference === "women" ? "is-selected" : ""}" type="button" data-preference="women">Women preferred</button><button class="choice ${state.preference === "any" ? "is-selected" : ""}" type="button" data-preference="any">Any verified</button><button class="choice ${state.preference === "group" ? "is-selected" : ""}" type="button" data-preference="group">Group</button></div></fieldset></div><aside class="card card-dark stack"><p class="eyebrow">Detected arrival</p><h2>${d.route.fromShort}</h2><p>${d.route.train}<br>Expected at ${d.route.arrival}</p><p>Your pickup timer will adjust if the train is delayed. Live tracking is simulated in this prototype.</p><button class="button button-accent button-wide" type="submit">Compare rides</button></aside></form>`, true));
  bindSetup();
}

/** Binds validation and preferences on the setup form. */
function bindSetup() {
  document.querySelectorAll("[data-preference]").forEach((button) => button.addEventListener("click", () => {
    setState({ preference:button.dataset.preference });
    document.querySelectorAll("[data-preference]").forEach((item) => item.classList.toggle("is-selected", item === button));
  }));
  document.querySelector("#setup-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = document.querySelector("#phone").value.trim();
    if (!/^\d{10}$/.test(phone)) { toast("Enter any 10 digits for this demo. No SMS will be sent."); return; }
    setState({ phone, step:"rides" }); navigate("/rides");
  });
}

/** Produces a comparable ride option card from mock data. */
function rideCard(ride, selected) {
  return `<article class="card ride-card ${selected ? "is-selected" : ""}" data-ride="${ride.id}" tabindex="0" role="button" aria-pressed="${selected}"><div class="ride-icon" aria-hidden="true">${ride.icon}</div><div><span class="${ride.id === "shared" ? "tag" : "status-pill"}">${ride.label}</span><h3>${ride.name}</h3><p class="ride-meta">Pickup ${ride.pickup} · ${ride.duration} total<br>${ride.detail}</p></div><div class="ride-price"><strong>${ride.price}</strong><small>${ride.saving}</small></div></article>`;
}

/** Renders transparent multi-modal comparison. */
export function ridesView() {
  const state = getState();
  render(page(`${progress("Compare",22)}${routeSummary()}<div class="page-head"><div><p class="eyebrow">Available now · Demo quotes</p><h1>Choose what matters today</h1><p class="muted">Every option shows its full price and total journey time.</p></div></div><div class="stack">${d.rides.map((ride) => rideCard(ride, state.selectedRide === ride.id)).join("")}</div><div class="sticky-action"><div class="actions actions-end"><button class="button button-secondary" data-action="back">Edit route</button><button class="button button-primary" data-action="details">View shared cab details</button></div></div>`));
  bindRides();
}

/** Binds ride selection, navigation, and keyboard activation. */
function bindRides() {
  document.querySelectorAll("[data-ride]").forEach((card) => {
    const choose = () => { setState({ selectedRide:card.dataset.ride }); ridesView(); };
    card.addEventListener("click", choose);
    card.addEventListener("keydown", (event) => { if (["Enter"," "].includes(event.key)) choose(); });
  });
  document.querySelector('[data-action="back"]')?.addEventListener("click", () => navigate("/setup"));
  document.querySelector('[data-action="details"]')?.addEventListener("click", () => { setState({ selectedRide:"shared", step:"shared" }); navigate("/shared"); });
}

/** Renders the fixed fare, route tradeoff, and safety commitment. */
export function sharedView() {
  render(page(`${progress("Review",38)}<div class="page-head"><div><p class="eyebrow">Shared ride details</p><h1>Save ₹180 for at most 5 extra minutes.</h1><p class="muted">Review the complete trade-off before requesting a match.</p></div></div><div class="fare-lock"><div><p>Fixed fare · no surge changes</p><strong>${d.booking.fare}</strong></div><span class="tag">Fare locked</span></div><div class="metrics"><div class="metric"><strong>${d.booking.pickup}</strong><span>Pickup ETA</span></div><div class="metric"><strong>${d.booking.seats}</strong><span>Available</span></div><div class="metric"><strong>${d.booking.detour}</strong><span>Guaranteed cap</span></div><div class="metric"><strong>${d.booking.saving}</strong><span>You save</span></div></div><div class="split"><section class="card"><p class="eyebrow">Shared route</p><ol class="timeline"><li><strong>${d.route.fromShort} · Zone A</strong><small>Your pickup</small></li><li><strong>Co-traveller drop</strong><small>Within the shared corridor; exact address stays private</small></li><li><strong>${d.route.to}</strong><small>Your destination</small></li></ol></section><aside class="card"><p class="eyebrow">Protected by design</p><div class="assurance-list"><div class="assurance"><span class="assurance-mark">✓</span><span><strong>Verified driver</strong><br><small>Identity and background checks</small></span></div><div class="assurance"><span class="assurance-mark">✓</span><span><strong>Boarding PIN</strong><br><small>Shown only after a match</small></span></div><div class="assurance"><span class="assurance-mark">✓</span><span><strong>Route monitoring</strong><br><small>Alert if the detour cap is crossed</small></span></div></div></aside></div><div class="card card-accent"><label class="toggle-row"><span><strong>Prefer a woman co-traveller</strong><br><small>We’ll prioritise this without blocking a verified match.</small></span><button class="toggle" type="button" aria-pressed="${getState().preference === "women"}" aria-label="Prefer a woman co-traveller"></button></label></div><div class="sticky-action"><div class="actions actions-end"><button class="button button-secondary" data-action="simulate-failure">Preview no-match recovery</button><button class="button button-primary" data-action="confirm">Confirm shared cab · ${d.booking.fare}</button></div></div>`));
  bindShared();
}

/** Binds shared preferences and the simulated matching paths. */
function bindShared() {
  document.querySelector(".toggle")?.addEventListener("click", (event) => { const next = event.currentTarget.getAttribute("aria-pressed") !== "true"; event.currentTarget.setAttribute("aria-pressed", String(next)); setState({ preference:next ? "women" : "any" }); });
  document.querySelector('[data-action="confirm"]')?.addEventListener("click", () => requestMatch(false));
  document.querySelector('[data-action="simulate-failure"]')?.addEventListener("click", () => requestMatch(true));
}

/** Renders a confirmed match with privacy-safe trust information. */
export function confirmedView() {
  render(page(`${progress("Matched",55)}<div class="page-head"><div><span class="status-pill">✓ Ride confirmed · Match locked</span><h1>Your ride is ready.</h1><p class="muted">Check the car, co-traveller and boarding PIN before leaving the platform.</p></div><div class="card card-accent"><small>Pickup</small><strong>${d.pickup.zone}</strong><br><span>${d.pickup.detail}</span></div></div><div class="grid-2"><section class="card stack"><p class="eyebrow">Your driver</p><div class="identity"><span class="avatar">${d.driver.initials}</span><div><h3>${d.driver.name}</h3><p>★ ${d.driver.rating} · ${d.driver.trips}</p><small>${d.driver.verification}</small></div></div><div><strong>${d.driver.vehicle}</strong><br><span>${d.driver.plate}</span></div></section><section class="card stack"><p class="eyebrow">Sharing with 1 verified passenger</p><div class="identity"><span class="avatar">${d.traveller.initials}</span><div><h3>${d.traveller.name}</h3><p>${d.traveller.descriptor}</p></div></div><small>Contact details and exact home addresses remain hidden.</small></section></div><section class="card card-dark split"><div><p class="eyebrow">Boarding authentication</p><h2>Share this PIN only after checking the vehicle plate.</h2><p>Demo PIN · never send it by message.</p></div><div class="pin" aria-label="Boarding PIN ${d.booking.pin.join(" ")}">${d.booking.pin.map((digit) => `<span>${digit}</span>`).join("")}</div></section><div class="sticky-action"><div class="actions actions-end"><button class="button button-secondary" data-action="driver-cancel">Preview driver cancellation</button><button class="button button-primary" data-action="navigate">Navigate to pickup zone</button></div></div>`));
  document.querySelector('[data-action="navigate"]')?.addEventListener("click", () => { setState({ step:"pickup" }); navigate("/pickup"); });
  document.querySelector('[data-action="driver-cancel"]')?.addEventListener("click", () => { setState({ step:"driver-recovery" }); navigate("/driver-recovery"); });
}

/** Renders station-specific micro-wayfinding and boarding. */
export function pickupView() {
  render(page(`${progress("Find pickup",70)}<div class="page-head"><div><p class="eyebrow">Walk to ${d.pickup.zone}</p><h1>Exit 3, then follow the yellow A2 markers.</h1><p class="muted">Your driver is ${d.pickup.driverEta} from the bay. Your grace period adjusts with the demo train status.</p></div><span class="status-pill status-pill-amber">Driver ${d.pickup.driverEta} away</span></div><div class="split"><div class="map" role="img" aria-label="Simplified station route from Exit Gate 3 to Pickup Zone A2"><div class="map-route"></div><span class="map-pin map-pin-start">3</span><span class="map-label map-label-one">Exit Gate 3</span><span class="map-pin map-pin-end">A2</span><span class="map-label map-label-two">Pickup bay</span></div><aside class="stack"><div class="landmark"><div><strong>A2</strong>Look for the yellow pillar</div></div><div class="card stack">${d.pickup.steps.map((step,index) => `<div class="direction"><span class="direction-number">${index + 1}</span><p>${step}</p></div>`).join("")}</div></aside></div><div class="sticky-action"><div class="actions actions-end"><button class="button button-secondary" data-action="walking">Share walking status</button><button class="button button-primary" data-action="board">I found the car · verify PIN</button></div></div>`));
  document.querySelector('[data-action="walking"]')?.addEventListener("click", () => toast("Walking status shared with Rajesh (demo). Your phone number stays hidden."));
  document.querySelector('[data-action="board"]')?.addEventListener("click", beginTrip);
}

/** Renders the monitored live shared trip. */
export function tripView() {
  const state = getState();
  render(page(`${progress("On trip",86)}<div class="page-head"><div><span class="status-pill">● On trip · ${d.trip.status}</span><h1>Arriving at ${d.trip.destination} by ${d.trip.eta}.</h1><p class="muted">The route remains inside your promised detour.</p></div></div><div class="trip-progress"><div class="trip-stop is-done">Station pickup</div><div class="trip-stop is-current">Co-traveller drop</div><div class="trip-stop">${d.trip.destination}</div></div><div class="split"><div class="map" role="img" aria-label="Demo live route from Surat Station through one shared stop to City Light"><div class="map-route"></div><span class="map-pin map-pin-start">●</span><span class="map-label map-label-one">En route</span><span class="map-pin map-pin-end">⌂</span><span class="map-label map-label-two">${d.trip.destination}</span></div><aside class="stack"><div class="card card-accent"><p class="eyebrow">Detour protection</p><h2>${d.trip.detour}</h2><p>Still within your +5 minute guarantee.</p></div><div class="card toggle-row"><span><strong>Share live trip</strong><br><small>Demo link; no location leaves this browser.</small></span><button class="toggle" type="button" aria-pressed="${state.tripShared}" aria-label="Share live trip"></button></div><button class="button button-danger button-wide" data-action="sos">Safety check-in</button></aside></div><div class="sticky-action"><div class="actions actions-end"><button class="button button-primary" data-action="arrive">Simulate arrival</button></div></div>`));
  bindTrip();
}

/** Binds trip sharing, safety support, and arrival. */
function bindTrip() {
  document.querySelector(".toggle")?.addEventListener("click", (event) => { const next = event.currentTarget.getAttribute("aria-pressed") !== "true"; event.currentTarget.setAttribute("aria-pressed", String(next)); setState({ tripShared:next }); toast(next ? "Demo trip-sharing link is active." : "Demo trip sharing stopped."); });
  document.querySelector('[data-action="sos"]')?.addEventListener("click", () => toast("Safety check-in opened (demo). A real product would connect to trained support."));
  document.querySelector('[data-action="arrive"]')?.addEventListener("click", completeTrip);
}

/** Renders settled payment, savings, and usable feedback controls. */
export function completeView() {
  const state = getState();
  render(page(`<div class="page-head"><div><span class="status-pill">✓ Trip completed · Paid</span><h1>You arrived—and kept ₹180 in your pocket.</h1><p class="muted">${d.receipt.total} paid via ${d.receipt.payment} (demo). No real payment was processed.</p></div><span class="tag">${d.booking.reference}</span></div><div class="split"><section class="card card-accent"><p class="eyebrow">Shared impact</p><h2>You saved ${d.booking.saving}</h2><p>Sharing this trip also reduced estimated emissions by ${d.receipt.carbon}.</p></section><section class="card"><p class="eyebrow">Fare receipt</p><div class="receipt-row"><span>Base fare</span><span>${d.receipt.base}</span></div><div class="receipt-row"><span>Distance & time</span><span>${d.receipt.distance}</span></div><div class="receipt-row"><span>Shared discount</span><span>${d.receipt.discount}</span></div><div class="receipt-row"><span>Total paid</span><span>${d.receipt.total}</span></div></section></div><section class="card stack"><div><p class="eyebrow">How was your journey?</p><h2>Rate the complete shared-ride experience</h2></div><div class="rating" role="radiogroup" aria-label="Trip rating">${[1,2,3,4,5].map((value) => `<button class="star ${state.rating >= value ? "is-selected" : ""}" type="button" role="radio" aria-checked="${state.rating === value}" data-rating="${value}" aria-label="${value} stars">★</button>`).join("")}</div><p class="muted">Covers driver, cleanliness and co-traveller courtesy.</p></section><div class="actions actions-end"><button class="button button-secondary" data-action="receipt">Save demo receipt</button><button class="button button-primary" data-action="new">Plan another ride</button></div>`));
  bindComplete();
}

/** Binds rating and post-trip actions. */
function bindComplete() {
  document.querySelectorAll("[data-rating]").forEach((button) => button.addEventListener("click", () => { setState({ rating:Number(button.dataset.rating) }); completeView(); toast("Thanks—your demo feedback was saved."); }));
  document.querySelector('[data-action="receipt"]')?.addEventListener("click", () => toast(`Receipt ${d.booking.reference} is saved in this demo journey.`));
  document.querySelector('[data-action="new"]')?.addEventListener("click", () => { setState({ step:"setup", booked:false, boarded:false }); navigate("/setup"); });
}

/** Builds an explicit failure-and-recovery view from mock error data. */
function recoveryTemplate(error, driverRecovery = false) {
  return page(`<div class="card error-card stack"><p class="eyebrow">Booking needs attention</p><h1>${error.title}</h1><div class="grid-2"><div><strong>What happened and who owns it</strong><p>${error.owner}</p></div><div><strong>What is safely retained</strong><p>${error.evidence}</p></div><div><strong>Your next step</strong><p>${error.action}</p></div><div><strong>Expected time</strong><p>${error.time}</p></div></div><p class="saved-note">✓ Your route and quoted fare are saved in this browser.</p><div class="actions"><button class="button button-primary" data-action="recover">${driverRecovery ? "Accept replacement driver" : "Switch to private cab · ₹270"}</button><button class="button button-secondary" data-action="retry">${driverRecovery ? "Return to confirmed ride" : "Retry shared matching"}</button></div></div>`, true);
}

/** Renders the no-match recovery route. */
export function recoveryView() { render(recoveryTemplate(d.errors.match)); bindRecovery(false); }

/** Renders the driver-cancellation recovery route. */
export function driverRecoveryView() { render(recoveryTemplate(d.errors.driver, true)); bindRecovery(true); }

/** Binds both explicit recovery paths. */
function bindRecovery(driverRecovery) {
  document.querySelector('[data-action="recover"]')?.addEventListener("click", () => { toast(driverRecovery ? "Replacement driver Mehul S. assigned at Bay 3 (demo)." : "Private cab reserved at the protected ₹270 fare (demo)."); setState({ step:"confirmed", booked:true }); window.setTimeout(() => navigate("/confirmed"), 700); });
  document.querySelector('[data-action="retry"]')?.addEventListener("click", () => driverRecovery ? navigate("/confirmed") : requestMatch(false));
}
