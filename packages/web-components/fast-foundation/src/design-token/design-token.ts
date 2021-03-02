import { CSSDirective, FASTElement } from "@microsoft/fast-element";

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

    constructor(public readonly name: string, public readonly writeCSSProperty = true) {
        super();

        if (writeCSSProperty) {
            this.cssCustomProperty = `--${name}`;
            this.cssVar = `var(${this.cssCustomProperty})`;
        } else {
            this.cssCustomProperty = this.cssVar = "";
        }
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

    getValueFor(element: HTMLElement): T {
        return ("" as unknown) as T;
    }

    setValueFor(element: HTMLElement, value: T): void {}

    /**
     * Creates a new DesignToken
     * @param name - The name of the token.
     * @param writeCSSProperty - Whether this token should be reflected to a CSS custom property when used.
     *
     * @returns - {@link DesignToken}
     */
    public static create<T>(name: string, writeCSSProperty = true): DesignToken<T> {
        return new DesignToken<T>(name, writeCSSProperty);
    }
}
