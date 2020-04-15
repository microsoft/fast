import { Behavior, FastElement } from "@microsoft/fast-element";

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

export interface CustomPropertyTarget {
    registerCSSCustomProperty(behavior: CSSCustomPropertyDefinition): void;
    unregisterCSSCustomProperty(behavior: CSSCustomPropertyDefinition): void;
}

export type CSSCustomPropertyBehavior = Behavior & CSSCustomPropertyDefinition;

export function cssCustomPropertyBehaviorFactory(
    name: string,
    value: string | ((...arg: any[]) => string),
    host: (source: typeof FastElement & HTMLElement) => CustomPropertyTarget | null
): CSSCustomPropertyBehavior {
    return Object.freeze({
        name,
        value,
        host,
        bind(source: typeof FastElement | HTMLElement): void {
            const target = this.host(source);

            if (target) {
                target.registerCSSCustomProperty(this);
            }
        },
        unbind(source: typeof FastElement | HTMLElement): void {
            const target = this.host(source);

            if (target) {
                target.unregisterCSSCustomProperty(this);
            }
        },
    });
}
