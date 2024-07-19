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
     */
    parseAttributeBinding(node: Element): null | number[] {
        const attr = node.getAttribute(this.attributeMarkerName);
        return attr === null
            ? attr
            : attr.split(this.attributeBindingSeparator).map(i => parseInt(i));
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
export function isHydratable<TSource = any, TParent = any>(
    template: SyntheticViewTemplate<TSource, TParent>
): template is HydratableSyntheticViewTemplate<TSource, TParent>;
export function isHydratable<TSource = any, TParent = any>(
    template: ElementViewTemplate<TSource, TParent>
): template is HydratableElementViewTemplate<TSource, TParent>;
export function isHydratable(
    template: ContentTemplate
): template is HydratableContentTemplate;
export function isHydratable(value: any): any {
    return value[Hydratable] === Hydratable;
}
