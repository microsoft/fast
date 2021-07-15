import { ColorsDesignSystem } from "./design-system";
export declare type Swatch = string;
export declare type DesignSystemResolver<T, Y = ColorsDesignSystem> = (d: Y) => T;
export declare type SwatchResolver = DesignSystemResolver<Swatch>;
/**
 * A function type that resolves a Swatch from a SwatchResolver
 * and applies it to the backgroundColor property of the design system
 * of the returned DesignSystemResolver
 * @internal
 */
export declare type DesignSystemResolverFromSwatchResolver<T> = (
    resolver: SwatchResolver
) => DesignSystemResolver<T>;
/**
 * A function type that resolves a Swatch from a string literal
 * and applies it to the backgroundColor property of the design system
 * of the returned DesignSystemResolver
 */
export declare type DesignSystemResolverFromSwatch<T> = (
    colorLiteral: string
) => DesignSystemResolver<T>;
/**
 * The states that a swatch can have
 * @internal
 */
export declare enum SwatchFamilyType {
    rest = "rest",
    hover = "hover",
    active = "active",
    focus = "focus",
}
/**
 * A function that resolves a color when provided a design system
 * or resolves a ColorRecipe when provided a SwatchResolver
 */
export declare type ColorRecipe<T> = DesignSystemResolver<T> &
    DesignSystemResolverFromSwatchResolver<T> &
    DesignSystemResolverFromSwatch<T>;
export declare type SwatchRecipe = ColorRecipe<Swatch>;
export declare const accentFillRest: (d?: ColorsDesignSystem) => string;
export declare const accentFillHover: (d?: ColorsDesignSystem) => string;
export declare const accentFillActive: (d?: ColorsDesignSystem) => string;
export declare const accentFillFocus: (d?: ColorsDesignSystem) => string;
export declare const accentForegroundRest: (d?: ColorsDesignSystem) => string;
export declare const accentForegroundHover: (d?: ColorsDesignSystem) => string;
export declare const accentForegroundActive: (d?: ColorsDesignSystem) => string;
export declare const accentForegroundFocus: (d?: ColorsDesignSystem) => string;
export declare const foregroundOnAccent: (d?: ColorsDesignSystem) => string;
export declare const neutralStrokeDividerRest: (d?: ColorsDesignSystem) => string;
export declare const neutralFillRest: (d?: ColorsDesignSystem) => string;
export declare const neutralFillHover: (d?: ColorsDesignSystem) => string;
export declare const neutralFillActive: (d?: ColorsDesignSystem) => string;
export declare const neutralFillFocus: (d?: ColorsDesignSystem) => string;
export declare const neutralFillLayerRest: (d?: ColorsDesignSystem) => string;
export declare const neutralFillInputRest: (d?: ColorsDesignSystem) => string;
export declare const neutralFillInputHover: (d?: ColorsDesignSystem) => string;
export declare const neutralFillInputActive: (d?: ColorsDesignSystem) => string;
export declare const neutralFillInputFocus: (d?: ColorsDesignSystem) => string;
export declare const neutralFillStealthRest: (d?: ColorsDesignSystem) => string;
export declare const neutralFillStealthHover: (d?: ColorsDesignSystem) => string;
export declare const neutralFillStealthActive: (d?: ColorsDesignSystem) => string;
export declare const neutralFillStealthFocus: (d?: ColorsDesignSystem) => string;
export declare const neutralFillStrongRest: (d?: ColorsDesignSystem) => string;
export declare const neutralFillStrongHover: (d?: ColorsDesignSystem) => string;
export declare const neutralFillStrongActive: (d?: ColorsDesignSystem) => string;
export declare const neutralFillStrongFocus: (d?: ColorsDesignSystem) => string;
export declare const focusStrokeOuter: (d?: ColorsDesignSystem) => string;
export declare const focusStrokeInner: (d?: ColorsDesignSystem) => string;
export declare const neutralForegroundHint: (d?: ColorsDesignSystem) => string;
export declare const neutralForegroundRest: (d?: ColorsDesignSystem) => string;
export declare const neutralStrokeRest: (d?: ColorsDesignSystem) => string;
export declare const neutralStrokeHover: (d?: ColorsDesignSystem) => string;
export declare const neutralStrokeActive: (d?: ColorsDesignSystem) => string;
export declare const neutralStrokeFocus: (d?: ColorsDesignSystem) => string;
export declare const neutralLayerCardContainer: (d?: ColorsDesignSystem) => string;
export declare const neutralLayerFloating: (d?: ColorsDesignSystem) => string;
export declare const neutralLayer1: (d?: ColorsDesignSystem) => string;
export declare const neutralLayer2: (d?: ColorsDesignSystem) => string;
export declare const neutralLayer3: (d?: ColorsDesignSystem) => string;
export declare const neutralLayer4: (d?: ColorsDesignSystem) => string;
export declare function backgroundColor(d?: ColorsDesignSystem): string;
/**
 * Returns the contrast value between two color strings.
 * Supports #RRGGBB and rgb(r, g, b) formats.
 * @internal
 */
export declare function contrast(a: string, b: string): number;
