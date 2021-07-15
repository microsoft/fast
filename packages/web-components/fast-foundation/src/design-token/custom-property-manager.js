import { css, DOM, FASTElement } from "@microsoft/fast-element";
/**
 * Caching mechanism for CSS custom properties
 */
class CustomPropertyManagerImpl {
    /**
     * {@inheritdoc CustomPropertyManager.get}
     */
    getElementStyles(key, value) {
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
    getOrCreateAppliedCache(element) {
        if (CustomPropertyManagerImpl.appliedCache.has(element)) {
            return CustomPropertyManagerImpl.appliedCache.get(element);
        }
        return (
            CustomPropertyManagerImpl.appliedCache.set(element, new Map()) &&
            CustomPropertyManagerImpl.appliedCache.get(element)
        );
    }
    /**
     * Creates an ElementStyles with the key/value CSS custom property
     * on the host
     */
    createElementStyles(token, value) {
        return css`:host{${token.cssCustomProperty}:${value};}`;
    }
    addTo(element, token, value) {
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
    removeFrom(element, token) {
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
CustomPropertyManagerImpl.cache = new Map();
CustomPropertyManagerImpl.appliedCache = new WeakMap();
function isFastElement(element) {
    return element instanceof FASTElement;
}
/**
 * @internal
 */
export const CustomPropertyManager = new CustomPropertyManagerImpl();
