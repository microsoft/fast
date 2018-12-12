import { canUseDOM } from "exenv-es6";
import { canUseFocusVisible } from "@microsoft/fast-web-utilities";

/**
 * Returns ':focus-visible' if the browser supports it and `:focus` if focus-visible is not supported
 */

export function focusVisible(): ":focus" | ":focus-visible" {
    return canUseFocusVisible() ? ":focus-visible" : ":focus";
}
