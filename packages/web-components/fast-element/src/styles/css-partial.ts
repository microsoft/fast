import type { FASTElement } from "../components/fast-element";
import type { Behavior } from "../observation/behavior";
import { CSSDirective } from "./css-directive";

class CSSPartial extends CSSDirective implements Behavior {
    constructor(private css: string, private behaviors: Behavior[]) {
        super();
    }

    createBehavior() {
        return this;
    }

    createCSS() {
        return this.css;
    }

    bind(el: FASTElement) {
        el.$fastController.addBehaviors(this.behaviors);
    }

    unbind(el: FASTElement) {
        el.$fastController.removeBehaviors(this.behaviors);
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
    ...values: (string | CSSDirective)[]
): CSSDirective {
    let css = "";
    const behaviors: Behavior[] = [];

    for (let i = 0; i < strings.length - 1; i++) {
        let value = values[i];
        css += strings[i];

        if (typeof value === "string") {
            css += value;
        } else {
            css += value.createCSS();

            const behavior = value.createBehavior();

            if (behavior) {
                behaviors.push(behavior);
            }
        }
    }

    css += strings[strings.length - 1];

    return new CSSPartial(css, behaviors);
}
