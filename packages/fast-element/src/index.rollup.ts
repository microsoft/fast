import { DOM } from "./dom.js";
import { DOMPolicy } from "./dom-policy.js";

export {
    enableHydration,
    HydrationBindingError,
    HydrationTracker,
    isHydratable,
} from "./hydration.js";
export * from "./index.js";

DOM.setPolicy(DOMPolicy.create());
