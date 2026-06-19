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
 *
 * WebUI versions that predate the data-free marker format still emit indexed
 * markers. The parser below accepts those legacy markers so existing WebUI SSR
 * output can hydrate against the newer FAST runtime.
 */

const legacyBindingStartMarker = /fe-b\$\$start\$\$(\d+)\$\$(.+)\$\$fe-b/;
const legacyBindingEndMarker = /fe-b\$\$end\$\$(\d+)\$\$(.+)\$\$fe-b/;
const legacyRepeatViewStartMarker = /fe-repeat\$\$start\$\$(\d+)\$\$fe-repeat/;
const legacyRepeatViewEndMarker = /fe-repeat\$\$end\$\$(\d+)\$\$fe-repeat/;
const legacyElementBoundaryStartMarker = /^(?:.{0,1000})fe-eb\$\$start\$\$(.+?)\$\$fe-eb/;
const legacyElementBoundaryEndMarker =
    /fe-eb\$\$end\$\$(.{0,1000})\$\$fe-eb(?:.{0,1000})$/;

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
    legacyAttributeMarkerName: "data-fe-b",
    legacyCompactAttributeMarkerName: "data-fe-c",

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
        return data === "fe:b" || legacyBindingStartMarker.test(data);
    },
    isContentBindingEndMarker(data: string): boolean {
        return data === "fe:/b" || legacyBindingEndMarker.test(data);
    },
    isRepeatViewStartMarker(data: string): boolean {
        return data === "fe:r" || legacyRepeatViewStartMarker.test(data);
    },
    isRepeatViewEndMarker(data: string): boolean {
        return data === "fe:/r" || legacyRepeatViewEndMarker.test(data);
    },
    isElementBoundaryStartMarker(node: Node): boolean {
        return (
            isComment(node) &&
            (node.data === "fe:e" || legacyElementBoundaryStartMarker.test(node.data))
        );
    },
    isElementBoundaryEndMarker(node: Node): boolean {
        return (
            isComment(node) &&
            (node.data === "fe:/e" || legacyElementBoundaryEndMarker.test(node.data))
        );
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

    parseLegacyAttributeBindingIndices(node: Element): number[] | null {
        const indices: number[] = [];
        const attr = node.getAttribute(this.legacyAttributeMarkerName);

        if (attr !== null) {
            for (const value of attr.trim().split(/\s+/)) {
                if (value === "") {
                    continue;
                }

                const index = Number(value);

                if (!Number.isInteger(index) || index < 0) {
                    throw FAST.error(Message.invalidHydrationAttributeMarker, {
                        value: attr,
                    });
                }

                indices.push(index);
            }
        }

        const enumeratedPrefix = `${this.legacyAttributeMarkerName}-`;
        const compactPrefix = `${this.legacyCompactAttributeMarkerName}-`;

        for (const name of node.getAttributeNames()) {
            if (name.startsWith(enumeratedPrefix)) {
                const index = Number(name.slice(enumeratedPrefix.length));

                if (!Number.isInteger(index) || index < 0) {
                    throw FAST.error(Message.invalidHydrationAttributeMarker, {
                        value: name,
                    });
                }

                indices.push(index);
            } else if (name.startsWith(compactPrefix)) {
                const [start, count] = name
                    .slice(compactPrefix.length)
                    .split("-")
                    .map(value => Number(value));

                if (
                    !Number.isInteger(start) ||
                    !Number.isInteger(count) ||
                    start < 0 ||
                    count < 1
                ) {
                    throw FAST.error(Message.invalidHydrationAttributeMarker, {
                        value: name,
                    });
                }

                for (let i = 0; i < count; i++) {
                    indices.push(start + i);
                }
            }
        }

        return indices.length === 0 ? null : indices;
    },

    removeLegacyAttributeBindingMarkers(node: Element): void {
        node.removeAttribute(this.legacyAttributeMarkerName);

        for (const name of node.getAttributeNames()) {
            if (
                name.startsWith(`${this.legacyAttributeMarkerName}-`) ||
                name.startsWith(`${this.legacyCompactAttributeMarkerName}-`)
            ) {
                node.removeAttribute(name);
            }
        }
    },

    parseLegacyContentBindingStartIndex(data: string): number | null {
        return parseLegacyIntMarker(legacyBindingStartMarker, data);
    },
});

function parseLegacyIntMarker(pattern: RegExp, data: string): number | null {
    const match = pattern.exec(data);
    return match === null ? null : Number(match[1]);
}

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
