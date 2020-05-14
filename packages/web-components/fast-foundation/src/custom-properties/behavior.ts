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
    disconnectedCSSCustomPropertyRegistry: CSSCustomPropertyDefinition[] | void;
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
    host: (
        source: typeof FASTElement & HTMLElement
    ) => Partial<CSSCustomPropertyTarget> | null
): CSSCustomPropertyBehavior {
    return Object.freeze({
        name,
        value,
        host,
        bind(source: typeof FASTElement): void {
            const target = this.host(source);

            if (target !== null) {
                if (typeof target.registerCSSCustomProperty === "function") {
                    target.registerCSSCustomProperty(this);
                } else {
                    // There is potential for the custom property host element to not be
                    // constructed when this is run. We handle that case by accumulating
                    // the behaviors in a normal array. Behaviors associated this way will
                    // get registered when the host is connected
                    if (!Array.isArray(target.disconnectedCSSCustomPropertyRegistry)) {
                        target.disconnectedCSSCustomPropertyRegistry = [];
                    }

                    target.disconnectedCSSCustomPropertyRegistry.push(this);
                }
            }
        },
        unbind(source: typeof FASTElement): void {
            const target = this.host(source);

            if (target !== null) {
                target.unregisterCSSCustomProperty(this);
            }
        },
    });
}
