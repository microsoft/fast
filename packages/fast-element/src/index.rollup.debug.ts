import { enableDebug } from "./debug.js";
import { DOM } from "./dom.js";
import { DOMPolicy } from "./dom-policy.js";

enableDebug();

export {
    enableHydration,
    HydrationBindingError,
    HydrationTracker,
    isHydratable,
} from "./hydration.js";
export * from "./index.js";

DOM.setPolicy(DOMPolicy.create());
