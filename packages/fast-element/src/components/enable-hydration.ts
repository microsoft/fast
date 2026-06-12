import { installHydrationDiagnostic } from "../hydration/diagnostics.js";
import { ensureHydrationRuntime } from "../hydration/runtime.js";
import type { Mutable } from "../interfaces.js";
import { SourceLifetime } from "../observation/observable.js";
import type { ViewController } from "../templating/html-directive.js";
import type { HydratableElementViewTemplate } from "../templating/template.js";
import { ElementController } from "./element-controller.js";
import { isHydratable } from "./hydration.js";
import { type HydrationOptions, HydrationTracker } from "./hydration-tracker.js";

export { StopHydration } from "./hydration-tracker.js";
export type { HydrationOptions };

/**
 * No-op handler used during prerendered bind to discard the
 * upgrade-time burst of attributeChangedCallbacks.
 */
function noopAttributeHandler() {}

let tracker: HydrationTracker | null = null;
let hookInstalled = false;

/**
 * Enables hydration support for prerendered FAST elements.
 *
 * @remarks
 * Call this before any FAST elements connect to the DOM. Hydration
 * logic is not active unless this function is called, keeping
 * `FASTElement` lightweight for client-side-only applications.
 *
 * Safe to call multiple times — the hydration hook is installed once
 * and subsequent calls merge their options into the shared tracker.
 * By default, the hook stops hydrating new prerendered elements after
 * the global `hydrationComplete` callback. Set
 * `stopHydration` to `StopHydration.never` for streaming scenarios
 * that append hydratable Declarative Shadow DOM after the initial batch.
 *
 * Pass `debugger: hydrationDebugger()` to swap the default minimal
 * hydration mismatch error message for a rich "Expected / Received"
 * report including the SSR HTML snippet and structured
 * `expected`/`received` fields on `HydrationBindingError` /
 * `HydrationTargetElementError`. The debugger module is tree-shaken
 * out of production hydration bundles unless explicitly imported.
 *
 * @example
 * ```ts
 * import { enableHydration, StopHydration } from "@microsoft/fast-element/hydration.js";
 *
 * enableHydration({
 *     stopHydration: StopHydration.never,
 *     hydrationComplete() {
 *         console.log("hydration complete");
 *     },
 * });
 * ```
 *
 * @example Rich hydration mismatch diagnostics
 * ```ts
 * import { enableHydration, hydrationDebugger } from "@microsoft/fast-element/hydration.js";
 *
 * enableHydration({ debugger: hydrationDebugger() });
 * ```
 *
 * @param options - Optional global hydration callbacks and behavior.
 * @public
 */
export function enableHydration(options?: HydrationOptions): void {
    ensureHydrationRuntime();

    if (options?.debugger) {
        installHydrationDiagnostic(options.debugger.diagnostic);
    }

    if (!hookInstalled) {
        tracker = new HydrationTracker(options ?? {});
        hookInstalled = true;
        const activeTracker = tracker;

        ElementController.installHydrationHook((controller, template, element, host) => {
            if (!activeTracker.shouldHydrate || !isHydratable(template)) {
                return false;
            }

            const callbacks = controller.definition.lifecycleCallbacks;
            activeTracker.add(element);

            try {
                try {
                    callbacks?.elementWillHydrate?.(element);
                } catch {
                    // A lifecycle callback must never prevent hydration.
                }

                const firstChild = host.firstChild!;
                const lastChild = host.lastChild!;

                const view = (template as HydratableElementViewTemplate).hydrate(
                    firstChild,
                    lastChild,
                    element,
                );

                (controller as any).view = view;

                const realHandler = controller.onAttributeChangedCallback;
                controller.onAttributeChangedCallback = noopAttributeHandler;

                try {
                    (view as any)._skipAttrUpdates = true;
                    (view as any).isPrerendered = Promise.resolve(true);
                    (view as any).isHydrated = Promise.resolve(true);
                    view.bind(controller.source);
                    (view as any)._skipAttrUpdates = false;
                } finally {
                    controller.onAttributeChangedCallback = realHandler;
                }

                (view as any as Mutable<ViewController>).sourceLifetime =
                    SourceLifetime.coupled;
                (controller as any).hasExistingShadowRoot = false;

                try {
                    callbacks?.elementDidHydrate?.(element);
                } catch {
                    // A lifecycle callback must never prevent post-hydration work.
                }
            } finally {
                activeTracker.remove(element);
            }

            return true;
        });
    } else if (options && tracker) {
        // Merge options into existing tracker for subsequent calls
        tracker.mergeOptions(options);
    }
}

/**
 * The attribute used to defer hydration of an element.
 * Retained for intersection observer viewport hydration rendering.
 * @beta
 */
export const deferHydrationAttribute = "defer-hydration";
