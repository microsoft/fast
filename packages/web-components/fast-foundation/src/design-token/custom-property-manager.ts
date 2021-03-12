import { css, DOM, ElementStyles, FASTElement } from "@microsoft/fast-element";

/**
 * Caching mechanism for CSS custom properties
 */
class CustomPropertyManagerImpl {
    private static cache = new Map<string, Map<any, ElementStyles>>();

    /**
     * {@inheritdoc CustomPropertyManager.get}
     */
    private getElementStyles(
        key: { cssCustomProperty: string },
        value: any
    ): ElementStyles {
        let keyCache = CustomPropertyManagerImpl.cache.get(key.cssCustomProperty);

        if (!keyCache) {
            keyCache = new Map();
            CustomPropertyManagerImpl.cache.set(key.cssCustomProperty, keyCache);
        }

        let v = keyCache.get(value);

        if (!v) {
            v = this.createElementStyles(key, value);
            keyCache.set(value, v);
        }

        return v;
    }

    /**
     * Creates an ElementStyles with the key/value CSS custom property
     * on the host
     */
    private createElementStyles(
        token: { cssCustomProperty: string },
        value: any
    ): ElementStyles {
        return css`:host{${token.cssCustomProperty}:${value};}`;
    }

    public addTo(
        element: HTMLElement,
        token: { cssCustomProperty: string },
        value: any
    ): void {
        if (isFastElement(element)) {
            element.$fastController.addStyles(this.getElementStyles(token, value));
        } else {
            DOM.queueUpdate(() =>
                element.style.setProperty(token.cssCustomProperty, value)
            );
        }
    }

    public removeFrom(
        element: HTMLElement,
        token: { cssCustomProperty: string },
        value: any
    ): void {
        if (isFastElement(element)) {
            element.$fastController.removeStyles(this.getElementStyles(token, value));
        } else if (element.style.getPropertyValue(token.cssCustomProperty) === value) {
            DOM.queueUpdate(() => element.style.removeProperty(token.cssCustomProperty));
        }
    }
}

function isFastElement(element: HTMLElement | FASTElement): element is FASTElement {
    return element instanceof FASTElement;
}

/**
 * @internal
 */
export const CustomPropertyManager = new CustomPropertyManagerImpl();
