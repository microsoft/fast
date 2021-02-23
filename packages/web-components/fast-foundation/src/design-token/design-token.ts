import { CSSDirective } from "@microsoft/fast-element";

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
