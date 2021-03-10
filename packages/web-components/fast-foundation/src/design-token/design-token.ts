import { CSSDirective, FASTElement, Observable } from "@microsoft/fast-element";
import { CustomPropertyManager } from "./custom-property-manager";
import { DesignTokenNode } from "./token-node";

export type DerivedDesignTokenValue<T> = T extends Function
    ? never
    : (target: HTMLElement & FASTElement) => T;
export type StaticDesignTokenValue<T> = T extends Function ? never : T;
export type DesignTokenValue<T> = StaticDesignTokenValue<T> | DerivedDesignTokenValue<T>;

class DesignTokenImpl<T> extends CSSDirective implements DesignToken<T> {
    private cssVar: string;

    constructor(public readonly name: string) {
        super();

        this.cssCustomProperty = `--${name}`;
        this.cssVar = `var(${this.cssCustomProperty})`;
    }

    /**
     * Returns the {@link DesignToken} formatted as a CSS variable if configured to
     * write CSS, otherwise returns empty string
     *
     * @returns - string
     */
    public createCSS(): string {
        return this.cssVar;
    }

    /**
     * The {@link DesignToken} formatted as a CSS custom property if the token is
     * configured to write a CSS custom property, otherwise empty string;
     */
    public readonly cssCustomProperty: string;

    /**
     * Get the token value for an element.
     * @param element - The element to get the value for
     * @returns - The value set for the element, or the value set for the nearest element ancestor.
     */
    public getValueFor(element: HTMLElement & FASTElement): StaticDesignTokenValue<T> {
        return DesignTokenNode.for(this, element).value;
    }

    /**
     * Sets the token to a value for an element.
     * @param element - The element to set the value for.
     * @param value - The value.
     */
    public setValueFor(
        element: HTMLElement & FASTElement,
        value: DesignTokenValue<T>
    ): this {
        DesignTokenNode.for(this, element).set(value);
        return this;
    }

    /**
     * Adds the token as a CSS Custom Property to an element
     * @param element - The element to add the CSS Custom Property to
     */
    public addCustomPropertyFor(element: HTMLElement & FASTElement): this {
        // Implementation should change so it doesn't result in multiple subscriptions
        // if invoked for the same element twice. Also will want a way to remove the custom
        // property, which this doesn't allow
        const node = DesignTokenNode.for(this, element);
        let style = CustomPropertyManager.get(this, node.value);

        element.$fastController.addStyles(style);

        Observable.getNotifier(node).subscribe(
            {
                handleChange: (source, value) => {
                    element.$fastController.removeStyles(style);
                    style = CustomPropertyManager.get(this, source[value]);
                    element.$fastController.addStyles(style);
                },
            },
            "value"
        );

        return this;
    }
}

export interface DesignToken<T> extends CSSDirective {
    readonly cssCustomProperty: string;
    addCustomPropertyFor(element: HTMLElement & FASTElement): this;
    getValueFor(element: HTMLElement & FASTElement): StaticDesignTokenValue<T>;
    setValueFor(element: HTMLElement & FASTElement, value: DesignTokenValue<T>): void;
}

function create<T extends Function>(name: string): never;
function create<T>(name: string): DesignToken<T>;
function create<T>(name: string): any {
    return new DesignTokenImpl<T>(name);
}

export const DesignToken = Object.freeze({
    create,
});
