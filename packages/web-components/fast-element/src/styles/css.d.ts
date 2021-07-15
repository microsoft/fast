import { CSSDirective } from "./css-directive";
import { ComposableStyles, ElementStyles } from "./element-styles";
/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of strings and ElementStyle instances.
 * @public
 */
export declare function css(
    strings: TemplateStringsArray,
    ...values: (ComposableStyles | CSSDirective)[]
): ElementStyles;
/**
 * Transforms a template literal string into partial CSS.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @public
 */
export declare function cssPartial(
    strings: TemplateStringsArray,
    ...values: (ComposableStyles | CSSDirective)[]
): CSSDirective;
