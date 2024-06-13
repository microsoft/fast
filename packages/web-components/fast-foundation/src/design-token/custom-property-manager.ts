import type {
    Constructable,
    ElementController,
    FASTElement,
} from "@microsoft/fast-element";
import { ElementStyles, observable, Observable, Updates } from "@microsoft/fast-element";

/**
 * A target that can have key/value pairs set and removed.
 * @public
 */
export interface PropertyTarget {
    setProperty(name: string, value: string): void;
    removeProperty(name: string): void;
}

abstract class QueuedStyleSheetTarget implements PropertyTarget {
    protected abstract target: PropertyTarget;

    public setProperty(name: string, value: string) {
        Updates.enqueue(() => this.target.setProperty(name, value));
    }
    public removeProperty(name: string) {
        Updates.enqueue(() => this.target.removeProperty(name));
    }
}
/**
 * Handles setting properties for a FASTElement using Constructable Stylesheets
 */
class ConstructableStyleSheetTarget extends QueuedStyleSheetTarget {
    protected target: PropertyTarget;
    constructor(source: FASTElement) {
        super();

        const sheet = new CSSStyleSheet();
        this.target = (sheet.cssRules[sheet.insertRule(":host{}")] as CSSStyleRule).style;
        source.$fastController.addStyles(new ElementStyles([sheet]));
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
            // https://github.com/jsdom/jsdom uses https://github.com/NV/CSSOM for it's CSSOM implementation,
            // which implements the DOM Level 2 spec for CSSStyleSheet where insertRule() requires an index argument.
            const index = sheet.insertRule(":root{}", sheet.cssRules.length);
            this.target = (sheet.cssRules[index] as CSSStyleRule).style;
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

    constructor(target: FASTElement) {
        const controller = target.$fastController;
        this.style = document.createElement("style") as HTMLStyleElement;

        controller.addStyles(this.style);

        Observable.getNotifier(controller).subscribe(this, "isConnected");
        this.handleChange(controller, "isConnected");
    }

    public setProperty(name: string, value: string) {
        this.store.set(name, value);

        Updates.enqueue(() => {
            if (this.target !== null) {
                this.target.setProperty(name, value);
            }
        });
    }

    public removeProperty(name: string) {
        this.store.delete(name);

        Updates.enqueue(() => {
            if (this.target !== null) {
                this.target.removeProperty(name);
            }
        });
    }

    handleChange(source: ElementController, key: "isConnected") {
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
            // https://github.com/jsdom/jsdom uses https://github.com/NV/CSSOM for it's CSSOM implementation,
            // which implements the DOM Level 2 spec for CSSStyleSheet where insertRule() requires an index argument.
            const index = sheet.insertRule(":host{}", sheet.cssRules.length);
            this.target = (sheet.cssRules[index] as CSSStyleRule).style;
        } else {
            this.target = null;
        }
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
    private static roots = new Set<PropertyTarget>();
    private static properties: Record<string, string> = {};
    public setProperty(name: string, value: any): void {
        RootStyleSheetTarget.properties[name] = value;

        for (const target of RootStyleSheetTarget.roots.values()) {
            target.setProperty(name, value);
        }
    }

    public removeProperty(name: string): void {
        delete RootStyleSheetTarget.properties[name];
        for (const target of RootStyleSheetTarget.roots.values()) {
            target.removeProperty(name);
        }
    }

    public static registerRoot(root: PropertyTarget) {
        const { roots } = RootStyleSheetTarget;
        if (!roots.has(root)) {
            roots.add(root);
            for (const key in RootStyleSheetTarget.properties) {
                root.setProperty(key, RootStyleSheetTarget.properties[key]);
            }
        }
    }

    public static unregisterRoot(root: PropertyTarget) {
        const { roots } = RootStyleSheetTarget;
        if (roots.has(root)) {
            roots.delete(root);

            for (const key in RootStyleSheetTarget.properties) {
                root.removeProperty(key);
            }
        }
    }
}

// Caches PropertyTarget instances
const propertyTargetCache: WeakMap<FASTElement | Document, PropertyTarget> =
    new WeakMap();
// Use Constructable StyleSheets for FAST elements when supported, otherwise use
// HTMLStyleElement instances
const propertyTargetCtor: Constructable<PropertyTarget> =
    ElementStyles.supportsAdoptedStyleSheets
        ? ConstructableStyleSheetTarget
        : StyleElementStyleSheetTarget;

/**
 * Manages creation and caching of PropertyTarget instances.
 *
 * @internal
 */
export const PropertyTargetManager = Object.freeze({
    getOrCreate(source: FASTElement | Document): PropertyTarget {
        if (propertyTargetCache.has(source)) {
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            return propertyTargetCache.get(source)!;
        }

        let target: PropertyTarget;

        if (source instanceof Document) {
            target = ElementStyles.supportsAdoptedStyleSheets
                ? new DocumentStyleSheetTarget()
                : new HeadStyleElementStyleSheetTarget();
        } else {
            target = new propertyTargetCtor(source);
        }

        propertyTargetCache.set(source, target);

        return target;
    },
});
