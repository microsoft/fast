import { css, DOM, ElementStyles, FASTElement } from "@microsoft/fast-element";

/**
 * Caching mechanism for CSS custom properties
 */
class CustomPropertyManagerImpl {
    private static cache = new Map<string, Map<any, ElementStyles>>();
    private static appliedCache = new WeakMap<HTMLElement, Map<string, ElementStyles>>();

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

    private getOrCreateAppliedCache(element: HTMLElement): Map<string, ElementStyles> {
        if (CustomPropertyManagerImpl.appliedCache.has(element)) {
            return CustomPropertyManagerImpl.appliedCache.get(element)!;
        }

        return (
            CustomPropertyManagerImpl.appliedCache.set(element, new Map()) &&
            CustomPropertyManagerImpl.appliedCache.get(element)!
        );
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
            const styles = this.getElementStyles(token, value);
            element.$fastController.addStyles(styles);
            this.getOrCreateAppliedCache(element).set(token.cssCustomProperty, styles);
        } else {
            DOM.queueUpdate(() =>
                element.style.setProperty(token.cssCustomProperty, value)
            );
        }
    }

    public removeFrom(element: HTMLElement, token: { cssCustomProperty: string }): void {
        if (isFastElement(element)) {
            const cache = this.getOrCreateAppliedCache(element);
            const styles = cache.get(token.cssCustomProperty);

            if (styles) {
                element.$fastController.removeStyles(styles);
                cache.delete(token.cssCustomProperty);
            }
        } else {
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
