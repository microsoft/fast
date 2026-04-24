import { ElementController } from "./element-controller.js";
import { type HydrationOptions, HydrationTracker } from "./hydration-tracker.js";

export type { HydrationOptions };

/**
 * Enables hydration support for prerendered FAST elements.
 *
 * @remarks
 * Call this before any FAST elements connect to the DOM. Hydration
 * logic is not active unless this function is called, keeping
 * `FASTElement` lightweight for client-side-only applications.
 *
 * @example
 * ```ts
 * import { enableHydration } from "@microsoft/fast-element/hydration.js";
 *
 * enableHydration({
 *     hydrationComplete() {
 *         console.log("hydration complete");
 *     },
 * });
 * ```
 *
 * @param options - Optional callbacks for global hydration events.
 * @public
 */
export function enableHydration(options?: HydrationOptions): void {
    ElementController.enableHydration(new HydrationTracker(options ?? {}));
}
