import { canUseFocusVisible } from "@microsoft/fast-web-utilities";
/**
 * The string representing the focus selector to be used. Value
 * will be "focus-visible" when https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
 * is supported and "focus" when it is not.
 *
 * @public
 */
export const focusVisible = canUseFocusVisible() ? "focus-visible" : "focus";
