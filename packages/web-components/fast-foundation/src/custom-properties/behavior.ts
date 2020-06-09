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

/**
 * A Behavior that, when bound, will register itself with the nearest
 * CSSCustomPropertyTarget
 */
export class CSSCustomPropertyBehavior implements Behavior, CSSCustomPropertyDefinition {
    /**
     * The name of the CSS Custom Property behavior.
     */
    public readonly name: CSSCustomPropertyDefinition["name"];

    /**
     * The value or function that will resolve the value of
     * the CSS Custom Property.
     */
    public readonly value: CSSCustomPropertyDefinition["value"];
    constructor(
        /**
         * The name of the custom property.
         * @remarks
         * When written as a custom property, the "--" required
         * by CSS custom properties will be prepended to this value.
         */
        name: string,

        /**
         * The value of the custom property or a function that
         * resolves the value.
         * @remarks
         * When a resolver is provided, the resolver will be invoked
         * by the element returned from the host argument.
         */
        value: CSSCustomPropertyDefinition["value"],

        /**
         * The element that registers the behavior.
         * @remarks
         * This element should also be responsible for resolving
         * and function value.
         */
        host: (
            source: typeof FASTElement & HTMLElement
        ) => Partial<CSSCustomPropertyTarget> | null
    ) {
        this.name = name;
        this.value = value;
        this.host = host;
    }

    private host: (
        source: typeof FASTElement & HTMLElement
    ) => Partial<CSSCustomPropertyTarget> | null;

    private _var: string;
    /**
     * Return the CSS Custom Property formatted
     * as a CSS variable.
     */
    public get var() {
        if (this._var === void 0) {
            this._var = `var(--${this.name})`;
        }

        return this._var;
    }

    /**
     * Binds the behavior to a source element
     * @param source The source element being bound
     */
    bind(source: typeof FASTElement & HTMLElement): void {
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
    }

    /**
     * Unbinds the behavior from the source element.
     * @param source The source element being unbound
     */
    unbind(source: typeof FASTElement & HTMLElement): void {
        const target = this.host(source);

        if (target !== null && typeof target.unregisterCSSCustomProperty === "function") {
            target.unregisterCSSCustomProperty(this);
        }
    }
}
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
    return new CSSCustomPropertyBehavior(name, value, host);
}
