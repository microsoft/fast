import type { FASTElement } from "../components/fast-element.js";
import type { Behavior } from "../observation/behavior.js";
import { CSSDirective } from "./css-directive.js";
import { ComposableStyles, ElementStyles } from "./element-styles.js";

function collectStyles(
    strings: TemplateStringsArray,
    values: (ComposableStyles | CSSDirective)[]
): { styles: ComposableStyles[]; behaviors: Behavior[] } {
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

    return {
        styles,
        behaviors,
    };
}

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
    const { styles, behaviors } = collectStyles(strings, values);

    const elementStyles = ElementStyles.create(styles);

    if (behaviors.length) {
        elementStyles.withBehaviors(...behaviors);
    }

    return elementStyles;
}

class CSSPartial extends CSSDirective implements Behavior {
    private css: string = "";
    private styles?: ElementStyles;
    constructor(styles: ComposableStyles[], private behaviors: Behavior[]) {
        super();

        const stylesheets: ReadonlyArray<Exclude<
            ComposableStyles,
            string
        >> = styles.reduce(
            (
                accumulated: Exclude<ComposableStyles, string>[],
                current: ComposableStyles
            ) => {
                if (typeof current === "string") {
                    this.css += current;
                } else {
                    accumulated.push(current);
                }
                return accumulated;
            },
            []
        );

        if (stylesheets.length) {
            this.styles = ElementStyles.create(stylesheets);
        }
    }

    createBehavior(): Behavior {
        return this;
    }

    createCSS(): string {
        return this.css;
    }

    bind(el: FASTElement): void {
        if (this.styles) {
            el.$fastController.addStyles(this.styles);
        }

        if (this.behaviors.length) {
            el.$fastController.addBehaviors(this.behaviors);
        }
    }

    unbind(el: FASTElement): void {
        if (this.styles) {
            el.$fastController.removeStyles(this.styles);
        }

        if (this.behaviors.length) {
            el.$fastController.removeBehaviors(this.behaviors);
        }
    }
}

/**
 * Transforms a template literal string into partial CSS.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @public
 */
export function cssPartial(
    strings: TemplateStringsArray,
    ...values: (ComposableStyles | CSSDirective)[]
): CSSDirective {
    const { styles, behaviors } = collectStyles(strings, values);

    return new CSSPartial(styles, behaviors);
}
