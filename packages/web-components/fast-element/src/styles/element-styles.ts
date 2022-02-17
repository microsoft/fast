import type { Behavior } from "../observation/behavior.js";
import { DOM, nextId } from "../dom.js";

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
     * Adds styles to the target by appending the styles.
     * @param styles - The styles element to add.
     */
    append(styles: HTMLStyleElement): void;

    /**
     * Adds styles to the target by prepending the styles.
     * @param styles - The styles element to add.
     * @deprecated - use append()
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

/**
 * Represents styles that can be composed into the ShadowDOM of a custom element.
 * @public
 */
export type ComposableStyles = string | ElementStyles | CSSStyleSheet;

export interface StyleStrategy {
    addStylesTo(target: StyleTarget): void;
    removeStylesFrom(target: StyleTarget): void;
    normalizeTarget(target: StyleTarget): StyleTarget;
}

/**
 * Creates a strategy capable of handling styles for custom elements.
 * @public
 */
export type StyleStrategyFactory = (
    styles: ReadonlyArray<ComposableStyles>
) => StyleStrategy;

let styleStrategyFactory: StyleStrategyFactory = (() => {
    if (DOM.supportsAdoptedStyleSheets) {
        const styleSheetCache = new Map();
        return (styles: ComposableStyles[]) =>
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            new AdoptedStyleSheetsStrategy(styles, styleSheetCache);
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return (styles: ComposableStyles[]) => new StyleElementStrategy(styles);
})();

/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
export class ElementStyles {
    private targets: WeakSet<StyleTarget> = new WeakSet();
    private _strategy: StyleStrategy | null = null;

    /** @internal */
    public readonly behaviors: ReadonlyArray<Behavior<HTMLElement>> | null;

    private get strategy() {
        if (this._strategy === null) {
            this._strategy = styleStrategyFactory(this.styles);
        }

        return this._strategy;
    }

    constructor(
        /** @internal */
        public readonly styles: ReadonlyArray<ComposableStyles>
    ) {
        this.behaviors = reduceBehaviors(styles);
    }

    /** @internal */
    public addStylesTo(target: StyleTarget): void {
        target = this.strategy.normalizeTarget(target);
        this.strategy.addStylesTo(target);
        this.targets.add(target);
    }

    /** @internal */
    public removeStylesFrom(target: StyleTarget): void {
        target = this.strategy.normalizeTarget(target);
        this.strategy.removeStylesFrom(target);
        this.targets.delete(target);
    }

    /** @internal */
    public isAttachedTo(target: StyleTarget): boolean {
        return this.targets.has(this.strategy.normalizeTarget(target));
    }

    /**
     * Associates behaviors with this set of styles.
     * @param behaviors - The behaviors to associate.
     */
    public withBehaviors(...behaviors: Behavior<HTMLElement>[]): this {
        (this.behaviors as any) =
            this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);

        return this;
    }

    public static setStrategyFactory(factory: StyleStrategyFactory) {
        styleStrategyFactory = factory;
    }
}

function reduceStyles(
    styles: ReadonlyArray<ComposableStyles>
): (string | CSSStyleSheet)[] {
    return styles
        .map((x: ComposableStyles) =>
            x instanceof ElementStyles ? reduceStyles(x.styles) : [x]
        )
        .reduce((prev: string[], curr: string[]) => prev.concat(curr), []);
}

function reduceBehaviors(
    styles: ReadonlyArray<ComposableStyles>
): ReadonlyArray<Behavior<HTMLElement>> | null {
    return styles
        .map((x: ComposableStyles) => (x instanceof ElementStyles ? x.behaviors : null))
        .reduce(
            (
                prev: Behavior<HTMLElement>[] | null,
                curr: Behavior<HTMLElement>[] | null
            ) => {
                if (curr === null) {
                    return prev;
                }

                if (prev === null) {
                    prev = [];
                }

                return prev.concat(curr);
            },
            null as Behavior<HTMLElement>[] | null
        );
}

/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
export class AdoptedStyleSheetsStrategy implements StyleStrategy {
    private styleSheets: CSSStyleSheet[];

    public constructor(
        styles: ComposableStyles[],
        styleSheetCache: Map<string, CSSStyleSheet>
    ) {
        this.styleSheets = reduceStyles(styles).map((x: string | CSSStyleSheet) => {
            if (x instanceof CSSStyleSheet) {
                return x;
            }

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
        const styleSheets = this.styleSheets;
        target.adoptedStyleSheets = target.adoptedStyleSheets!.filter(
            (x: CSSStyleSheet) => styleSheets.indexOf(x) === -1
        );
    }

    public normalizeTarget(target: StyleTarget): StyleTarget {
        return target;
    }
}

/**
 * @internal
 */
export class StyleElementStrategy implements StyleStrategy {
    private readonly styleSheets: string[];
    private readonly styleClass: string;

    public constructor(styles: ComposableStyles[]) {
        this.styleSheets = reduceStyles(styles) as string[];
        this.styleClass = nextId();
    }

    public addStylesTo(target: StyleTarget): void {
        const styleSheets = this.styleSheets;
        const styleClass = this.styleClass;

        for (let i = 0; i < styleSheets.length; i++) {
            const element = document.createElement("style");
            element.innerHTML = styleSheets[i];
            element.className = styleClass;
            target.append(element);
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

    public normalizeTarget(target: StyleTarget): StyleTarget {
        return target === document ? document.body : target;
    }
}
