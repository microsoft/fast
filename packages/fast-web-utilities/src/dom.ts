import { canUseDOM } from "exenv-es6";
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
    if (typeof _canUseFocusVisible === "boolean") {
        return _canUseFocusVisible;
    }

    if (!canUseDOM()) {
        _canUseFocusVisible = false;
    }

    // Check to see if the document supports the focus-visible elemtn
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
