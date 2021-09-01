import {
    Constructable,
    Controller,
    DOM,
    ElementStyles,
    FASTElement,
    observable,
    Observable,
} from "@microsoft/fast-element";

function isFastElement(element: HTMLElement | FASTElement): element is FASTElement {
    return element instanceof FASTElement;
}

interface PropertyTarget {
    setProperty(name: string, value: string | null): void;
    removeProperty(name: string);
}

/**
 * Handles setting properties for a FASTElement using Constructable Stylesheets
 */
class ConstructableStyleSheetTarget implements PropertyTarget {
    private target: PropertyTarget;
    constructor(source: HTMLElement & FASTElement) {
        const sheet = new CSSStyleSheet();
        this.target = (sheet.cssRules[sheet.insertRule(":host{}")] as CSSStyleRule).style;
        source.$fastController.addStyles(ElementStyles.create([sheet]));
    }

    public setProperty(name: string, value: string) {
        DOM.queueUpdate(() => this.target.setProperty(name, value));
    }
    public removeProperty(name: string) {
        DOM.queueUpdate(() => this.target.removeProperty(name));
    }
}

/**
 * Handles setting properties for a FASTElement using an HTMLStyleElement
 */
class StyleElementStyleSheetTarget implements PropertyTarget {
    private store = new Map<string, string>();
    private readonly style: HTMLStyleElement;

    @observable
    private target: PropertyTarget | null = null;
    private targetChanged() {
        if (this.target !== null) {
            for (const [key, value] of this.store.entries()) {
                this.target.setProperty(key, value);
            }
        }
    }

    constructor(target: HTMLElement & FASTElement) {
        const controller = target.$fastController;
        this.style = document.createElement("style") as HTMLStyleElement;

        controller.addStyles(this.style);

        Observable.getNotifier(controller).subscribe(this, "isConnected");
        this.handleChange(controller, "isConnected");
    }

    public setProperty(name: string, value: string) {
        this.store.set(name, value);

        DOM.queueUpdate(() => {
            if (this.target !== null) {
                this.target.setProperty(name, value);
            }
        });
    }

    public removeProperty(name: string) {
        this.store.delete(name);

        DOM.queueUpdate(() => {
            if (this.target !== null) {
                this.target.removeProperty(name);
            }
        });
    }

    handleChange(source: Controller, key: "isConnected") {
        // HTMLStyleElement.sheet is null if the element isn't connected to the DOM,
        // so this method reacts to changes in DOM connection for the element hosting
        // the HTMLStyleElement.
        //
        // All rules applied via the CSSOM also get cleared when the element disconnects,
        // so we need to add a new rule each time and populate it with the stored properties
        const { sheet } = this.style;
        if (sheet) {
            // Safari will throw if we try to use the return result of insertRule()
            // to index the rule inline, so store as a const prior to indexing.
            const index = sheet.insertRule(":host{}");
            this.target = (sheet.rules[index] as CSSStyleRule).style;
        } else {
            this.target = null;
        }
    }
}

/**
 * Handles setting properties for a normal HTMLElement
 */
class ElementStyleSheetTarget implements PropertyTarget {
    private target: PropertyTarget;
    constructor(source: HTMLElement) {
        this.target = source.style;
    }

    setProperty(name: string, value: any) {
        DOM.queueUpdate(() => this.target.setProperty(name, value));
    }
    removeProperty(name: string) {
        DOM.queueUpdate(() => this.target.removeProperty(name));
    }
}

// Caches PropertyTarget instances
const propertyTargetCache: WeakMap<HTMLElement, PropertyTarget> = new WeakMap();
// Use Constructable StyleSheets for FAST elements when supported, otherwise use
// HTMLStyleElement instances
const propertyTargetCtor: Constructable<PropertyTarget> = DOM.supportsAdoptedStyleSheets
    ? ConstructableStyleSheetTarget
    : StyleElementStyleSheetTarget;

/**
 * Manages creation and caching of PropertyTarget instances.
 *
 * @internal
 */
export const PropertyTargetManager = Object.freeze({
    getOrCreate(source: HTMLElement): PropertyTarget {
        if (propertyTargetCache.has(source)) {
            return propertyTargetCache.get(source)!;
        }

        const target = isFastElement(source)
            ? new propertyTargetCtor(source)
            : new ElementStyleSheetTarget(source);
        propertyTargetCache.set(source, target);

        return target;
    },
});
