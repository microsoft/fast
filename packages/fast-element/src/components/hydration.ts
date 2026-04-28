import { Message } from "../interfaces.js";
import { FAST } from "../platform.js";
import type {
    ContentTemplate,
    HydratableContentTemplate,
} from "../templating/html-binding-directive.js";
import type { ViewController } from "../templating/html-directive.js";
import type { HydratableViewController } from "../templating/hydration-view.js";
import type {
    ElementViewTemplate,
    HydratableElementViewTemplate,
    HydratableSyntheticViewTemplate,
    SyntheticViewTemplate,
} from "../templating/template.js";

/**
 * Data-free sequential hydration markers.
 *
 * All markers use the `fe:` prefix to namespace them to FAST Element. The closing
 * marker uses `/` following HTML/XML convention. Markers carry zero
 * embedded data — the hydration walker derives factory-to-node mappings
 * by maintaining a sequential pointer through the factories array.
 *
 * Content binding markers bracket text/template content:
 *   <!--fe:b--> ...content... <!--fe:/b-->
 *
 * Repeat item markers bracket each repeated item:
 *   <!--fe:r--> ...item... <!--fe:/r-->
 *
 * Element boundary markers demarcate nested custom elements:
 *   <!--fe:e--> ...shadow content... <!--fe:/e-->
 *
 * Attribute bindings use a single `data-fe` attribute whose value is
 * the count of attribute binding factories targeting the element:
 *   <div data-fe="3"> (3 attribute bindings)
 */

function isComment(node: Node): node is Comment {
    return node && node.nodeType === Node.COMMENT_NODE;
}

/**
 * Markup utilities to aid in template hydration.
 * @internal
 */
export const HydrationMarkup = Object.freeze({
    // Single attribute marker format (count only)
    attributeMarkerName: "data-fe",

    // Content binding markers (no arguments)
    contentBindingStartMarker(): string {
        return "fe:b";
    },
    contentBindingEndMarker(): string {
        return "fe:/b";
    },

    // Repeat item markers (no arguments)
    repeatStartMarker(): string {
        return "fe:r";
    },
    repeatEndMarker(): string {
        return "fe:/r";
    },

    // Element boundary markers (no arguments)
    elementBoundaryStartMarker(): string {
        return "fe:e";
    },
    elementBoundaryEndMarker(): string {
        return "fe:/e";
    },

    // Detection — simple string equality
    isContentBindingStartMarker(data: string): boolean {
        return data === "fe:b";
    },
    isContentBindingEndMarker(data: string): boolean {
        return data === "fe:/b";
    },
    isRepeatViewStartMarker(data: string): boolean {
        return data === "fe:r";
    },
    isRepeatViewEndMarker(data: string): boolean {
        return data === "fe:/r";
    },
    isElementBoundaryStartMarker(node: Node): boolean {
        return isComment(node) && node.data === "fe:e";
    },
    isElementBoundaryEndMarker(node: Node): boolean {
        return isComment(node) && node.data === "fe:/e";
    },

    /**
     * Returns the count of attribute bindings on the element, or null
     * if no attribute binding marker is present.
     *
     * Parses the `data-fe="N"` attribute format where N is the count
     * of attribute binding factories targeting this element.
     */
    parseAttributeBindingCount(node: Element): number | null {
        const attr = node.getAttribute(this.attributeMarkerName);
        if (attr === null) {
            return null;
        }

        const trimmed = attr.trim();

        if (!/^\d+$/.test(trimmed)) {
            throw FAST.error(Message.invalidHydrationAttributeMarker, {
                value: attr,
            });
        }

        const count = parseInt(trimmed, 10);

        if (count < 1) {
            throw FAST.error(Message.invalidHydrationAttributeMarker, {
                value: attr,
            });
        }

        return count;
    },
});

/**
 * @internal
 */
export const Hydratable = Symbol.for("fe-hydration");

/**
 * Tests if a template or ViewController is hydratable.
 *
 * @beta
 */
export function isHydratable(view: ViewController): view is HydratableViewController;
/** @beta */
export function isHydratable<TSource = any, TParent = any>(
    template: SyntheticViewTemplate<TSource, TParent>,
): template is HydratableSyntheticViewTemplate<TSource, TParent>;
/** @beta */
export function isHydratable<TSource = any, TParent = any>(
    template: ElementViewTemplate<TSource, TParent>,
): template is HydratableElementViewTemplate<TSource, TParent>;
/** @beta */
export function isHydratable(
    template: ContentTemplate,
): template is HydratableContentTemplate;
/** @beta */
export function isHydratable(value: any): any {
    return value[Hydratable] === Hydratable;
}
