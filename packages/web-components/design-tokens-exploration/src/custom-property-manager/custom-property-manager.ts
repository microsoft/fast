import { css, ElementStyles } from "@microsoft/fast-element";
import { DI } from "../di";
export interface CSSCustomPropertyManager {
    /**
     * Retrieves an {@link @microsoft/fast-element#ElementStyles} by key and value. If
     * no entry for the provided key and value exist, one will be created. The returned
     * styles contain a CSS custom property, where the property name is the key (or the aliased value)
     * and the property value is the provided value.
     * @param key The key being resolved
     * @param value The value of the key being resolved.
     */
    get(key: string, value: any): ElementStyles;

    /**
     * Aliases a key to a new name. The name will be the name of the CSS custom property.
     * @param key The key to alias
     * @param name The new to alias the key too
     */
    alias(key: string, name: string): void;

    /**
     * Returns the CSS custom property name (including the '--' prefix) of a key.
     * @param key The key to get the name of
     */

    name(key: string): string;
}
export class FASTCustomPropertyManager {
    private static cache = new Map<string, Map<any, ElementStyles>>();
    private names = new Map<string, string>();

    /**
     * {@inheritdoc CustomPropertyManager.get}
     */
    public get(key: string, value: any): ElementStyles {
        let keyCache = FASTCustomPropertyManager.cache.get(key);

        if (!keyCache) {
            keyCache = new Map();
        }

        let v = keyCache.get(value);

        if (!v) {
            v = this.create(key, value);
            keyCache.set(value, v);
        }

        return v;
    }
    /**
     * {@inheritdoc CustomPropertyManager.alias}
     */
    public alias(key: string, name: string) {
        this.names.set(key, name);
    }

    /**
     * {@inheritdoc CustomPropertyManager.name}
     */
    public name(key: string) {
        return FASTCustomPropertyManager.format(this.names.get(key) || key);
    }

    /**
     * Creates an ElementStyles with the key/value CSS custom property
     * on the host
     */
    private create(key, value): ElementStyles {
        return css`:host{${this.name(key)}:${value};}`;
    }

    /**
     * Formats a name as a CSS custom property
     * @param name The name to format
     */
    private static format(name: string) {
        return `--${name}`;
    }
}

/**
 * DI decorator to get the app CustomPropertyManager
 */
export const CustomPropertyManager = DI.createInterface(
    "custom-property-manager"
).withDefault(x => x.singleton(FASTCustomPropertyManager));
