import { Hydratable } from "../components/hydration.js";
import { ViewTemplate } from "../templating/template.js";
import { HydrationView } from "../templating/hydration-view.js";

type HydratableTemplate = ViewTemplate & {
    [Hydratable]?: symbol;
    hydrate?: (
        firstChild: Node,
        lastChild: Node,
        hostBindingTarget?: Element,
    ) => HydrationView;
};

let installed = false;

/**
 * Installs the hydration runtime on `ViewTemplate.prototype`,
 * making all templates hydratable. Call this before any hydration
 * occurs. Safe to call multiple times — subsequent calls are no-ops.
 * @internal
 */
export function ensureHydrationRuntime(): void {
    if (installed) {
        return;
    }

    const prototype = ViewTemplate.prototype as HydratableTemplate;

    if (prototype[Hydratable] !== Hydratable) {
        Object.defineProperties(prototype, {
            [Hydratable]: {
                value: Hydratable,
                enumerable: false,
                configurable: false,
            },
            hydrate: {
                value(
                    this: ViewTemplate,
                    firstChild: Node,
                    lastChild: Node,
                    hostBindingTarget?: Element,
                ): HydrationView {
                    return new HydrationView(
                        firstChild,
                        lastChild,
                        this,
                        hostBindingTarget,
                    );
                },
                enumerable: true,
                configurable: false,
            },
        });
    }

    installed = true;
}
