import { CSSDirective, FASTElement } from "@microsoft/fast-element";
import { CustomPropertyManager } from "./custom-property-manager";
import { DesignTokenStorageImpl } from "./storage";

export type DerivedDesignTokenValue<T> = (target: HTMLElement & FASTElement) => T;

/**
 * Notes:
 *
 * # We can establish token dependencies in much the same way that observable does:
 * Just before evaluating derived properties, flip a tracking bit. This causes the
 * `getValue` method to cache the token being retrieved. After the process,
 * all retrieved tokens will be in the cache and we can use that info to catalog dependencies
 * for a value, resetting the cache and flipping the tracking bit back to false.
 */

export class DesignToken<T = any> extends CSSDirective {
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
    public getValueFor(element: HTMLElement & FASTElement): T {
        return DesignTokenStorageImpl.for(element).get(this);
    }

    /**
     * Sets the token to a value for an element.
     * @param element - The element to set the value for.
     * @param value - The value.
     */
    public setValueFor(element: HTMLElement & FASTElement, value: T): this {
        DesignTokenStorageImpl.for(element).set(this, value);
        return this;
    }

    /**
     * Adds the token as a CSS Custom Property to an element
     * @param element - The element to add the CSS Custom Property to
     */
    public addCustomPropertyFor(element: HTMLElement & FASTElement): this {
        // TODO de-dupe observer if invoked multiple times
        DesignTokenStorageImpl.for(element).observe(this, () => {
            const value = this.getValueFor(element);

            element.$fastController.addStyles(CustomPropertyManager.get(this, value));
        });

        return this;
    }

    /**
     * Creates a new DesignToken
     * @param name - The name of the token.
     * @param writeCSSProperty - Whether this token should be reflected to a CSS custom property when used.
     *
     * @returns - {@link DesignToken}
     */
    public static create<T>(name: string): DesignToken<T> {
        return new DesignToken<T>(name);
    }
}
