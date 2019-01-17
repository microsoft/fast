import { canUseFocusVisible } from "@microsoft/fast-web-utilities";
import { DesignSystem } from "../design-system";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { isPlainObject } from "lodash-es";

/**
 * Returns the selector for the browser native :focus-visible implementation
 */
export function focusVisibleSelector(selector: string = ""): string {
    return `&:focus-visible${selector}`;
}

/**
 * Returns the selector for the focus-visible polyfill
 */
export function focusVisiblePollyfillSelector(selector: string = ""): string {
    return `body:not(.js-focus-visible) &:focus${selector}, .js-focus-visible &.focus-visible${selector}`;
}

export function focus(styles: CSSRules<DesignSystem>): CSSRules<DesignSystem>;
export function focus(
    selector: string,
    styles: CSSRules<DesignSystem>
): CSSRules<DesignSystem>;
export function focus(
    a: CSSRules<DesignSystem> | string,
    b?: CSSRules<DesignSystem>
): CSSRules<DesignSystem> {
    let styles: CSSRules<DesignSystem>;
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
                  [focusVisibleSelector(selector)]: styles,
              }
            : {
                  [focusVisiblePollyfillSelector(selector)]: styles,
              }
    );
}
