import { Behavior } from "./directives/behavior";

/**
 * A node that can be targeted by styles.
 * @public
 */
export interface StyleTarget {
    /**
     * Stylesheets to be adopted by the node.
     */
    adoptedStyleSheets?: CSSStyleSheet[];

    /**
     * Adds styles to the target.
     * @param styles - The styles element to add.
     */
    prepend(styles: HTMLStyleElement): void;

    /**
     * Removes styles from the target.
     * @param styles - The styles element to remove.
     */
    removeChild(styles: HTMLStyleElement): void;

    /**
     * Returns all element descendants of node that match selectors.
     * @param selectors - The CSS selector to use for the query.
     */
    querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
}

const styleLookup = new Map<string, ElementStyles>();

/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
export abstract class ElementStyles {
    /** @internal */
    public abstract readonly styles: ReadonlyArray<InjectableStyles>;

    /** @internal */
    public abstract readonly behaviors: ReadonlyArray<Behavior> | null = null;

    /** @internal */
    public abstract addStylesTo(target: StyleTarget): void;

    /** @internal */
    public abstract removeStylesFrom(target: StyleTarget): void;

    /**
     * Associates behaviors with this set of styles.
     * @param behaviors - The behaviors to associate.
     */
    public withBehaviors(...behaviors: Behavior[]): this {
        (this.behaviors as any) =
            this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);

        return this;
    }

    /**
     * Adds these styles to a global cache for easy lookup by a known key.
     * @param key - The key to use for lookup and retrieval in the cache.
     */
    public withKey(key: string): this {
        styleLookup.set(key, this);
        return this;
    }

    /**
     * Attempts to find cached styles by a known key.
     * @param key - The key to search the style cache for.
     */
    public static find(key: string): ElementStyles | null {
        return styleLookup.get(key) || null;
    }
}

type InjectableStyles = string | ElementStyles;
type ElementStyleFactory = (styles: ReadonlyArray<InjectableStyles>) => ElementStyles;

function reduceStyles(styles: ReadonlyArray<InjectableStyles>): string[] {
    return styles
        .map((x: InjectableStyles) =>
            x instanceof ElementStyles ? reduceStyles(x.styles) : [x]
        )
        .reduce((prev: string[], curr: string[]) => prev.concat(curr), []);
}

function reduceBehaviors(
    styles: ReadonlyArray<InjectableStyles>
): ReadonlyArray<Behavior> | null {
    return styles
        .map((x: InjectableStyles) => (x instanceof ElementStyles ? x.behaviors : null))
        .reduce((prev: Behavior[] | null, curr: Behavior[] | null) => {
            if (curr === null) {
                return prev;
            }

            if (prev === null) {
                prev = [];
            }

            return prev.concat(curr);
        }, null as Behavior[] | null);
}

/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
export class AdoptedStyleSheetsStyles extends ElementStyles {
    private readonly styleSheets: CSSStyleSheet[];
    public readonly behaviors: ReadonlyArray<Behavior> | null = null;

    public constructor(
        public styles: InjectableStyles[],
        styleSheetCache: Map<string, CSSStyleSheet>
    ) {
        super();
        this.behaviors = reduceBehaviors(styles);
        this.styleSheets = reduceStyles(styles).map((x: string) => {
            let sheet = styleSheetCache.get(x);

            if (sheet === void 0) {
                sheet = new CSSStyleSheet();
                (sheet as any).replaceSync(x);
                styleSheetCache.set(x, sheet);
            }

            return sheet;
        });
    }

    public addStylesTo(target: StyleTarget): void {
        target.adoptedStyleSheets = [...target.adoptedStyleSheets!, ...this.styleSheets];
    }

    public removeStylesFrom(target: StyleTarget): void {
        const sourceSheets = this.styleSheets;
        target.adoptedStyleSheets = target.adoptedStyleSheets!.filter(
            (x: CSSStyleSheet) => sourceSheets.indexOf(x) === -1
        );
    }
}

let styleClassId = 0;

function getNextStyleClass(): string {
    return `fast-style-class-${++styleClassId}`;
}

class StyleElementStyles extends ElementStyles {
    private readonly styleSheets: string[];
    private readonly styleClass: string;
    public readonly behaviors: ReadonlyArray<Behavior> | null = null;

    public constructor(public styles: InjectableStyles[]) {
        super();
        this.behaviors = reduceBehaviors(styles);
        this.styleSheets = reduceStyles(styles);
        this.styleClass = getNextStyleClass();
    }

    public addStylesTo(target: StyleTarget): void {
        const styleSheets = this.styleSheets;
        const styleClass = this.styleClass;

        for (let i = styleSheets.length - 1; i > -1; --i) {
            const element = document.createElement("style");
            element.innerHTML = styleSheets[i];
            element.className = styleClass;
            target.prepend(element);
        }
    }

    public removeStylesFrom(target: StyleTarget): void {
        const styles: NodeListOf<HTMLStyleElement> = target.querySelectorAll(
            `.${this.styleClass}`
        );

        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }
    }
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const createStyles: ElementStyleFactory = (() => {
    if ("adoptedStyleSheets" in window.ShadowRoot.prototype) {
        const styleSheetCache = new Map();
        return (styles: InjectableStyles[]) =>
            new AdoptedStyleSheetsStyles(styles, styleSheetCache);
    }

    return (styles: InjectableStyles[]) => new StyleElementStyles(styles);
})();
/* eslint-enable @typescript-eslint/explicit-function-return-type */

/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of strings and ElementStyle instances.
 * @public
 */
export function css(
    strings: TemplateStringsArray,
    ...values: InjectableStyles[]
): ElementStyles {
    const styles: InjectableStyles[] = [];
    let cssString = "";

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        const value = values[i];

        if (value instanceof ElementStyles) {
            if (cssString.trim() !== "") {
                styles.push(cssString);
                cssString = "";
            }

            styles.push(value);
        } else {
            cssString += value;
        }
    }

    cssString += strings[strings.length - 1];

    if (cssString.trim() !== "") {
        styles.push(cssString);
    }

    return createStyles(styles);
}
