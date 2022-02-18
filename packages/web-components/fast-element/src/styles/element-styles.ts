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

/**
 * Implemented to provide specific behavior when adding/removing styles
 * for elements.
 */
export interface StyleStrategy {
    /**
     * Adds styles to the target.
     * @param target The target to add the styles to.
     */
    addStylesTo(target: StyleTarget): void;

    /**
     * Removes styles from the target.
     * @param target The target to remove the styles from.
     */
    removeStylesFrom(target: StyleTarget): void;
}

/**
 * Creates a strategy capable of adding/removing styles for custom elements.
 * @public
 */
export type StyleStrategyFactory = (styles: (string | CSSStyleSheet)[]) => StyleStrategy;

let styleStrategyFactory: StyleStrategyFactory = (() => {
    if (DOM.supportsAdoptedStyleSheets) {
        const styleSheetCache = new Map();
        return (styles: (string | CSSStyleSheet)[]) =>
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            new AdoptedStyleSheetsStrategy(styles, styleSheetCache);
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return (styles: (string | CSSStyleSheet)[]) =>
        new StyleElementStrategy(styles as string[]);
})();

function reduceStyles(
    styles: ReadonlyArray<ComposableStyles>
): (string | CSSStyleSheet)[] {
    return styles
        .map((x: ComposableStyles) =>
            x instanceof ElementStyles ? reduceStyles(x.styles) : [x]
        )
        .reduce((prev: string[], curr: string[]) => prev.concat(curr), []);
}

/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
export class ElementStyles {
    private targets: WeakSet<StyleTarget> = new WeakSet();
    private _strategy: StyleStrategy | null = null;

    /** @internal */
    public readonly behaviors: ReadonlyArray<Behavior<HTMLElement>> | null;

    private get strategy(): StyleStrategy {
        if (this._strategy === null) {
            this._strategy = styleStrategyFactory(reduceStyles(this.styles));
        }

        return this._strategy;
    }

    constructor(
        /** @internal */
        public readonly styles: ReadonlyArray<ComposableStyles>
    ) {
        this.behaviors = styles
            .map((x: ComposableStyles) =>
                x instanceof ElementStyles ? x.behaviors : null
            )
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

    /** @internal */
    public addStylesTo(target: StyleTarget): void {
        this.strategy.addStylesTo(target);
        this.targets.add(target);
    }

    /** @internal */
    public removeStylesFrom(target: StyleTarget): void {
        this.strategy.removeStylesFrom(target);
        this.targets.delete(target);
    }

    /** @internal */
    public isAttachedTo(target: StyleTarget): boolean {
        return this.targets.has(target);
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

    /**
     * Sets the strategy that handles adding/removing these styles for an element.
     * @param strategy The strategy to use.
     */
    public withStrategy(strategy: StyleStrategy): this {
        this._strategy = strategy;
        return this;
    }

    /**
     * Sets the default factory used when creating style strategies.
     * @param factory The factory to use.
     */
    public static setStrategyFactory(factory: StyleStrategyFactory) {
        styleStrategyFactory = factory;
    }
}

/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
export class AdoptedStyleSheetsStrategy implements StyleStrategy {
    private sheets: CSSStyleSheet[];

    public constructor(
        styles: (string | CSSStyleSheet)[],
        styleSheetCache: Map<string, CSSStyleSheet>
    ) {
        this.sheets = styles.map((x: string | CSSStyleSheet) => {
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
        target.adoptedStyleSheets = [...target.adoptedStyleSheets!, ...this.sheets];
    }

    public removeStylesFrom(target: StyleTarget): void {
        const sheets = this.sheets;
        target.adoptedStyleSheets = target.adoptedStyleSheets!.filter(
            (x: CSSStyleSheet) => sheets.indexOf(x) === -1
        );
    }
}

function usableTarget(target: StyleTarget): StyleTarget {
    return target === document ? document.body : target;
}

/**
 * @internal
 */
export class StyleElementStrategy implements StyleStrategy {
    private readonly styleClass: string;

    public constructor(private styles: string[]) {
        this.styleClass = nextId();
    }

    public addStylesTo(target: StyleTarget): void {
        target = usableTarget(target);

        const styles = this.styles;
        const styleClass = this.styleClass;

        for (let i = 0; i < styles.length; i++) {
            const element = document.createElement("style");
            element.innerHTML = styles[i];
            element.className = styleClass;
            target.append(element);
        }
    }

    public removeStylesFrom(target: StyleTarget): void {
        const styles: NodeListOf<HTMLStyleElement> = target.querySelectorAll(
            `.${this.styleClass}`
        );

        target = usableTarget(target);

        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }
    }
}
