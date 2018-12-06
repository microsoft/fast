import { canUseDOM } from "exenv-es6";

/**
 * Returns ':focus-visible' if the browser supports it and `:focus` if focus-visible is not supported
 */
let _canUseFocusVisible: boolean = false;

export function focusVisible(): ":focus" | ":focus-visible" {
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
    }

    return _canUseFocusVisible as boolean;
}
