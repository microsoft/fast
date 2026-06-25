import type { StyleStrategy, StyleTarget } from "./style-strategy.js";
import type { HostBehavior } from "./host.js";

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

let DefaultStyleStrategy: ConstructibleStyleStrategy;

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

    /**
     * The behaviors associated with this set of styles.
     */
    public readonly behaviors: ReadonlyArray<HostBehavior<HTMLElement>> | null;

    /**
     * Gets the StyleStrategy associated with these element styles.
     */
    public get strategy(): StyleStrategy {
        if (this._strategy === null) {
            this.withStrategy(DefaultStyleStrategy);
        }

        return this._strategy!;
    }

    /**
     * Creates an instance of ElementStyles.
     * @param styles - The styles that will be associated with elements.
     */
    public constructor(public readonly styles: ReadonlyArray<ComposableStyles>) {
        this.behaviors = styles
            .map((x: ComposableStyles) =>
                x instanceof ElementStyles ? x.behaviors : null
            )
            .reduce(
                (
                    prev: HostBehavior<HTMLElement>[] | null,
                    curr: HostBehavior<HTMLElement>[] | null
                ) => (curr === null ? prev : prev === null ? curr : prev.concat(curr)),
                null as HostBehavior<HTMLElement>[] | null
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
    public withBehaviors(...behaviors: HostBehavior<HTMLElement>[]): this {
        (this.behaviors as any) =
            this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);

        return this;
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
        styles: ComposableStyles | ComposableStyles[] | undefined
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
