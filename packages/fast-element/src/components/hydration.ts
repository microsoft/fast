import type {
    ContentTemplate,
    HydratableContentTemplate,
} from "../templating/html-binding-directive.js";
import type { ViewController } from "../templating/html-directive.js";
import type {
    ElementViewTemplate,
    HydratableElementViewTemplate,
    HydratableSyntheticViewTemplate,
    SyntheticViewTemplate,
} from "../templating/template.js";
import type { HydrationView } from "../templating/view.js";

/**
 * Data-free sequential hydration markers.
 *
 * All markers use the `f:` prefix to namespace them to FAST. The closing
 * marker uses `/` following HTML/XML convention. Markers carry zero
 * embedded data — the hydration walker derives factory-to-node mappings
 * by maintaining a sequential pointer through the factories array.
 *
 * Content binding markers bracket text/template content:
 *   <!--f:b--> ...content... <!--f:/b-->
 *
 * Repeat item markers bracket each repeated item:
 *   <!--f:r--> ...item... <!--f:/r-->
 *
 * Element boundary markers demarcate nested custom elements:
 *   <!--f:e--> ...shadow content... <!--f:/e-->
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
        return "f:b";
    },
    contentBindingEndMarker(): string {
        return "f:/b";
    },

    // Repeat item markers (no arguments)
    repeatStartMarker(): string {
        return "f:r";
    },
    repeatEndMarker(): string {
        return "f:/r";
    },

    // Element boundary markers (no arguments)
    elementBoundaryStartMarker(): string {
        return "f:e";
    },
    elementBoundaryEndMarker(): string {
        return "f:/e";
    },

    // Detection — simple string equality
    isContentBindingStartMarker(data: string): boolean {
        return data === "f:b";
    },
    isContentBindingEndMarker(data: string): boolean {
        return data === "f:/b";
    },
    isRepeatViewStartMarker(data: string): boolean {
        return data === "f:r";
    },
    isRepeatViewEndMarker(data: string): boolean {
        return data === "f:/r";
    },
    isElementBoundaryStartMarker(node: Node): boolean {
        return isComment(node) && node.data === "f:e";
    },
    isElementBoundaryEndMarker(node: Node): boolean {
        return isComment(node) && node.data === "f:/e";
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
        return attr === null ? null : parseInt(attr, 10);
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
export function isHydratable(view: ViewController): view is HydrationView;
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

/**
 * The attribute used to defer hydration of an element.
 * @beta
 */
export const deferHydrationAttribute = "defer-hydration";
