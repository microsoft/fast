import { Behavior, FastElement } from "@microsoft/fast-element";
export interface CustomPropertyDefinition {
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
    registerCSSCustomProperty(behavior: CustomPropertyDefinition): void;
    unregisterCSSCustomProperty(behavior: CustomPropertyDefinition): void;
}

export type CSSCustomPropertyBehavior = Behavior & CustomPropertyDefinition;

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

export * from "./custom-property-manager";
