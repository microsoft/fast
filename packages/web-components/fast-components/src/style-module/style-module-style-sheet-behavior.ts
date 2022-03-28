import {
    Behavior,
    ComposableStyles,
    Constructable,
    CSSDirective,
    ElementStyles,
    FASTElement,
} from "@microsoft/fast-element";
import { getStyleModules } from "./style-module";

/**
 * A behavior to inject style modules into a stylesheet.
 *
 * @public
 */
export class StyleModuleStyleSheetBehavior implements Behavior {
    private styles?: ElementStyles;

    /**
     * Constructs a {@link StyleModuleStyleSheetBehavior} instance.
     * @param type - The type of element
     */
    constructor(
        private type: Constructable,
        private interactivitySelector: string,
        private nonInteractivitySelector: string
    ) {}

    // HACK: Copied from fast-element css handling to bypass template literal structure.
    private collectStyles(
        strings: string[],
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

    // HACK: Copied from fast-element css handling to bypass template literal structure.
    private css(
        strings: string[],
        ...values: (ComposableStyles | CSSDirective)[]
    ): ElementStyles {
        const { styles, behaviors } = this.collectStyles(strings, values);

        const elementStyles = ElementStyles.create(styles);

        if (behaviors.length) {
            elementStyles.withBehaviors(...behaviors);
        }

        return elementStyles;
    }

    /**
     * Binds the behavior to the element.
     * @param elementInstance - The element for which the property is applied.
     */
    public bind(elementInstance: FASTElement) {
        // console.log("StyleModuleStyleSheetBehavior.bind", elementInstance, elementInstance.$fastController);

        const registrations = getStyleModules(this.type);
        // console.log("  registrations", registrations);

        if (registrations) {
            const directives = registrations.map(registration => {
                return registration.evaluate({
                    baseSelector: registration.childSelector!,
                    interactivitySelector: this.interactivitySelector,
                    nonInteractivitySelector: this.nonInteractivitySelector,
                });
            });
            // console.log("    directives", directives);
            const strings = new Array(directives.length + 1).fill("");
            this.styles = this.css(strings, ...directives);
        }
        // console.log("  ", this.styles);

        if (this.styles) {
            elementInstance.$fastController.addStyles(this.styles);
        }
        // Observable.getNotifier(elementInstance).subscribe(this, this.propertyName);
        // this.handleChange(elementInstance, this.propertyName);
    }

    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     * @internal
     */
    public unbind(source: typeof FASTElement & HTMLElement) {
        // console.log("StyleModuleStyleSheetBehavior.unbind", source);

        // Observable.getNotifier(source).unsubscribe(this, this.propertyName);
        if (this.styles) {
            (source as any).$fastController.removeStyles(this.styles);
        }
    }

    /**
     * Change event for the provided element.
     * @param source - the element for which to attach or detach styles.
     * @param key - the key to lookup to know if the element already has the styles
     * @internal
     */
    // public handleChange(source: FASTElement, key: string) {
    //     if (source[key] === this.value) {
    //         source.$fastController.addStyles(this.styles);
    //     } else {
    //         source.$fastController.removeStyles(this.styles);
    //     }
    // }
}

/**
 * Behavior that will apply style modules to an element.
 *
 * @param type - The type of element (TODO: This could/should come from the type definition, but this may allow for flexibility).
 * @param interactivitySelector - CSS selector indicating the component should be interactive.
 * @param nonInteractivitySelector - CSS selector indicating the component should NOT be interactive.
 *
 * @public
 */
export function styleModuleBehavior(
    type: Constructable,
    interactivitySelector: string = "",
    nonInteractivitySelector: string = ""
) {
    // console.log("styleModuleBehavior", type, type.name, interactivitySelector, nonInteractivitySelector);
    return new StyleModuleStyleSheetBehavior(
        type,
        interactivitySelector,
        nonInteractivitySelector
    );
}
