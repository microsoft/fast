import { isFunction, isString } from "../interfaces.js";
import type { Expression } from "../observation/observable.js";
import { Binding } from "../binding/binding.js";
import { oneWay } from "../binding/one-way.js";
import type { HostBehavior, HostController } from "./host.js";
import { AddBehavior, CSSDirective } from "./css-directive.js";
import { ComposableStyles, ElementStyles } from "./element-styles.js";
import { CSSBindingDirective } from "./css-binding-directive.js";

/**
 * Represents the types of values that can be interpolated into a template.
 * @public
 */
export type CSSValue<TSource, TParent = any> =
    | Expression<TSource, any, TParent>
    | Binding<TSource, any, TParent>
    | ComposableStyles
    | CSSDirective;

const marker = `${Math.random().toString(36).substring(2, 8)}`;
let varId = 0;
const nextCSSVariable = (): string => `--v${marker}${++varId}`;

function collectStyles<TSource = any, TParent = any>(
    strings: TemplateStringsArray,
    values: CSSValue<TSource, TParent>[]
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

        if (isFunction(value)) {
            value = new CSSBindingDirective(oneWay(value), nextCSSVariable()).createCSS(
                add
            );
        } else if (value instanceof Binding) {
            value = new CSSBindingDirective(value, nextCSSVariable()).createCSS(add);
        } else if (CSSDirective.getForInstance(value) !== void 0) {
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
export type CSSTemplateTag = (<TSource = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: CSSValue<TSource, TParent>[]
) => ElementStyles) & {
    /**
     * Transforms a template literal string into partial CSS.
     * @param strings - The string fragments that are interpolated with the values.
     * @param values - The values that are interpolated with the string fragments.
     * @public
     */
    partial<TSource = any, TParent = any>(
        strings: TemplateStringsArray,
        ...values: CSSValue<TSource, TParent>[]
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
export const css: CSSTemplateTag = (<TSource = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: CSSValue<TSource, TParent>[]
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
        const stylesheets: ReadonlyArray<Exclude<ComposableStyles, string>> =
            styles.reduce(
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

    addedCallback(controller: HostController<HTMLElement>): void {
        controller.addStyles(this.styles);
    }

    removedCallback(controller: HostController<HTMLElement>): void {
        controller.removeStyles(this.styles);
    }
}

CSSDirective.define(CSSPartial);

css.partial = <TSource = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: CSSValue<TSource, TParent>[]
): CSSDirective => {
    const { styles, behaviors } = collectStyles(strings, values);
    return new CSSPartial(styles, behaviors);
};
