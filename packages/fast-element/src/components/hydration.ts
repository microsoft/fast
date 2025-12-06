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
import { FAST } from "../platform.js";

const bindingStartMarker = /fe-b\$\$start\$\$(\d+)\$\$(.+)\$\$fe-b/;
const bindingEndMarker = /fe-b\$\$end\$\$(\d+)\$\$(.+)\$\$fe-b/;
const repeatViewStartMarker = /fe-repeat\$\$start\$\$(\d+)\$\$fe-repeat/;
const repeatViewEndMarker = /fe-repeat\$\$end\$\$(\d+)\$\$fe-repeat/;
const elementBoundaryStartMarker = /^(?:.{0,1000})fe-eb\$\$start\$\$(.+?)\$\$fe-eb/;
const elementBoundaryEndMarker = /fe-eb\$\$end\$\$(.{0,1000})\$\$fe-eb(?:.{0,1000})$/;

function isComment(node: Node): node is Comment {
    return node && node.nodeType === Node.COMMENT_NODE;
}

/**
 * Markup utilities to aid in template hydration.
 * @internal
 */
export const HydrationMarkup = Object.freeze({
    attributeMarkerName: "data-fe-b",
    compactAttributeMarkerName: "data-fe-c",
    attributeBindingSeparator: " ",
    contentBindingStartMarker(index: number, uniqueId: string) {
        return `fe-b$$start$$${index}$$${uniqueId}$$fe-b`;
    },
    contentBindingEndMarker(index: number, uniqueId: string) {
        return `fe-b$$end$$${index}$$${uniqueId}$$fe-b`;
    },
    repeatStartMarker(index: number) {
        return `fe-repeat$$start$$${index}$$fe-repeat`;
    },
    repeatEndMarker(index: number) {
        return `fe-repeat$$end$$${index}$$fe-repeat`;
    },
    isContentBindingStartMarker(content: string) {
        return bindingStartMarker.test(content);
    },
    isContentBindingEndMarker(content: string) {
        return bindingEndMarker.test(content);
    },
    isRepeatViewStartMarker(content: string) {
        return repeatViewStartMarker.test(content);
    },
    isRepeatViewEndMarker(content: string) {
        return repeatViewEndMarker.test(content);
    },
    isElementBoundaryStartMarker(node: Node) {
        return isComment(node) && elementBoundaryStartMarker.test(node.data.trim());
    },
    isElementBoundaryEndMarker(node: Node) {
        return isComment(node) && elementBoundaryEndMarker.test(node.data);
    },
    /**
     * Returns the indexes of the ViewBehaviorFactories affecting
     * attributes for the element, or null if no factories were found.
     *
     * This method parses the space-separated format: `data-fe-b="0 1 2"`.
     */
    parseAttributeBinding(node: Element): null | number[] {
        const attr = node.getAttribute(this.attributeMarkerName);
        return attr === null
            ? attr
            : attr.split(this.attributeBindingSeparator).map(i => parseInt(i));
    },
    /**
     * Returns the indexes of the ViewBehaviorFactories affecting
     * attributes for the element, or null if no factories were found.
     *
     * This method parses the enumerated format: `data-fe-b-0`, `data-fe-b-1`, `data-fe-b-2`.
     * This is an alternative format that uses separate attributes for each binding index.
     */
    parseEnumeratedAttributeBinding(node: Element): null | number[] {
        const attrs: number[] = [];
        const prefixLength = this.attributeMarkerName.length + 1;
        const prefix = `${this.attributeMarkerName}-`;

        for (const attr of node.getAttributeNames()) {
            if (attr.startsWith(prefix)) {
                const count = Number(attr.slice(prefixLength));
                if (!Number.isNaN(count)) {
                    attrs.push(count);
                } else {
                    throw FAST.error(1601 /* invalidAttributeMarkerName */, {
                        name: attr,
                        expectedFormat: `${prefix}<number>`,
                    });
                }
            }
        }

        return attrs.length === 0 ? null : attrs;
    },

    /**
     * Returns the indexes of the ViewBehaviorFactories affecting
     * attributes for the element, or null if no factories were found.
     *
     * This method parses the compact format: `data-fe-c-{index}-{count}`.
     */
    parseCompactAttributeBinding(node: Element): null | number[] {
        const prefix = `${this.compactAttributeMarkerName}-`;
        const attrName = node.getAttributeNames().find(name => name.startsWith(prefix));

        if (!attrName) {
            return null;
        }

        const suffix = attrName.slice(prefix.length);
        const parts = suffix.split("-");
        const startIndex = parseInt(parts[0], 10);
        const count = parseInt(parts[1], 10);

        if (
            parts.length !== 2 ||
            Number.isNaN(startIndex) ||
            Number.isNaN(count) ||
            startIndex < 0 ||
            count < 1
        ) {
            throw FAST.error(1604 /* invalidCompactAttributeMarkerName */, {
                name: attrName,
                expectedFormat: `${this.compactAttributeMarkerName}-{index}-{count}`,
            });
        }

        const indexes: number[] = [];
        for (let i = 0; i < count; i++) {
            indexes.push(startIndex + i);
        }

        return indexes;
    },

    /**
     * Parses the ViewBehaviorFactory index from string data. Returns
     * the binding index or null if the index cannot be retrieved.
     */
    parseContentBindingStartMarker(content: string): null | [index: number, id: string] {
        return parseIndexAndIdMarker(bindingStartMarker, content);
    },
    parseContentBindingEndMarker(content: string): null | [index: number, id: string] {
        return parseIndexAndIdMarker(bindingEndMarker, content);
    },

    /**
     * Parses the index of a repeat directive from a content string.
     */
    parseRepeatStartMarker(content: string): null | number {
        return parseIntMarker(repeatViewStartMarker, content);
    },
    parseRepeatEndMarker(content: string): null | number {
        return parseIntMarker(repeatViewEndMarker, content);
    },
    /**
     * Parses element Id from element boundary markers
     */
    parseElementBoundaryStartMarker(content: string): null | string {
        return parseStringMarker(elementBoundaryStartMarker, content.trim());
    },
    parseElementBoundaryEndMarker(content: string): null | string {
        return parseStringMarker(elementBoundaryEndMarker, content);
    },
});

function parseIntMarker(regex: RegExp, content: string): null | number {
    const match = regex.exec(content);
    return match === null ? match : parseInt(match[1]);
}

function parseStringMarker(regex: RegExp, content: string): string | null {
    const match = regex.exec(content);
    return match === null ? match : match[1];
}

function parseIndexAndIdMarker(
    regex: RegExp,
    content: string
): null | [index: number, id: string] {
    const match = regex.exec(content);
    return match === null ? match : [parseInt(match[1]), match[2]];
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
export function isHydratable(view: ViewController): view is HydrationView;
/** @beta */
export function isHydratable<TSource = any, TParent = any>(
    template: SyntheticViewTemplate<TSource, TParent>
): template is HydratableSyntheticViewTemplate<TSource, TParent>;
/** @beta */
export function isHydratable<TSource = any, TParent = any>(
    template: ElementViewTemplate<TSource, TParent>
): template is HydratableElementViewTemplate<TSource, TParent>;
/** @beta */
export function isHydratable(
    template: ContentTemplate
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
