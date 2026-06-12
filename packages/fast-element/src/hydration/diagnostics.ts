import { DOMAspect } from "../dom.js";
import type { ViewBehaviorFactory } from "../templating/html-directive.js";

/**
 * Structured description of the binding hydration was expecting to apply when
 * a mismatch is detected.
 * @public
 */
export interface HydrationMismatchExpectation {
    /**
     * The tag name of the element the binding was expecting (e.g. `"SPAN"`),
     * or `null` when the binding does not target a specific element (host or
     * template-level bindings).
     */
    tagName: string | null;

    /**
     * Human-readable description of the binding aspect, for example
     * `"content"`, `` "property `className`" ``, or `` "attribute `aria-label`" ``.
     */
    aspect: string;
}

/**
 * Structured description of the DOM hydration actually encountered at the
 * mismatch point.
 * @public
 */
export interface HydrationMismatchActual {
    /**
     * Serialized HTML snippet of the server-rendered DOM where the mismatch
     * was detected. Truncated with an ellipsis when long.
     */
    html: string;
}

const aspectLabels: Readonly<Record<number, string>> = Object.freeze({
    [DOMAspect.attribute]: "attribute",
    [DOMAspect.booleanAttribute]: "boolean attribute",
    [DOMAspect.property]: "property",
    [DOMAspect.content]: "content",
    [DOMAspect.tokenList]: "token list",
    [DOMAspect.event]: "event",
});

/**
 * Returns a human-readable description of a binding aspect suitable for
 * inclusion in error messages, e.g. `"content"`,
 * `` "property `className`" ``.
 * @internal
 */
export function describeAspect(
    aspectType: DOMAspect | undefined,
    sourceAspect: string | undefined,
): string {
    const base = aspectType !== undefined ? (aspectLabels[aspectType] ?? "binding") : "binding";
    return sourceAspect ? `${base} \`${sourceAspect}\`` : base;
}

/**
 * Returns a {@link HydrationMismatchExpectation} describing the binding target
 * that hydration was attempting to apply when the mismatch was detected.
 * @internal
 */
export function describeExpectedTarget(
    factory: ViewBehaviorFactory,
): HydrationMismatchExpectation {
    const aspectType = (factory as { aspectType?: DOMAspect }).aspectType;
    const sourceAspect = (factory as { sourceAspect?: string }).sourceAspect;
    return {
        tagName: factory.targetTagName ?? null,
        aspect: describeAspect(aspectType, sourceAspect),
    };
}

const defaultSnippetLength = 500;

function stripEmptyComments(root: Node): void {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    const empties: Comment[] = [];
    let current: Node | null;

    while ((current = walker.nextNode()) !== null) {
        if ((current as Comment).data === "") {
            empties.push(current as Comment);
        }
    }

    for (const comment of empties) {
        comment.parentNode?.removeChild(comment);
    }
}

function truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}

/**
 * Serializes a DocumentFragment to a clean HTML string for use in error
 * messages. Removes empty comment markers left over from hydration walks
 * and truncates at the given maximum length with an ellipsis.
 * @internal
 */
export function serializeFragmentForError(
    fragment: DocumentFragment,
    maxLength: number = defaultSnippetLength,
): string {
    const wrapper = document.createElement("div");
    wrapper.appendChild(fragment.cloneNode(true));
    stripEmptyComments(wrapper);
    return truncate(wrapper.innerHTML.trim(), maxLength);
}

/**
 * Serializes a single DOM node to a clean HTML string for use in error
 * messages. Removes empty comment markers and truncates at the given
 * maximum length with an ellipsis.
 * @internal
 */
export function serializeNodeForError(
    node: Node,
    maxLength: number = defaultSnippetLength,
): string {
    const wrapper = document.createElement("div");
    wrapper.appendChild(node.cloneNode(true));
    stripEmptyComments(wrapper);
    return truncate(wrapper.innerHTML.trim(), maxLength);
}

/**
 * Serializes the run of nodes from `first` through `last` (inclusive) to a
 * clean HTML string suitable for inclusion in error messages. Unlike
 * {@link serializeFragmentForError}, this captures the *outer* HTML of each
 * node — so wrapping elements remain visible in the snippet. Removes empty
 * comment markers left over from hydration walks and truncates at the given
 * maximum length with an ellipsis.
 * @internal
 */
export function serializeRangeForError(
    first: Node,
    last: Node,
    maxLength: number = defaultSnippetLength,
): string {
    const wrapper = document.createElement("div");
    let current: Node | null = first;

    while (current !== null) {
        wrapper.appendChild(current.cloneNode(true));

        if (current === last) {
            break;
        }

        current = current.nextSibling;
    }

    stripEmptyComments(wrapper);
    return truncate(wrapper.innerHTML.trim(), maxLength);
}

/**
 * Formats the canonical "Hydration mismatch in <host>." error message used by
 * {@link HydrationBindingError} and {@link HydrationTargetElementError}. The
 * `expected` parameter may be either a structured
 * {@link HydrationMismatchExpectation} or a free-form description string for
 * structural errors that do not map cleanly to a specific binding factory.
 * @internal
 */
export function formatHydrationMismatchMessage(
    hostNodeName: string | undefined,
    expected: HydrationMismatchExpectation | string,
    received: HydrationMismatchActual,
): string {
    const host = (hostNodeName ?? "unknown").toLowerCase();
    const expectedText =
        typeof expected === "string"
            ? expected
            : expected.tagName
                ? `<${expected.tagName.toLowerCase()}> with ${expected.aspect} binding`
                : `${expected.aspect} binding`;

    return (
        `Hydration mismatch in <${host}>.\n` +
        `  Expected: ${expectedText}\n` +
        `  Received: ${received.html}`
    );
}

function getHostName(node: Node | null | undefined): string | undefined {
    if (!node) {
        return undefined;
    }

    const root = node.getRootNode();
    return (root as ShadowRoot).host?.nodeName;
}

/**
 * Helper for reading the host element's tag name from any node inside a
 * hydration view. Returns `undefined` when the node is not inside a shadow
 * root.
 * @internal
 */
export { getHostName };
