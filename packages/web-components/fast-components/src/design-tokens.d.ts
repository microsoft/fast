import { Direction } from "@microsoft/fast-web-utilities";
import { Palette } from "./color/palette";
import { Swatch } from "./color/swatch";
import { InteractiveSwatchSet } from "./color/recipe";
/** @public */
export interface Recipe<T> {
    evaluate(element: HTMLElement, reference?: Swatch): T;
}
/** @public */
export declare type ColorRecipe = Recipe<Swatch>;
/** @public */
export declare type InteractiveColorRecipe = Recipe<InteractiveSwatchSet>;
/** @public */
export declare const bodyFont: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const baseHeightMultiplier: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const baseHorizontalSpacingMultiplier: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const baseLayerLuminance: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const controlCornerRadius: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const density: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const designUnit: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const direction: import("@microsoft/fast-foundation").CSSDesignToken<Direction>;
/** @public */
export declare const disabledOpacity: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const strokeWidth: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const focusStrokeWidth: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const typeRampBaseFontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampBaseLineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampMinus1FontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampMinus1LineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampMinus2FontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampMinus2LineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus1FontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus1LineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus2FontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus2LineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus3FontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus3LineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus4FontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus4LineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus5FontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus5LineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus6FontSize: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const typeRampPlus6LineHeight: import("@microsoft/fast-foundation").CSSDesignToken<string>;
/** @public */
export declare const accentFillRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const accentFillHoverDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const accentFillActiveDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const accentFillFocusDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const accentForegroundRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const accentForegroundHoverDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const accentForegroundActiveDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const accentForegroundFocusDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillHoverDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillActiveDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillFocusDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillInputRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillInputHoverDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillInputActiveDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillInputFocusDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillStealthRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillStealthHoverDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillStealthActiveDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillStealthFocusDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillStrongRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillStrongHoverDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillStrongActiveDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillStrongFocusDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralFillLayerRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralStrokeRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralStrokeHoverDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralStrokeActiveDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralStrokeFocusDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralStrokeDividerRestDelta: import("@microsoft/fast-foundation").CSSDesignToken<number>;
/** @public */
export declare const neutralPalette: import("@microsoft/fast-foundation").CSSDesignToken<Palette<
    Swatch
>>;
/** @public */
export declare const accentPalette: import("@microsoft/fast-foundation").CSSDesignToken<Palette<
    Swatch
>>;
/** @public */
export declare const fillColor: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const accentFillRecipe: import("@microsoft/fast-foundation").CSSDesignToken<InteractiveColorRecipe>;
/** @public */
export declare const accentFillRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const accentFillHover: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const accentFillActive: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const accentFillFocus: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const foregroundOnAccentRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const foregroundOnAccentRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const foregroundOnAccentHover: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const foregroundOnAccentActive: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const foregroundOnAccentFocus: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const foregroundOnAccentLargeRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const foregroundOnAccentRestLarge: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const foregroundOnAccentHoverLarge: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const foregroundOnAccentActiveLarge: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const foregroundOnAccentFocusLarge: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const accentForegroundRecipe: import("@microsoft/fast-foundation").CSSDesignToken<InteractiveColorRecipe>;
/** @public */
export declare const accentForegroundRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const accentForegroundHover: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const accentForegroundActive: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const accentForegroundFocus: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillRecipe: import("@microsoft/fast-foundation").CSSDesignToken<InteractiveColorRecipe>;
/** @public */
export declare const neutralFillRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillHover: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillActive: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillFocus: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillInputRecipe: import("@microsoft/fast-foundation").CSSDesignToken<InteractiveColorRecipe>;
/** @public */
export declare const neutralFillInputRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillInputHover: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillInputActive: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillInputFocus: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillStealthRecipe: import("@microsoft/fast-foundation").CSSDesignToken<InteractiveColorRecipe>;
/** @public */
export declare const neutralFillStealthRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillStealthHover: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillStealthActive: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillStealthFocus: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillStrongRecipe: import("@microsoft/fast-foundation").CSSDesignToken<InteractiveColorRecipe>;
/** @public */
export declare const neutralFillStrongRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillStrongHover: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillStrongActive: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillStrongFocus: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralFillLayerRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralFillLayerRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const focusStrokeOuterRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const focusStrokeOuter: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const focusStrokeInnerRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const focusStrokeInner: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralForegroundHintRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralForegroundHint: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralForegroundRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralForegroundRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralStrokeRecipe: import("@microsoft/fast-foundation").CSSDesignToken<InteractiveColorRecipe>;
/** @public */
export declare const neutralStrokeRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralStrokeHover: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralStrokeActive: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralStrokeFocus: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralStrokeDividerRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralStrokeDividerRest: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralLayerCardContainerRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralLayerCardContainer: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralLayerFloatingRecipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralLayerFloating: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralLayer1Recipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralLayer1: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralLayer2Recipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralLayer2: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralLayer3Recipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralLayer3: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
/** @public */
export declare const neutralLayer4Recipe: import("@microsoft/fast-foundation").CSSDesignToken<ColorRecipe>;
/** @public */
export declare const neutralLayer4: import("@microsoft/fast-foundation").CSSDesignToken<Swatch>;
