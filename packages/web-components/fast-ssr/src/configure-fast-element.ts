import {
    Compiler,
    ElementController,
    ElementStyles,
    Updates,
    ViewBehaviorFactory,
} from "@microsoft/fast-element";
import { FASTSSRStyleStrategy } from "./element-renderer/style-strategy.js";
import { SSRView } from "./view.js";

Compiler.setDefaultStrategy(
    (
        html: string | HTMLTemplateElement,
        factories: Record<string, ViewBehaviorFactory>
    ) => {
        if (typeof html !== "string") {
            throw new Error(
                "SSR compiler does not support HTMLTemplateElement templates"
            );
        }

        return new SSRView(html, factories) as any;
    }
);

ElementStyles.setDefaultStrategy(FASTSSRStyleStrategy);

// Set update mode to synchronous, so that mutations happen immediately.
// This is required due to the synchronous nature of rendering templates
// to a string.
Updates.setMode(false);

/**
 * Patch the addStyles and removeStyles methods for ElementController.
 * In cases where the component is defined with { shadowOptions: null},
 * ElementController will attempt to add the styles to the product of
 * Node.getRootNode for the source element. getRootNode will error
 * with the default DOM shim because it is un-implemented, and there
 * isn't a good behavior to implement it with given the sparse nature
 * of the shim. In these cases, simply associate the styles with the
 * element so they can be retrieved and rendered during component rendering
 * as if they were added to the shadowRoot, which works because the rendering
 * behavior is the same.
 */
const originalAddStyles = ElementController.prototype.addStyles;
const originalRemoveStyles = ElementController.prototype.removeStyles;
function addStyles(this: ElementController, styles: ElementStyles) {
    try {
        return originalAddStyles.call(this, styles);
    } catch (e) {
        styles.strategy.addStylesTo(this.source);
        styles.behaviors?.forEach(b => this.addBehavior(b));
    }
}

function removeStyles(this: ElementController, styles: ElementStyles) {
    try {
        return originalRemoveStyles.call(this, styles);
    } catch (e) {
        styles.strategy.removeStylesFrom(this.source);
        styles.behaviors?.forEach(b => this.removeBehavior(b));
    }
}

ElementController.prototype.addStyles = addStyles;
ElementController.prototype.removeStyles = removeStyles;
