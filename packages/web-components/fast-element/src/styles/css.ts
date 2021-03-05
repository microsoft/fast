import type { Behavior } from "../observation/behavior";
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
export function css(
    strings: TemplateStringsArray,
    ...values: (ComposableStyles | CSSDirective)[]
): ElementStyles {
    const styles: ComposableStyles[] = [];
    let cssString = "";
    const behaviors: Behavior[] = [];

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        let value = values[i];

        if (value instanceof CSSDirective) {
            const behavior = value.createBehavior();
            value = value.createCSS();

            if (behavior) {
                behaviors.push(behavior);
            }
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

    const elementStyles = ElementStyles.create(styles);

    if (behaviors.length) {
        elementStyles.withBehaviors(...behaviors);
    }

    return elementStyles;
}
