import { FoundationElement } from "@microsoft/fast-foundation";
import { Direction } from "@microsoft/fast-web-utilities";
import { Palette } from "../color/palette";
import { Swatch } from "../color/swatch";
/**
 * The FAST DesignSystemProvider Element.
 * @public
 */
export declare class DesignSystemProvider extends FoundationElement {
    constructor();
    /**
     * Used to instruct the FASTDesignSystemProvider
     * that it should not set the CSS
     * background-color and color properties
     *
     * @remarks
     * HTML boolean attribute: no-paint
     */
    noPaint: boolean;
    private noPaintChanged;
    /**
     * Define design system property attributes
     * @remarks
     * HTML attribute: background-color
     *
     * CSS custom property: --background-color
     */
    fillColor: Swatch;
    /**
     * Defines the palette that all neutral color recipes are derived from.
     * This is an array for hexadecimal color strings ordered from light to dark.
     *
     * @remarks
     * HTML attribute: N/A
     */
    neutralPalette: Palette;
    /**
     * Defines the palette that all accent color recipes are derived from.
     * This is an array for hexadecimal color strings ordered from light to dark.
     *
     * @remarks
     * HTML attribute: N/A
     */
    accentPalette: Palette;
    /**
     *
     * The density offset, used with designUnit to calculate height and spacing.
     *
     * @remarks
     * HTML attribute: density
     *
     * CSS custom property: --density
     */
    density: number;
    /**
     * The grid-unit that UI dimensions are derived from in pixels.
     *
     * @remarks
     * HTML attribute: design-unit
     *
     * CSS custom property: --design-unit
     */
    designUnit: number;
    /**
     * The primary document direction.
     *
     * @remarks
     * HTML attribute: direction
     *
     * CSS custom property: N/A
     */
    direction: Direction;
    /**
     * The number of designUnits used for component height at the base density.
     *
     * @remarks
     * HTML attribute: base-height-multiplier
     *
     * CSS custom property: --base-height-multiplier
     */
    baseHeightMultiplier: number;
    /**
     * The number of designUnits used for horizontal spacing at the base density.
     *
     * @remarks
     * HTML attribute: base-horizontal-spacing-multiplier
     *
     * CSS custom property: --base-horizontal-spacing-multiplier
     */
    baseHorizontalSpacingMultiplier: number;
    /**
     * The corner radius applied to controls.
     *
     * @remarks
     * HTML attribute: control-corner-radius
     *
     * CSS custom property: --control-corner-radius
     */
    controlCornerRadius: number;
    /**
     * The width of the standard stroke applied to stroke components in pixels.
     *
     * @remarks
     * HTML attribute: stroke-width
     *
     * CSS custom property: --stroke-width
     */
    strokeWidth: number;
    /**
     * The width of the standard focus stroke in pixels.
     *
     * @remarks
     * HTML attribute: focus-stroke-width
     *
     * CSS custom property: --focus-stroke-width
     */
    focusStrokeWidth: number;
    /**
     * The opacity of a disabled control.
     *
     * @remarks
     * HTML attribute: disabled-opacity
     *
     * CSS custom property: --disabled-opacity
     */
    disabledOpacity: number;
    /**
     * The font-size two steps below the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-minus-2-font-size
     *
     * CSS custom property: --type-ramp-minus-2-font-size
     */
    typeRampMinus2FontSize: string;
    /**
     * The line-height two steps below the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-minus-2-line-height
     *
     * CSS custom property: --type-ramp-minus-2-line-height
     */
    typeRampMinus2LineHeight: string;
    /**
     * The font-size one step below the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-minus-1-font-size
     *
     * CSS custom property: --type-ramp-minus-1-font-size
     */
    typeRampMinus1FontSize: string;
    /**
     * The line-height one step below the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-minus-1-line-height
     *
     * CSS custom property: --type-ramp-minus-1-line-height
     */
    typeRampMinus1LineHeight: string;
    /**
     * The base font-size of the relative type-ramp scale
     *
     * @remarks
     * HTML attribute: type-ramp-base-font-size
     *
     * CSS custom property: --type-ramp-base-font-size
     */
    typeRampBaseFontSize: string;
    /**
     * The base line-height of the relative type-ramp scale
     *
     * @remarks
     * HTML attribute: type-ramp-base-line-height
     *
     * CSS custom property: --type-ramp-base-line-height
     */
    typeRampBaseLineHeight: string;
    /**
     * The font-size one step above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-1-font-size
     *
     * CSS custom property: --type-ramp-plus-1-font-size
     */
    typeRampPlus1FontSize: string;
    /**
     * The line-height one step above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-1-line-height
     *
     * CSS custom property: --type-ramp-plus-1-line-height
     */
    typeRampPlus1LineHeight: string;
    /**
     * The font-size two steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-2-font-size
     *
     * CSS custom property: --type-ramp-plus-2-font-size
     */
    typeRampPlus2FontSize: string;
    /**
     * The line-height two steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-2-line-height
     *
     * CSS custom property: --type-ramp-plus-2-line-height
     */
    typeRampPlus2LineHeight: string;
    /**
     * The font-size three steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-3-font-size
     *
     * CSS custom property: --type-ramp-plus-3-font-size
     */
    typeRampPlus3FontSize: string;
    /**
     * The line-height three steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-3-line-height
     *
     * CSS custom property: --type-ramp-plus-3-line-height
     */
    typeRampPlus3LineHeight: string;
    /**
     * The font-size four steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-4-font-size
     *
     * CSS custom property: --type-ramp-plus-4-font-size
     */
    typeRampPlus4FontSize: string;
    /**
     * The line-height four steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-4-line-height
     *
     * CSS custom property: --type-ramp-plus-4-line-height
     */
    typeRampPlus4LineHeight: string;
    /**
     * The font-size five steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-5-font-size
     *
     * CSS custom property: --type-ramp-plus-5-font-size
     */
    typeRampPlus5FontSize: string;
    /**
     * The line-height five steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-5-line-height
     *
     * CSS custom property: --type-ramp-plus-5-line-height
     */
    typeRampPlus5LineHeight: string;
    /**
     * The font-size six steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-6-font-size
     *
     * CSS custom property: --type-ramp-plus-6-font-size
     */
    typeRampPlus6FontSize: string;
    /**
     * The line-height six steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-6-line-height
     *
     * CSS custom property: --type-ramp-plus-6-line-height
     */
    typeRampPlus6LineHeight: string;
    /**
     * The distance from the resolved accent fill color for the rest state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-rest-delta
     *
     * CSS custom property: N/A
     */
    accentFillRestDelta: number;
    /**
     * The distance from the resolved accent fill color for the hover state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-hover-delta
     *
     * CSS custom property: N/A
     */
    accentFillHoverDelta: number;
    /**
     * The distance from the resolved accent fill color for the active state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-active-delta
     *
     * CSS custom property: N/A
     */
    accentFillActiveDelta: number;
    /**
     * The distance from the resolved accent fill color for the focus state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-focus-delta
     *
     * CSS custom property: N/A
     */
    accentFillFocusDelta: number;
    /**
     * The distance from the resolved accent foreground color for the rest state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-rest-delta
     *
     * CSS custom property: N/A
     */
    accentForegroundRestDelta: number;
    /**
     * The distance from the resolved accent foreground color for the hover state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-hover-delta
     *
     * CSS custom property: N/A
     */
    accentForegroundHoverDelta: number;
    /**
     * The distance from the resolved accent foreground color for the active state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-active-delta
     *
     * CSS custom property: N/A
     */
    accentForegroundActiveDelta: number;
    /**
     * The distance from the resolved accent foreground color for the focus state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-focus-delta
     *
     * CSS custom property: N/A
     */
    accentForegroundFocusDelta: number;
    /**
     * The distance from the resolved neutral fill color for the rest state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-rest-delta
     *
     * CSS custom property: N/A
     */
    neutralFillRestDelta: number;
    /**
     * The distance from the resolved neutral fill color for the hover state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-hover-delta
     *
     * CSS custom property: N/A
     */
    neutralFillHoverDelta: number;
    /**
     * The distance from the resolved neutral fill color for the active state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-active-delta
     *
     * CSS custom property: N/A
     */
    neutralFillActiveDelta: number;
    /**
     * The distance from the resolved neutral fill color for the focus state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-focus-delta
     *
     * CSS custom property: N/A
     */
    neutralFillFocusDelta: number;
    /**
     * The distance from the resolved neutral fill input color for the rest state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-rest-delta
     *
     * CSS custom property: N/A
     */
    neutralFillInputRestDelta: number;
    /**
     * The distance from the resolved neutral fill input color for the hover state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-hover-delta
     *
     * CSS custom property: N/A
     */
    neutralFillInputHoverDelta: number;
    /**
     * The distance from the resolved neutral fill input color for the active state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-active-delta
     *
     * CSS custom property: N/A
     */
    neutralFillInputActiveDelta: number;
    /**
     * The distance from the resolved neutral fill input color for the focus state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-focus-delta
     *
     * CSS custom property: N/A
     */
    neutralFillInputFocusDelta: number;
    /**
     * The distance from the resolved neutral fill stealth color for the rest state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-rest-delta
     *
     * CSS custom property: N/A
     */
    neutralFillStealthRestDelta: number;
    /**
     * The distance from the resolved neutral fill stealth color for the hover state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-hover-delta
     *
     * CSS custom property: N/A
     */
    neutralFillStealthHoverDelta: number;
    /**
     * The distance from the resolved neutral fill stealth color for the active state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-active-delta
     *
     * CSS custom property: N/A
     */
    neutralFillStealthActiveDelta: number;
    /**
     * The distance from the resolved neutral fill stealth color for the focus state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-focus-delta
     *
     * CSS custom property: N/A
     */
    neutralFillStealthFocusDelta: number;
    /**
     * The distance from the resolved neutral fill strong color for the hover state of the neutral-fill-strong recipe. See {@link @microsoft/fast-components#neutralFillStrongHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-strong-hover-delta
     *
     * CSS custom property: N/A
     */
    neutralFillStrongHoverDelta: number;
    /**
     * The distance from the resolved neutral fill strong color for the active state of the neutral-fill-strong recipe. See {@link @microsoft/fast-components#neutralFillStrongActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-strong-active-delta
     *
     * CSS custom property: N/A
     */
    neutralFillStrongActiveDelta: number;
    /**
     * The distance from the resolved neutral fill strong color for the focus state of the neutral-fill-strong recipe. See {@link @microsoft/fast-components#neutralFillStrongFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-strong-focus-delta
     *
     * CSS custom property: N/A
     */
    neutralFillStrongFocusDelta: number;
    /**
     * The {@link https://www.w3.org/WAI/GL/wiki/Relative_luminance#:~:text=WCAG%20definition%20of%20relative%20luminance,and%201%20for%20lightest%20white|relative luminance} of the base layer of the application.
     *
     * @remarks
     * When set to a number between 0 and 1, this values controls the output of {@link @microsoft/fast-components#neutralFillLayerRest}, {@link @microsoft/fast-components#neutralLayerCardContainer}, {@link @microsoft/fast-components#neutralLayerFloating}, {@link @microsoft/fast-components#neutralLayer1}, {@link @microsoft/fast-components#neutralLayer2}, {@link @microsoft/fast-components#neutralLayer3}, {@link @microsoft/fast-components#neutralLayer4}.
     *
     * HTML attribute: base-layer-luminance
     *
     * CSS custom property: N/A
     */
    baseLayerLuminance: number;
    /**
     * The distance from the background-color to resolve the card background. See {@link @microsoft/fast-components#neutralFillLayerRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-layer-rest-delta
     *
     * CSS custom property: N/A
     */
    neutralFillLayerRestDelta: number;
    /**
     * The distance from the resolved neutral divider color for the rest state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralStrokeDividerRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-divider-rest-delta
     *
     * CSS custom property: N/A
     */
    neutralStrokeDividerRestDelta: number;
    /**
     * The distance from the resolved neutral stroke color for the rest state of the neutral-stroke recipe. See {@link @microsoft/fast-components#neutralStrokeRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-rest-delta
     *
     * CSS custom property: N/A
     */
    neutralStrokeRestDelta: number;
    /**
     * The distance from the resolved neutral stroke color for the hover state of the neutral-stroke recipe. See {@link @microsoft/fast-components#neutralStrokeHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-hover-delta
     *
     * CSS custom property: N/A
     */
    neutralStrokeHoverDelta: number;
    /**
     * The distance from the resolved neutral stroke color for the active state of the neutral-stroke recipe. See {@link @microsoft/fast-components#neutralStrokeActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-active-delta
     *
     * CSS custom property: N/A
     */
    neutralStrokeActiveDelta: number;
    /**
     * The distance from the resolved neutral stroke color for the focus state of the neutral-stroke recipe. See {@link @microsoft/fast-components#neutralStrokeFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-focus-delta
     *
     * CSS custom property: N/A
     */
    neutralStrokeFocusDelta: number;
}
/**
A function that returns a {@link @microsoft/fast-foundation#DesignSystemProvider} registration for configuring the component with a DesignSystem. *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-design-system-provider\>
 */
export declare const fastDesignSystemProvider: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<{
        baseName: string;
        template: import("@microsoft/fast-element").ViewTemplate<any, any>;
        styles: import("@microsoft/fast-element").ElementStyles;
    }>
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    {
        baseName: string;
        template: import("@microsoft/fast-element").ViewTemplate<any, any>;
        styles: import("@microsoft/fast-element").ElementStyles;
    },
    typeof DesignSystemProvider
>;
