import { CSSDirective } from "./css-directive.js";
import { type ComposableStyles, ElementStyles } from "./element-styles.js";

/**
 * Represents the types of values that can be interpolated into a template.
 * @public
 */
export type CSSValue = ComposableStyles | CSSDirective;

function collectStyles(
    strings: TemplateStringsArray,
    values: CSSValue[],
): ComposableStyles[] {
    const styles: ComposableStyles[] = [];
    let cssString = "";

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        let value = values[i];

        if (CSSDirective.getForInstance(value) !== void 0) {
            value = (value as CSSDirective).createCSS();
        }

        if (value instanceof ElementStyles || value instanceof CSSStyleSheet) {
            if (cssString.trim() !== "") {
                styles.push(cssString);
                cssString = "";
            }

            styles.push(value);
        } else {
            cssString += value;
        }
    }

    cssString += strings[strings.length - 1];

    if (cssString.trim() !== "") {
        styles.push(cssString);
    }

    return styles;
}

/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of static composable styles and CSS directives.
 * Use the .partial method to create partial CSS fragments.
 * @public
 */
export type CSSTemplateTag = ((
    strings: TemplateStringsArray,
    ...values: CSSValue[]
) => ElementStyles) & {
    /**
     * Transforms a template literal string into partial CSS.
     * @param strings - The string fragments that are interpolated with the values.
     * @param values - The values that are interpolated with the string fragments.
     * @public
     */
    partial(strings: TemplateStringsArray, ...values: CSSValue[]): CSSDirective;
};

/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of static composable styles and CSS directives.
 * @public
 */
export const css: CSSTemplateTag = ((
    strings: TemplateStringsArray,
    ...values: CSSValue[]
): ElementStyles => {
    return new ElementStyles(collectStyles(strings, values));
}) as any;

class CSSPartial implements CSSDirective {
    private readonly value: ComposableStyles;

    constructor(styles: ComposableStyles[]) {
        this.value =
            styles.length === 0
                ? ""
                : styles.length === 1
                  ? styles[0]
                  : new ElementStyles(styles);
    }

    createCSS(): ComposableStyles {
        return this.value;
    }
}

CSSDirective.define(CSSPartial);

css.partial = (strings: TemplateStringsArray, ...values: CSSValue[]): CSSDirective => {
    return new CSSPartial(collectStyles(strings, values));
};
