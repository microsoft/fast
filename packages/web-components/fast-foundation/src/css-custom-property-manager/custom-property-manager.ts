import { css, ElementStyles } from "@microsoft/fast-element";
import { DI, InterfaceSymbol } from "../di";
export interface CustomPropertyManager {
    /**
     * Retrieves an {@link @microsoft/fast-element#ElementStyles} by key and value. If
     * no entry for the provided key and value exist, one will be created. The returned
     * styles contain a CSS custom property, where the property name is the key (or the aliased value)
     * and the property value is the provided value.
     * @param key The key being resolved
     * @param value The value of the key being resolved.
     */
    get(key: string, value: any): ElementStyles;
}

export class CustomPropertyManagerImpl {
    private static cache = new Map<string, Map<any, ElementStyles>>();
    private selector = ":host";

    /**
     * {@inheritdoc CustomPropertyManager.get}
     */
    public get(key: string, value: any): ElementStyles {
        let keyCache = CustomPropertyManagerImpl.cache.get(key);

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
     * Creates an ElementStyles with the key/value CSS custom property
     * on the host
     */
    private create(key, value): ElementStyles {
        return css`${this.selector}{${CustomPropertyManagerImpl.format(key)}:${value};}`;
    }

    /**
     * Formats a name as a CSS custom property
     * @param name The name to format
     */
    public static format(name: string) {
        return `--${name}`;
    }
}

/**
 * DI decorator to get the app CustomPropertyManager
 */
export const DICustomPropertyManager: InterfaceSymbol<CustomPropertyManager> = DI.createInterface(
    "custom-property-manager"
).noDefault();
