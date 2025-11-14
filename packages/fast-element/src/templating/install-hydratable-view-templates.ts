import { Hydratable } from "../components/hydration.js";
import { ViewTemplate } from "./template.js";
import { HydrationView } from "./view.js";

// Configure ViewTemplate to be hydratable by attaching a symbol identifier
// and a hydrate method. Augmenting the hydration features is done by
// property assignment instead of class extension to better allow the
// hydration feature to be tree-shaken.
Object.defineProperties(ViewTemplate.prototype, {
    [Hydratable]: { value: Hydratable, enumerable: false, configurable: false },
    hydrate: {
        value: function (
            this: ViewTemplate,
            firstChild: Node,
            lastChild: Node,
            hostBindingTarget?: Element
        ): HydrationView {
            return new HydrationView(firstChild, lastChild, this, hostBindingTarget);
        },
        enumerable: true,
        configurable: false,
    },
});
