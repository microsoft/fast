/**
 * Hydration exports for focused access to FAST hydration APIs.
 * @public
 */
export {
    deferHydrationAttribute,
    Hydratable,
    HydrationMarkup,
    isHydratable,
} from "../components/hydration.js";
export type { ElementHydrationCallbacks } from "../components/hydration-tracker.js";
export { HydrationTracker } from "../components/hydration-tracker.js";
export { installElementHydration } from "../components/install-hydration.js";
export { installHydratableViewTemplates } from "../templating/install-hydratable-view-templates.js";
