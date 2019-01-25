import { canUseFocusVisible } from "@microsoft/fast-web-utilities";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { isPlainObject } from "lodash-es";

/**
 * Returns the selector for the browser native :focus-visible implementation
 */
export function applyFocusVisibleSelector(selector: string = ""): string {
    return `&:focus-visible${selector}`;
}

/**
 * Returns the selector for the focus-visible polyfill
 */
export function applyFocusVisiblePolyfillSelector(selector: string = ""): string {
    return `body:not(.js-focus-visible) &:focus${selector}, .js-focus-visible &.focus-visible${selector}`;
}

export function applyFocusVisible<T>(styles: CSSRules<T>): CSSRules<T>;
export function applyFocusVisible<T>(selector: string, styles: CSSRules<T>): CSSRules<T>;
export function applyFocusVisible<T>(
    a: CSSRules<T> | string,
    b?: CSSRules<T>
): CSSRules<T> {
    let styles: CSSRules<T>;
    let selector: string;

    if (typeof a === "object" && a !== null) {
        selector = "";
        styles = a;
    } else if (typeof a === "string") {
        selector = a;
        styles = b;
    } else {
        return {};
    }

    return Object.assign(
        {
            "&:focus": {
                outline: "none",
            },
        },
        canUseFocusVisible()
            ? {
                  [applyFocusVisibleSelector(selector)]: styles,
              }
            : {
                  [applyFocusVisiblePolyfillSelector(selector)]: styles,
              }
    );
}
