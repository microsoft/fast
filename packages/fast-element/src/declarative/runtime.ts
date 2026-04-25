import { Hydratable } from "../components/hydration.js";
import { FAST } from "../platform.js";
import { ViewTemplate } from "../templating/template.js";
import { HydrationView } from "../templating/hydration-view.js";
import { debugMessages } from "./debug.js";

type HydratableTemplate = ViewTemplate & {
    [Hydratable]?: symbol;
    hydrate?: (
        firstChild: Node,
        lastChild: Node,
        hostBindingTarget?: Element,
    ) => HydrationView;
};

let runtimeInstalled = false;

/**
 * Installs declarative runtime hooks on first use.
 * @internal
 */
export function ensureDeclarativeRuntime(): void {
    if (runtimeInstalled) {
        return;
    }

    const prototype = ViewTemplate.prototype as HydratableTemplate;

    if (prototype[Hydratable] !== Hydratable) {
        // Configure ViewTemplate to be hydratable by attaching a symbol
        // identifier and a hydrate method. Augmenting the hydration
        // features is done by property assignment instead of class extension
        // to better allow the hydration feature to be tree-shaken.
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

    FAST.addMessages(debugMessages);
    runtimeInstalled = true;
}
