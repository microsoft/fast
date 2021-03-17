import type { Behavior, FASTElement } from "@microsoft/fast-element";

/**
 * A structure representing a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/--* | CSS custom property}.
 * @public
 */
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

/**
 * A structure that can register and unregister {@link CSSCustomPropertyDefinition | CSSCustomPropertyDefinitions}.
 * @public
 */
export interface CSSCustomPropertyTarget {
    registerCSSCustomProperty(behavior: CSSCustomPropertyDefinition): void;
    unregisterCSSCustomProperty(behavior: CSSCustomPropertyDefinition): void;
    disconnectedCSSCustomPropertyRegistry: CSSCustomPropertyDefinition[] | void;
}

/**
 * A Behavior that will register to a {@link CSSCustomPropertyTarget} when bound.
 *
 * @public
 */
export class CSSCustomPropertyBehavior implements Behavior, CSSCustomPropertyDefinition {
    /**
     * The name of the {@link https://developer.mozilla.org/en-US/docs/Web/CSS/--* | CSS custom property}.
     * @public
     */
    public readonly name: CSSCustomPropertyDefinition["name"];

    /**
     * The value or function that will resolve the value of
     * the {@link https://developer.mozilla.org/en-US/docs/Web/CSS/--* | CSS custom property}.
     * @public
     */
    public readonly value: CSSCustomPropertyDefinition["value"];

    /**
     * The name of the CSSCustomPropertyBehavior formatted
     * as a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/--* | CSS custom property}.
     * @public
     */
    public readonly propertyName: string;

    /**
     * Return the {@link https://developer.mozilla.org/en-US/docs/Web/CSS/--* | CSS custom property} formatted
     * as a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties | CSS variable}.
     *
     * @public
     */
    public readonly var: string;

    /**
     *
     * @param name - The name of the custom property, without the prepended "--" required by {@link https://developer.mozilla.org/en-US/docs/Web/CSS/--* | CSS custom properties}.
     * @param value - The value of the custom property or a function that resolves the value.
     * @param host - A function that resolves the host element that will register the behavior
     */
    constructor(
        name: string,
        value: CSSCustomPropertyDefinition["value"],
        host: (source: HTMLElement) => Partial<CSSCustomPropertyTarget> | null
    ) {
        this.name = name;
        this.value = value;
        this.host = host;
        this.propertyName = `--${name}`;
        this.var = `var(${this.propertyName})`;
    }

    private host: (source: HTMLElement) => Partial<CSSCustomPropertyTarget> | null;

    /**
     * Binds the behavior to a source element
     * @param source - The source element being bound
     * @internal
     */
    bind(source: HTMLElement): void {
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
     * @param source - The source element being unbound
     * @internal
     */
    unbind(source: HTMLElement): void {
        const target = this.host(source);

        if (target !== null && typeof target.unregisterCSSCustomProperty === "function") {
            target.unregisterCSSCustomProperty(this);
        }
    }
}

/**
 * Create a CSS Custom Property behavior.
 * @param name - The name of the CSS custom property
 * @param value - The value or value resolver of the custom property
 * @param host - A function to resolve the element to host the CSS custom property
 * @public
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
