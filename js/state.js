const KEY = "quickwheels_demo_journey_v1";
const defaults = { step:"welcome", phone:"", selectedRide:"shared", preference:"women", booked:false, boarded:false, tripShared:false, rating:0, updatedAt:null };

/** Reads the saved demo journey and returns a safe state object. */
export function getState() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return { ...defaults }; }
}

/** Merges a partial update into localStorage and returns the new state. */
export function setState(update) {
  const next = { ...getState(), ...update, updatedAt:new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Clears only QuickWheels prototype state. */
export function resetState() { localStorage.removeItem(KEY); }

/** Reports whether the visitor has an unfinished saved journey. */
export function hasSavedJourney() {
  const state = getState();
  return state.updatedAt !== null && !["welcome","complete"].includes(state.step);
}
