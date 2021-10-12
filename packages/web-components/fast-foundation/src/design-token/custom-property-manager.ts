import {
    Constructable,
    Controller,
    DOM,
    ElementStyles,
    FASTElement,
    observable,
    Observable,
} from "@microsoft/fast-element";

export const defaultElement = document.createElement("div");

function isFastElement(element: HTMLElement | FASTElement): element is FASTElement {
    return element instanceof FASTElement;
}

interface PropertyTarget {
    setProperty(name: string, value: string | null): void;
    removeProperty(name: string);
}

abstract class QueuedStyleSheetTarget implements PropertyTarget {
    protected abstract target: PropertyTarget;

    public setProperty(name: string, value: string) {
        DOM.queueUpdate(() => this.target.setProperty(name, value));
    }
    public removeProperty(name: string) {
        DOM.queueUpdate(() => this.target.removeProperty(name));
    }
}
/**
 * Handles setting properties for a FASTElement using Constructable Stylesheets
 */
class ConstructableStyleSheetTarget extends QueuedStyleSheetTarget {
    protected target: PropertyTarget;
    constructor(source: HTMLElement & FASTElement) {
        super();

        const sheet = new CSSStyleSheet();
        this.target = (sheet.cssRules[sheet.insertRule(":host{}")] as CSSStyleRule).style;
        source.$fastController.addStyles(ElementStyles.create([sheet]));
    }
}

class DocumentStyleSheetTarget extends QueuedStyleSheetTarget {
    protected target: PropertyTarget;
    constructor() {
        super();

        const sheet = new CSSStyleSheet();
        this.target = (sheet.cssRules[sheet.insertRule(":root{}")] as CSSStyleRule).style;
        (document as any).adoptedStyleSheets = [
            ...(document as any).adoptedStyleSheets,
            sheet,
        ];
    }
}

class HeadStyleElementStyleSheetTarget extends QueuedStyleSheetTarget {
    protected target: PropertyTarget;
    private readonly style: HTMLStyleElement;

    constructor() {
        super();

        this.style = document.createElement("style") as HTMLStyleElement;
        document.head.appendChild(this.style);
        const { sheet } = this.style;

        // Because the HTMLStyleElement has been appended,
        // there shouldn't exist a case where `sheet` is null,
        // but if-check it just in case.
        if (sheet) {
            const index = sheet.insertRule(":root{}");
            this.target = (sheet.rules[index] as CSSStyleRule).style;
        }
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

/**
 * Controls emission for default values. This control is capable
 * of emitting to multiple {@link PropertyTarget | PropertyTargets},
 * and only emits if it has at least one root.
 *
 * @internal
 */
export class RootStyleSheetTarget implements PropertyTarget {
    private static roots = new Set<HTMLElement | Document>();
    private static properties: Record<string, string> = {};
    public setProperty(name: string, value: any): void {
        RootStyleSheetTarget.properties[name] = value;

        for (const target of RootStyleSheetTarget.roots.values()) {
            PropertyTargetManager.getOrCreate(target).setProperty(name, value);
        }
    }

    public removeProperty(name: string): void {
        delete RootStyleSheetTarget.properties[name];
        for (const target of RootStyleSheetTarget.roots.values()) {
            PropertyTargetManager.getOrCreate(target).removeProperty(name);
        }
    }

    public static registerRoot(root: HTMLElement | Document) {
        const { roots } = RootStyleSheetTarget;
        root = root === defaultElement ? document : root;
        if (!roots.has(root)) {
            roots.add(root);
            const target = PropertyTargetManager.getOrCreate(root);
            for (const key in RootStyleSheetTarget.properties) {
                target.setProperty(key, RootStyleSheetTarget.properties[key]);
            }
        }
    }

    public static deregisterRoot(root: HTMLElement | Document) {
        const { roots } = RootStyleSheetTarget;
        root = root === defaultElement ? document : root;
        if (roots.has(root)) {
            roots.delete(root);

            const target = PropertyTargetManager.getOrCreate(root);
            for (const key in RootStyleSheetTarget.properties) {
                target.removeProperty(key);
            }
        }
    }
}

// Caches PropertyTarget instances
const propertyTargetCache: WeakMap<
    HTMLElement | Document,
    PropertyTarget
> = new WeakMap();
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
    getOrCreate(source: HTMLElement | Document): PropertyTarget {
        if (propertyTargetCache.has(source)) {
            return propertyTargetCache.get(source)!;
        }

        let target: PropertyTarget;

        if (source === defaultElement) {
            target = new RootStyleSheetTarget();
        } else if (source instanceof Document) {
            target = DOM.supportsAdoptedStyleSheets
                ? new DocumentStyleSheetTarget()
                : new HeadStyleElementStyleSheetTarget();
        } else if (isFastElement(source as HTMLElement)) {
            target = new propertyTargetCtor(source);
        } else {
            target = new ElementStyleSheetTarget(source as HTMLElement);
        }

        propertyTargetCache.set(source, target);

        return target;
    },
});
