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
    rootNode: HTMLElement | null,
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

/**
 * @deprecated Use 'canUseForcedColors' instead
 */
export const canUsedForcedColors: typeof canUseForcedColors = canUseForcedColors;
