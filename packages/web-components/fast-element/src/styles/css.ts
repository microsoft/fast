import { isString } from "../interfaces.js";
import type { HostBehavior, HostBehaviorController } from "../observation/behavior.js";
import { AddBehavior, CSSDirective } from "./css-directive.js";
import { ComposableStyles, ElementStyles } from "./element-styles.js";

function collectStyles(
    strings: TemplateStringsArray,
    values: (ComposableStyles | CSSDirective)[]
): { styles: ComposableStyles[]; behaviors: HostBehavior<HTMLElement>[] } {
    const styles: ComposableStyles[] = [];
    let cssString = "";
    const behaviors: HostBehavior<HTMLElement>[] = [];
    const add = (behavior: HostBehavior<HTMLElement>): void => {
        behaviors.push(behavior);
    };

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        let value = values[i];

        if (CSSDirective.getForInstance(value) !== void 0) {
            value = (value as CSSDirective).createCSS(add);
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
 * Use the .partial method to create partial CSS fragments.
 * @public
 */
export type CSSTemplateTag = ((
    strings: TemplateStringsArray,
    ...values: (ComposableStyles | CSSDirective)[]
) => ElementStyles) & {
    /**
     * Transforms a template literal string into partial CSS.
     * @param strings - The string fragments that are interpolated with the values.
     * @param values - The values that are interpolated with the string fragments.
     * @public
     */
    partial(
        strings: TemplateStringsArray,
        ...values: (ComposableStyles | CSSDirective)[]
    ): CSSDirective;
};

/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of strings and ElementStyle instances.
 * @public
 */
export const css: CSSTemplateTag = ((
    strings: TemplateStringsArray,
    ...values: (ComposableStyles | CSSDirective)[]
): ElementStyles => {
    const { styles, behaviors } = collectStyles(strings, values);
    const elementStyles = new ElementStyles(styles);
    return behaviors.length ? elementStyles.withBehaviors(...behaviors) : elementStyles;
}) as any;

class CSSPartial implements CSSDirective, HostBehavior<HTMLElement> {
    private css: string = "";
    private styles?: ElementStyles;

    constructor(
        styles: ComposableStyles[],
        private behaviors: HostBehavior<HTMLElement>[]
    ) {
        const stylesheets: ReadonlyArray<Exclude<
            ComposableStyles,
            string
        >> = styles.reduce(
            (
                accumulated: Exclude<ComposableStyles, string>[],
                current: ComposableStyles
            ) => {
                if (isString(current)) {
                    this.css += current;
                } else {
                    accumulated.push(current);
                }

                return accumulated;
            },
            []
        );

        if (stylesheets.length) {
            this.styles = new ElementStyles(stylesheets);
        }
    }

    createCSS(add: AddBehavior): string {
        this.behaviors.forEach(add);

        if (this.styles) {
            add(this);
        }

        return this.css;
    }

    attach(controller: HostBehaviorController<HTMLElement>): void {
        (controller.source as any).$fastController.addStyles(this.styles);
    }

    detach(controller: HostBehaviorController<HTMLElement>): void {
        (controller.source as any).$fastController.removeStyles(this.styles);
    }
}

CSSDirective.define(CSSPartial);

css.partial = (
    strings: TemplateStringsArray,
    ...values: (ComposableStyles | CSSDirective)[]
): CSSDirective => {
    const { styles, behaviors } = collectStyles(strings, values);
    return new CSSPartial(styles, behaviors);
};

/**
 * @deprecated Use css.partial instead.
 * @public
 */
export const cssPartial = css.partial;
