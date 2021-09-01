import { Constructable, DOM, ElementStyles, FASTElement } from "@microsoft/fast-element";

/**
 * Caching mechanism for CSS custom properties
 */
class CustomPropertyManagerImpl {
    public addTo(
        element: HTMLElement,
        token: { cssCustomProperty: string },
        value: any
    ): void {
        DOM.queueUpdate(() =>
            PropertyManager.getOrCreate(element).setProperty(
                token.cssCustomProperty,
                value
            )
        );
        // if (isFastElement(element)) {
        //     const styles = this.getElementStyles(token, value);
        //     // element.$fastController.addStyles(styles);
        //     this.getOrCreateAppliedCache(element).set(token.cssCustomProperty, styles);
        // } else {
        // DOM.queueUpdate(() =>
        //     element.style.setProperty(token.cssCustomProperty, value)
        // );
        // }
    }

    public removeFrom(element: HTMLElement, token: { cssCustomProperty: string }): void {
        DOM.queueUpdate(() =>
            PropertyManager.getOrCreate(element).removeProperty(token.cssCustomProperty)
        );
        // if (isFastElement(element)) {
        //     const cache = this.getOrCreateAppliedCache(element);
        //     const styles = cache.get(token.cssCustomProperty);

        //     if (styles) {
        //         element.$fastController.removeStyles(styles);
        //         cache.delete(token.cssCustomProperty);
        //     }
        // } else {
        // DOM.queueUpdate(() => element.style.removeProperty(token.cssCustomProperty));
        // }
    }
}

function isFastElement(element: HTMLElement | FASTElement): element is FASTElement {
    return element instanceof FASTElement;
}

/**
 * @internal
 */
export const CustomPropertyManager = new CustomPropertyManagerImpl();

interface PropertyTarget {
    setProperty(name: string, value: string | null): void;
    removeProperty(name: string);
}

class ConstructableStyleSheetTarget implements PropertyTarget {
    private target: PropertyTarget;
    constructor(source: HTMLElement & FASTElement) {
        const sheet = new CSSStyleSheet();
        this.target = (sheet.cssRules[sheet.insertRule(":host{}")] as CSSStyleRule).style;
        source.$fastController.addStyles(ElementStyles.create([sheet]));
    }
    public setProperty(name: string, value: string) {
        this.target.setProperty(name, value);
    }
    public removeProperty(name: string) {
        this.target.removeProperty(name);
    }
}

class StyleElementStyleSheetTarget implements PropertyTarget {
    constructor(target: HTMLElement & FASTElement) {
        throw new Error();
    }
    public setProperty(name: string, value: string) {
        console.log("setting");
    }
    public removeProperty(name: string) {
        console.log("removing");
    }
}

class PropertyManager {
    private static cache: WeakMap<HTMLElement, PropertyManager> = new WeakMap();
    public target: PropertyTarget;
    private static propertyTargetCtor: Constructable<
        PropertyTarget
    > = ConstructableStyleSheetTarget;
    constructor(public readonly source: HTMLElement) {
        PropertyManager.cache.set(source, this);
        if (!isFastElement(source)) {
            this.target = source.style;
        } else {
            this.target = new PropertyManager.propertyTargetCtor(source);
        }
    }

    public setProperty(name: string, value: any) {
        this.target.setProperty(name, value);
    }

    public removeProperty(name) {
        this.target.removeProperty(name);
    }

    public static getOrCreate(source: HTMLElement) {
        return PropertyManager.cache.get(source) || new PropertyManager(source);
    }
}
