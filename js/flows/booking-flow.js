import { setState } from "../state.js";
import { navigate } from "../router.js";
import { showLoading } from "../ui.js";

/** Starts the simulated matching request and persists its confirmed outcome. */
export function requestMatch(forceFailure = false) {
  setState({ step:"matching", booked:false });
  showLoading("Finding a compatible shared ride", "Checking route overlap, verified passengers and the +5 minute detour cap…", () => {
    if (forceFailure) { setState({ step:"recovery" }); navigate("/recovery"); return; }
    setState({ step:"confirmed", booked:true });
    navigate("/confirmed");
  }, 2200);
}

/** Simulates vehicle boarding after PIN verification. */
export function beginTrip() {
  showLoading("Verifying your boarding PIN", "Confirming the vehicle and starting your protected trip…", () => {
    setState({ step:"trip", boarded:true });
    navigate("/trip");
  }, 1600);
}

/** Simulates final payment settlement and moves to the receipt. */
export function completeTrip() {
  showLoading("Settling the demo fare", "Recording the fixed ₹140 fare and shared-ride savings…", () => {
    setState({ step:"complete" });
    navigate("/complete");
  }, 1800);
}
