import { canUseDOM } from "exenv-es6";
import { isBoolean } from "lodash-es";

/**
 * A test that ensures that all arguments are HTML Elements
 */
export function isHTMLElement(...args: any[]): boolean {
    return args.every((arg: any) => arg instanceof HTMLElement);
}

/**
 * Returns all displayed elements inside of a root node that match a provided selector
 */
export function getDisplayedNodes(
    rootNode: HTMLElement,
    selector: string
): HTMLElement[] | void {
    if (!isHTMLElement(rootNode)) {
        return;
    }

    const nodes: HTMLElement[] = Array.from(rootNode.querySelectorAll(selector));

    // offsetParent will be null if the element isn't currently displayed,
    // so this will allow us to operate only on visible nodes
    return nodes.filter((node: HTMLElement) => node.offsetParent !== null);
}

/**
 * Gets the numeric key code associated with a keyboard event. This method is for use with DOM level 3 events
 * that still use the deprecated keyCode property.
 */
export function getKeyCode(event: KeyboardEvent): number {
    return event === null ? null : event.which || event.keyCode || event.charCode;
}

/**
 * Returns the nonce used in the page, if any.
 *
 * Based on https://github.com/cssinjs/jss/blob/master/packages/jss/src/DomRenderer.js
 */
function getNonce(): string | null {
    const node = document.querySelector('meta[property="csp-nonce"]');
    if (node) {
        return node.getAttribute("content");
    } else {
        return null;
    }
}

/**
 * Test if the document supports :focus-visible
 */
let _canUseFocusVisible: boolean;
export function canUseFocusVisible(): boolean {
    if (isBoolean(_canUseFocusVisible)) {
        return _canUseFocusVisible;
    }

    if (!canUseDOM()) {
        _canUseFocusVisible = false;

        return _canUseFocusVisible;
    }

    // Check to see if the document supports the focus-visible element
    const styleElement: HTMLStyleElement = document.createElement("style");

    // If nonces are present on the page, use it when creating the style element
    // to test focus-visible support.
    const styleNonce = getNonce();
    if (styleNonce !== null) {
        styleElement.setAttribute("nonce", styleNonce);
    }
    document.head.appendChild(styleElement);

    try {
        (styleElement.sheet as any).insertRule("foo:focus-visible {color:inherit}", 0);
        _canUseFocusVisible = true;
    } catch (e) {
        _canUseFocusVisible = false;
    } finally {
        document.head.removeChild(styleElement);
    }

    return _canUseFocusVisible as boolean;
}

let _canUseCssGrid: boolean;
export function canUseCssGrid(): boolean {
    if (isBoolean(_canUseCssGrid)) {
        return _canUseCssGrid;
    }

    try {
        _canUseCssGrid = CSS.supports("display", "grid");
    } catch {
        _canUseCssGrid = false;
    }

    return _canUseCssGrid;
}

export function canUseForcedColors(): boolean {
    return (
        canUseDOM() &&
        (window.matchMedia("(forced-colors: none)").matches ||
            window.matchMedia("(forced-colors: active)").matches)
    );
}

export function resetDocumentCache(): void {
    _canUseCssGrid = undefined;
    _canUseFocusVisible = undefined;
}

/**
 * @deprecated Use 'canUseForcedColors' instead
 */
export const canUsedForcedColors: typeof canUseForcedColors = canUseForcedColors;
