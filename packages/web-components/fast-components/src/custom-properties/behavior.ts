import { Behavior, FASTElement } from "@microsoft/fast-element";

export interface CSSCustomPropertyDefinition {
    /**
     * The custom property name
     */
    name: string;

    /**
     * The value of the custom property or a function that resolves the value
     */
    value: string | ((...args: any[]) => string);
}

export interface CSSCustomPropertyTarget {
    registerCSSCustomProperty(behavior: CSSCustomPropertyDefinition): void;
    unregisterCSSCustomProperty(behavior: CSSCustomPropertyDefinition): void;
}

export type CSSCustomPropertyBehavior = Behavior & CSSCustomPropertyDefinition;

/**
 * Create a CSS Custom Property behavior.
 * @param name The name of the CSS custom property
 * @param value The value or value resolver of the custom property
 * @param host A function to resolve the element to host the CSS custom property
 */
export function cssCustomPropertyBehaviorFactory(
    name: string,
    value: string | ((...arg: any[]) => string),
    host: (source: typeof FASTElement & HTMLElement) => CSSCustomPropertyTarget | null
): CSSCustomPropertyBehavior {
    return Object.freeze({
        name,
        value,
        host,
        bind(source: typeof FASTElement | HTMLElement): void {
            const target = this.host(source);

            if (target) {
                target.registerCSSCustomProperty(this);
            }
        },
        unbind(source: typeof FASTElement | HTMLElement): void {
            const target = this.host(source);

            if (target) {
                target.unregisterCSSCustomProperty(this);
            }
        },
    });
}
