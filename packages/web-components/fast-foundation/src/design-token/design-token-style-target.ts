import type { PropertyTarget } from "./custom-property-manager.js";

/**
 * A constructable style target that can be registered
 * for DesignToken default style emission.
 *
 * Useful for controlling where CSS is emitted to, or when needing
 * to collect styles for SSR processes.
 *
 * @public
 */
export class DesignTokenStyleTarget implements PropertyTarget {
    private properties = new Map<string, string>();
    setProperty(name: string, value: string): void {
        this.properties.set(name, value);
    }
    removeProperty(name: string): void {
        this.properties.delete(name);
    }

    /**
     * The CSS text for the style target.
     * The text does *not* contain [CSS selector text](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).
     */
    public get cssText(): string {
        let css = "";

        for (const [key, value] of this.properties) {
            css += `${key}: ${value};`;
        }

        return css;
    }

    /**
     * The values set for the target as an array of key/value pairs.
     */
    public get values(): Array<[string, string]> {
        return Array.from(this.properties);
    }
}
