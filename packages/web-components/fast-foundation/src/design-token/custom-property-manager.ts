import { css, ElementStyles } from "@microsoft/fast-element";
import { DesignToken } from "./design-token";

/**
 * Caching mechanism for CSS custom properties
 */
class CustomPropertyManagerImpl {
    private static cache = new Map<string, Map<any, ElementStyles>>();
    private selector = ":host";

    /**
     * {@inheritdoc CustomPropertyManager.get}
     */
    public get(key: { cssCustomProperty: string }, value: any): ElementStyles {
        let keyCache = CustomPropertyManagerImpl.cache.get(key.cssCustomProperty);

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
    private create(token: { cssCustomProperty: string }, value: any): ElementStyles {
        return css`${this.selector}{${token.cssCustomProperty}:${value};}`;
    }
}

/**
 * @internal
 */
export const CustomPropertyManager = new CustomPropertyManagerImpl();
