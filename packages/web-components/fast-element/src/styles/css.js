import { CSSDirective } from "./css-directive";
import { ElementStyles } from "./element-styles";
function collectStyles(strings, values) {
    const styles = [];
    let cssString = "";
    const behaviors = [];
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
export function css(strings, ...values) {
    const { styles, behaviors } = collectStyles(strings, values);
    const elementStyles = ElementStyles.create(styles);
    if (behaviors.length) {
        elementStyles.withBehaviors(...behaviors);
    }
    return elementStyles;
}
class CSSPartial extends CSSDirective {
    constructor(styles, behaviors) {
        super();
        this.behaviors = behaviors;
        this.css = "";
        const stylesheets = styles.reduce((accumulated, current) => {
            if (typeof current === "string") {
                this.css += current;
            } else {
                accumulated.push(current);
            }
            return accumulated;
        }, []);
        if (stylesheets.length) {
            this.styles = ElementStyles.create(stylesheets);
        }
    }
    createBehavior() {
        return this;
    }
    createCSS() {
        return this.css;
    }
    bind(el) {
        if (this.styles) {
            el.$fastController.addStyles(this.styles);
        }
        if (this.behaviors.length) {
            el.$fastController.addBehaviors(this.behaviors);
        }
    }
    unbind(el) {
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
export function cssPartial(strings, ...values) {
    const { styles, behaviors } = collectStyles(strings, values);
    return new CSSPartial(styles, behaviors);
}
