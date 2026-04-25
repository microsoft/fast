import type { Mutable } from "../interfaces.js";
import { ensureHydrationRuntime } from "../hydration/runtime.js";
import { SourceLifetime } from "../observation/observable.js";
import type { ViewController } from "../templating/html-directive.js";
import type { HydratableElementViewTemplate } from "../templating/template.js";
import { ElementController } from "./element-controller.js";
import { isHydratable } from "./hydration.js";
import { type HydrationOptions, HydrationTracker } from "./hydration-tracker.js";

export type { HydrationOptions };

/**
 * No-op handler used during prerendered bind to discard the
 * upgrade-time burst of attributeChangedCallbacks.
 */
function noopAttributeHandler() {}

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
    ensureHydrationRuntime();
    const tracker = new HydrationTracker(options ?? {});

    ElementController.installHydrationHook(
        (controller, template, element, host) => {
            if (!isHydratable(template)) {
                return false;
            }

            const callbacks = controller.definition.lifecycleCallbacks;
            tracker.add(element);

            try {
                try {
                    callbacks?.elementWillHydrate?.(element);
                } catch {
                    // A lifecycle callback must never prevent hydration.
                }

                const firstChild = host.firstChild!;
                const lastChild = host.lastChild!;

                const view = (
                    template as HydratableElementViewTemplate
                ).hydrate(firstChild, lastChild, element);

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
                tracker.remove(element);
            }

            return true;
        },
    );
}

/**
 * The attribute used to defer hydration of an element.
 * Retained for intersection observer viewport hydration rendering.
 * @beta
 */
export const deferHydrationAttribute = "defer-hydration";
