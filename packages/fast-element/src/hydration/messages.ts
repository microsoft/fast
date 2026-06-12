/**
 * Centralized hydration mismatch message strings used by both the default
 * minimal `HydrationDiagnostic` and the opt-in `hydrationDebugger` rich
 * formatter, and by the structural-error throw sites in
 * `target-builder.ts`.
 *
 * Static text is exported as a plain `const`; interpolated text is exported
 * as a small builder function. Plain `export const` declarations tree-shake
 * better than frozen-object property bags, so unused strings drop out of
 * bundles cleanly.
 */

/**
 * Fallback host tag name used when a hydration mismatch is detected on a
 * node that is not inside a shadow root.
 */
export const unknownHostName = "unknown";

// -- Aspect labels (consumed by the opt-in hydrationDebugger) ----------------

export const aspectLabelAttribute = "attribute";
export const aspectLabelBooleanAttribute = "boolean attribute";
export const aspectLabelProperty = "property";
export const aspectLabelContent = "content";
export const aspectLabelTokenList = "token list";
export const aspectLabelEvent = "event";
/** Fallback used when the aspectType is missing or unknown. */
export const aspectLabelUnknown = "binding";

/**
 * Combines an aspect label with the original source aspect identifier from
 * markup (e.g. `"property className"`). Returns the bare label when no
 * source aspect was captured.
 */
export function formatAspect(label: string, sourceAspect: string | undefined): string {
    return sourceAspect ? `${label} \`${sourceAspect}\`` : label;
}

/**
 * Formats the "Expected" half of the rich hydration mismatch message, e.g.
 * `"<span> with content binding"` or `"content binding"` when no tag is
 * associated with the binding factory.
 */
export function formatExpectedTarget(
    tagName: string | null,
    aspect: string,
): string {
    return tagName
        ? `<${tagName.toLowerCase()}> with ${aspect} binding`
        : `${aspect} binding`;
}

/**
 * Default minimal hydration mismatch message used when the
 * `hydrationDebugger` opt-in is not installed. The optional `detail` string
 * carries the structural expectation surfaced by `target-builder.ts`.
 */
export function formatDefaultMismatchMessage(
    hostName: string,
    detail: string | undefined,
): string {
    const suffix = detail ? `: ${detail}` : "";
    return (
        `Hydration mismatch in <${hostName}>${suffix}. Install ` +
        `hydrationDebugger() from "@microsoft/fast-element/hydration.js" and ` +
        `pass it as enableHydration({ debugger: hydrationDebugger() }) for an ` +
        `"Expected / Received" report including the SSR HTML snippet.`
    );
}

/**
 * Rich `Expected … / Received …` hydration mismatch message format produced
 * by the `hydrationDebugger` formatter.
 */
export function formatRichMismatchMessage(
    hostName: string,
    expectedText: string,
    receivedHtml: string,
): string {
    return (
        `Hydration mismatch in <${hostName}>.\n` +
        `  Expected: ${expectedText}\n` +
        `  Received: ${receivedHtml}`
    );
}

// -- Structural expectations (used by target-builder.ts throw sites) ---------

export const expectedContentAfterStartMarker =
    "content following `<!--fe:b-->` content binding marker";

export const expectedContentEndMarker =
    "matching `<!--fe:/b-->` content binding close marker";

export const expectedElementBoundaryEndMarker =
    "matching `<!--fe:/e-->` element boundary close marker";

/**
 * Builds the "no more attribute bindings" structural expectation message
 * thrown when an element's `data-fe` count claims more attribute bindings
 * than the compiled template defines.
 */
export function formatNoMoreAttributeBindings(factoryCount: number): string {
    return `no more attribute bindings (template defines ${factoryCount})`;
}

/**
 * Builds the "no more content bindings" structural expectation message
 * thrown when the SSR DOM contains more content binding markers than the
 * compiled template defines.
 */
export function formatNoMoreContentBindings(factoryCount: number): string {
    return `no more content bindings (template defines ${factoryCount})`;
}
