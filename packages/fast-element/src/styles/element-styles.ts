import type { StyleStrategy, StyleTarget } from "./style-strategy.js";

/**
 * Represents styles that can be composed into the ShadowDOM of a custom element.
 * @public
 */
export type ComposableStyles = string | ElementStyles | CSSStyleSheet;

/**
 * A type that instantiates a StyleStrategy.
 * @public
 */
export type ConstructibleStyleStrategy = {
    /**
     * Creates an instance of the strategy.
     * @param styles - The styles to initialize the strategy with.
     */
    new (styles: (string | CSSStyleSheet)[]): StyleStrategy;
};

let DefaultStyleStrategy: ConstructibleStyleStrategy | undefined;

function reduceStyles(
    styles: ReadonlyArray<ComposableStyles>,
): (string | CSSStyleSheet)[] {
    return styles.reduce<(string | CSSStyleSheet)[]>((reduced, current) => {
        if (current instanceof ElementStyles) {
            reduced.push(...reduceStyles(current.styles));
        } else {
            reduced.push(current);
        }

        return reduced;
    }, []);
}

/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
export class ElementStyles {
    private targets: WeakSet<StyleTarget> = new WeakSet();
    private _strategy: StyleStrategy | null = null;

    /**
     * Gets the StyleStrategy associated with these element styles.
     */
    public get strategy(): StyleStrategy {
        if (this._strategy === null) {
            if (!DefaultStyleStrategy) {
                ElementStyles.setDefaultStrategy(
                    ElementStyles.supportsAdoptedStyleSheets
                        ? createAdoptedSheetsStrategy()
                        : createStyleElementStrategy(),
                );
            }
            this.withStrategy(DefaultStyleStrategy!);
        }

        return this._strategy!;
    }

    /**
     * Creates an instance of ElementStyles.
     * @param styles - The styles that will be associated with elements.
     */
    public constructor(public readonly styles: ReadonlyArray<ComposableStyles>) {}

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
     * Sets the strategy that handles adding/removing these styles for an element.
     * @param strategy - The strategy to use.
     */
    public withStrategy(Strategy: ConstructibleStyleStrategy): this {
        this._strategy = new Strategy(reduceStyles(this.styles));
        return this;
    }

    /**
     * Sets the default strategy type to use when creating style strategies.
     * @param Strategy - The strategy type to construct.
     */
    public static setDefaultStrategy(Strategy: ConstructibleStyleStrategy): void {
        DefaultStyleStrategy = Strategy;
    }

    /**
     * Normalizes a set of composable style options.
     * @param styles - The style options to normalize.
     * @returns A singular ElementStyles instance or undefined.
     */
    public static normalize(
        styles: ComposableStyles | ComposableStyles[] | undefined,
    ): ElementStyles | undefined {
        return styles === void 0
            ? void 0
            : Array.isArray(styles)
              ? new ElementStyles(styles)
              : styles instanceof ElementStyles
                ? styles
                : new ElementStyles([styles]);
    }

    /**
     * Indicates whether the DOM supports the adoptedStyleSheets feature.
     */
    public static readonly supportsAdoptedStyleSheets =
        Array.isArray((document as any).adoptedStyleSheets) &&
        "replace" in CSSStyleSheet.prototype;
}

// Fallback strategy factories used when no strategy has been explicitly set
// via ElementStyles.setDefaultStrategy (e.g. when importing only from the
// styles.js subpath without loading element-controller.ts).

function createAdoptedSheetsStrategy(): ConstructibleStyleStrategy {
    const cache = new Map<string, CSSStyleSheet>();

    return class FallbackAdoptedSheetsStrategy implements StyleStrategy {
        private readonly sheets: CSSStyleSheet[];

        constructor(styles: (string | CSSStyleSheet)[]) {
            this.sheets = styles.map(x => {
                if (x instanceof CSSStyleSheet) {
                    return x;
                }

                let sheet = cache.get(x);

                if (sheet === void 0) {
                    sheet = new CSSStyleSheet();
                    (sheet as any).replaceSync(x);
                    cache.set(x, sheet);
                }

                return sheet;
            });
        }

        addStylesTo(target: StyleTarget): void {
            const t = target as Required<StyleTarget>;
            t.adoptedStyleSheets = [...t.adoptedStyleSheets!, ...this.sheets];
        }

        removeStylesFrom(target: StyleTarget): void {
            const t = target as Required<StyleTarget>;
            t.adoptedStyleSheets = t.adoptedStyleSheets!.filter(
                (x: CSSStyleSheet) => this.sheets.indexOf(x) === -1,
            );
        }
    };
}

let fallbackStyleId = 0;

function createStyleElementStrategy(): ConstructibleStyleStrategy {
    return class FallbackStyleElementStrategy implements StyleStrategy {
        private readonly styleClass: string;

        constructor(private readonly styles: string[]) {
            this.styleClass = `fast-${++fallbackStyleId}`;
        }

        addStylesTo(target: StyleTarget): void {
            const t = target === (document as any) ? document.body : target;

            for (let i = 0; i < this.styles.length; i++) {
                const element = document.createElement("style");
                element.innerHTML = this.styles[i];
                element.className = this.styleClass;
                (t as any).append(element);
            }
        }

        removeStylesFrom(target: StyleTarget): void {
            const t = target === (document as any) ? document.body : target;
            const styles: NodeListOf<HTMLStyleElement> = (t as any).querySelectorAll(
                `.${this.styleClass}`,
            );

            for (let i = 0, ii = styles.length; i < ii; ++i) {
                (t as any).removeChild(styles[i]);
            }
        }
    };
}
