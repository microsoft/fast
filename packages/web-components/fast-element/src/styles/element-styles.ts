import type { Behavior } from "../observation/behavior";
import { DOM } from "../dom";

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

/**
 * Creates an ElementStyles instance for an array of ComposableStyles.
 * @public
 */
export type ElementStyleFactory = (
    styles: ReadonlyArray<ComposableStyles>
) => ElementStyles;

/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
export abstract class ElementStyles {
    private targets: WeakSet<StyleTarget> = new WeakSet();

    /** @internal */
    public abstract readonly styles: ReadonlyArray<ComposableStyles>;

    /** @internal */
    public abstract readonly behaviors: ReadonlyArray<Behavior> | null = null;

    /** @internal */
    public addStylesTo(target: StyleTarget): void {
        this.targets.add(target);
    }

    /** @internal */
    public removeStylesFrom(target: StyleTarget): void {
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
    public withBehaviors(...behaviors: Behavior[]): this {
        (this.behaviors as any) =
            this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);

        return this;
    }

    /**
     * Create ElementStyles from ComposableStyles.
     */
    public static readonly create: ElementStyleFactory = (() => {
        if (DOM.supportsAdoptedStyleSheets) {
            const styleSheetCache = new Map();
            return (styles: ComposableStyles[]) =>
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                new AdoptedStyleSheetsStyles(styles, styleSheetCache);
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return (styles: ComposableStyles[]) => new StyleElementStyles(styles);
    })();
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
): ReadonlyArray<Behavior> | null {
    return styles
        .map((x: ComposableStyles) => (x instanceof ElementStyles ? x.behaviors : null))
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
    private _styleSheets: CSSStyleSheet[] | undefined = void 0;

    private get styleSheets(): CSSStyleSheet[] {
        if (this._styleSheets === void 0) {
            const styles = this.styles;
            const styleSheetCache = this.styleSheetCache;
            this._styleSheets = reduceStyles(styles).map((x: string | CSSStyleSheet) => {
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

        return this._styleSheets;
    }

    public readonly behaviors: ReadonlyArray<Behavior> | null;

    public constructor(
        public styles: ComposableStyles[],
        private styleSheetCache: Map<string, CSSStyleSheet>
    ) {
        super();
        this.behaviors = reduceBehaviors(styles);
    }

    public addStylesTo(target: StyleTarget): void {
        target.adoptedStyleSheets = [...target.adoptedStyleSheets!, ...this.styleSheets];
        super.addStylesTo(target);
    }

    public removeStylesFrom(target: StyleTarget): void {
        const sourceSheets = this.styleSheets;
        target.adoptedStyleSheets = target.adoptedStyleSheets!.filter(
            (x: CSSStyleSheet) => sourceSheets.indexOf(x) === -1
        );
        super.removeStylesFrom(target);
    }
}

let styleClassId = 0;

function getNextStyleClass(): string {
    return `fast-style-class-${++styleClassId}`;
}

/**
 * @internal
 */
export class StyleElementStyles extends ElementStyles {
    private readonly styleSheets: string[];
    private readonly styleClass: string;
    public readonly behaviors: ReadonlyArray<Behavior> | null = null;

    public constructor(public styles: ComposableStyles[]) {
        super();
        this.behaviors = reduceBehaviors(styles);
        this.styleSheets = reduceStyles(styles) as string[];
        this.styleClass = getNextStyleClass();
    }

    public addStylesTo(target: StyleTarget): void {
        const styleSheets = this.styleSheets;
        const styleClass = this.styleClass;

        target = this.normalizeTarget(target);

        for (let i = 0; i < styleSheets.length; i++) {
            const element = document.createElement("style");
            element.innerHTML = styleSheets[i];
            element.className = styleClass;
            target.append(element);
        }

        super.addStylesTo(target);
    }

    public removeStylesFrom(target: StyleTarget): void {
        target = this.normalizeTarget(target);

        const styles: NodeListOf<HTMLStyleElement> = target.querySelectorAll(
            `.${this.styleClass}`
        );

        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }

        super.removeStylesFrom(target);
    }

    public isAttachedTo(target: StyleTarget): boolean {
        return super.isAttachedTo(this.normalizeTarget(target));
    }

    private normalizeTarget(target: StyleTarget): StyleTarget {
        return target === document ? document.body : target;
    }
}
