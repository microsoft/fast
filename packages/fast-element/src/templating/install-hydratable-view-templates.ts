import { Hydratable } from "../components/hydration.js";
import { ViewTemplate } from "./template.js";
import { HydrationView } from "./view.js";

// Configure ViewTemplate to be hydratable by attaching a symbol identifier
// and a hydrate method. Augmenting the hydration features is done by
// property assignment instead of class extension to better allow the
// hydration feature to be tree-shaken.
//
// When hydrate() is called, it creates a HydrationView that wraps the
// pre-rendered DOM range (firstChild → lastChild) instead of cloning a
// compiled DocumentFragment. The HydrationView will then use
// buildViewBindingTargets() to scan for hydration markers and attach
// reactive bindings to the existing DOM nodes.
let hydratableViewTemplatesInstalled = false;

/**
 * Installs hydration support on {@link ViewTemplate}.
 * @public
 */
export function installHydratableViewTemplates(): void {
    if (hydratableViewTemplatesInstalled) {
        return;
    }

    hydratableViewTemplatesInstalled = true;

    Object.defineProperties(ViewTemplate.prototype, {
        [Hydratable]: { value: Hydratable, enumerable: false, configurable: false },
        hydrate: {
            value: function (
                this: ViewTemplate,
                firstChild: Node,
                lastChild: Node,
                hostBindingTarget?: Element,
            ): HydrationView {
                return new HydrationView(firstChild, lastChild, this, hostBindingTarget);
            },
            enumerable: true,
            configurable: false,
        },
    });
}

installHydratableViewTemplates();
