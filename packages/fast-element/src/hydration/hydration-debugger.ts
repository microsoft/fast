import { DOMAspect } from "../dom.js";
import type { ViewBehaviorFactory } from "../templating/html-directive.js";
import type {
    HydrationDiagnostic,
    HydrationDiagnosticResult,
    HydrationMismatchActual,
    HydrationMismatchExpectation,
} from "./diagnostics.js";
import {
    aspectLabelAttribute,
    aspectLabelBooleanAttribute,
    aspectLabelContent,
    aspectLabelEvent,
    aspectLabelProperty,
    aspectLabelTokenList,
    aspectLabelUnknown,
    formatAspect,
    formatExpectedTarget,
    formatRichMismatchMessage,
    unknownHostName,
} from "./messages.js";

const aspectLabelsByCode: Readonly<Record<number, string>> = Object.freeze({
    [DOMAspect.attribute]: aspectLabelAttribute,
    [DOMAspect.booleanAttribute]: aspectLabelBooleanAttribute,
    [DOMAspect.property]: aspectLabelProperty,
    [DOMAspect.content]: aspectLabelContent,
    [DOMAspect.tokenList]: aspectLabelTokenList,
    [DOMAspect.event]: aspectLabelEvent,
});

const defaultSnippetLength = 500;

function describeAspect(
    aspectType: DOMAspect | undefined,
    sourceAspect: string | undefined,
): string {
    const base =
        aspectType !== undefined
            ? (aspectLabelsByCode[aspectType] ?? aspectLabelUnknown)
            : aspectLabelUnknown;
    return formatAspect(base, sourceAspect);
}

function describeExpectedTarget(
    factory: ViewBehaviorFactory,
): HydrationMismatchExpectation {
    const aspectType = (factory as { aspectType?: DOMAspect }).aspectType;
    const sourceAspect = (factory as { sourceAspect?: string }).sourceAspect;
    return {
        tagName: factory.targetTagName ?? null,
        aspect: describeAspect(aspectType, sourceAspect),
    };
}

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

function serializeNodeForError(node: Node, maxLength = defaultSnippetLength): string {
    const wrapper = document.createElement("div");
    wrapper.appendChild(node.cloneNode(true));
    stripEmptyComments(wrapper);
    return truncate(wrapper.innerHTML.trim(), maxLength);
}

function serializeRangeForError(
    first: Node,
    last: Node,
    maxLength = defaultSnippetLength,
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

function formatMismatchMessage(
    hostName: string | undefined,
    expected: HydrationMismatchExpectation | string,
    received: HydrationMismatchActual,
): string {
    const host = (hostName ?? unknownHostName).toLowerCase();
    const expectedText =
        typeof expected === "string"
            ? expected
            : formatExpectedTarget(expected.tagName, expected.aspect);

    return formatRichMismatchMessage(host, expectedText, received.html);
}

const richDiagnostic: HydrationDiagnostic = {
    formatBindingMismatch(factory, firstChild, lastChild, hostName) {
        const expected = describeExpectedTarget(factory);
        const received: HydrationMismatchActual = {
            html: serializeRangeForError(firstChild, lastChild),
        };
        const result: HydrationDiagnosticResult = {
            message: formatMismatchMessage(hostName, expected, received),
            expected,
            received,
        };
        return result;
    },
    formatStructuralError(node, hostName, expectedDescription) {
        const received: HydrationMismatchActual = {
            html: serializeNodeForError(node),
        };
        const result: HydrationDiagnosticResult = {
            message: formatMismatchMessage(hostName, expectedDescription, received),
            expected: expectedDescription,
            received,
        };
        return result;
    },
};

/**
 * Opt-in hydration debugger configuration. Pass to `enableHydration` to
 * install the rich "Expected / Received" hydration mismatch formatter:
 *
 * ```ts
 * import { enableHydration, hydrationDebugger } from "@microsoft/fast-element/hydration.js";
 *
 * enableHydration({ debugger: hydrationDebugger() });
 * ```
 *
 * @public
 */
export interface HydrationDebugger {
    /**
     * The {@link HydrationDiagnostic} the debugger installs when consumed
     * by `enableHydration`.
     */
    readonly diagnostic: HydrationDiagnostic;
}

/**
 * Returns a {@link HydrationDebugger} that, when supplied to
 * `enableHydration({ debugger })`, installs the rich hydration mismatch
 * formatter: a single-line "Expected … / Received …" message plus an HTML
 * snippet of the SSR DOM and structured `expected`/`received` fields on
 * the thrown error (both `HydrationBindingError` and
 * `HydrationTargetElementError`).
 *
 * Without the debugger, hydration errors emit only a minimal one-line
 * message pointing at this function — keeping the runtime hydration cost
 * small for production bundles that do not need rich diagnostics.
 *
 * @public
 */
export function hydrationDebugger(): HydrationDebugger {
    return { diagnostic: richDiagnostic };
}
