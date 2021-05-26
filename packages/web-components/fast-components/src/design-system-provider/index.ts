import {
    attr,
    css,
    html,
    nullableNumberConverter,
    Observable,
    observable,
} from "@microsoft/fast-element";
import {
    DesignToken,
    DesignTokenValue,
    display,
    forcedColorsStylesheetBehavior,
    FoundationElement,
} from "@microsoft/fast-foundation";
import { Direction, SystemColors } from "@microsoft/fast-web-utilities";
import {} from "../color";
import { PaletteRGB } from "../color-vNext/palette";
import {
    accentFillActiveDelta,
    accentFillFocusDelta,
    accentFillHoverDelta,
    accentFillRestDelta,
    accentFillSelectedDelta,
    accentForegroundActiveDelta,
    accentForegroundFocusDelta,
    accentForegroundHoverDelta,
    accentForegroundRestDelta,
    accentPalette,
    baseHeightMultiplier,
    baseHorizontalSpacingMultiplier,
    baseLayerLuminance,
    cornerRadius,
    density,
    designUnit,
    direction,
    disabledOpacity,
    fillColor,
    focusOutlineWidth,
    neutralDividerRestDelta,
    neutralFillActiveDelta,
    neutralFillCardDelta,
    neutralFillFocusDelta,
    neutralFillHoverDelta,
    neutralFillInputActiveDelta,
    neutralFillInputFocusDelta,
    neutralFillInputHoverDelta,
    neutralFillInputRestDelta,
    neutralFillInputSelectedDelta,
    neutralFillRestDelta,
    neutralFillSelectedDelta,
    neutralFillStealthActiveDelta,
    neutralFillStealthFocusDelta,
    neutralFillStealthHoverDelta,
    neutralFillStealthRestDelta,
    neutralFillStealthSelectedDelta,
    neutralFillToggleActiveDelta,
    neutralFillToggleFocusDelta,
    neutralFillToggleHoverDelta,
    neutralForegroundActiveDelta,
    neutralForegroundFocusDelta,
    neutralForegroundHoverDelta,
    neutralForegroundRest,
    neutralOutlineActiveDelta,
    neutralOutlineFocusDelta,
    neutralOutlineHoverDelta,
    neutralOutlineRestDelta,
    neutralPalette,
    outlineWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
    typeRampMinus1FontSize,
    typeRampMinus1LineHeight,
    typeRampMinus2FontSize,
    typeRampMinus2LineHeight,
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
    typeRampPlus2FontSize,
    typeRampPlus2LineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
    typeRampPlus4FontSize,
    typeRampPlus4LineHeight,
    typeRampPlus5FontSize,
    typeRampPlus5LineHeight,
    typeRampPlus6FontSize,
    typeRampPlus6LineHeight,
} from "../design-tokens";

const backgroundStyles = css`
    :host {
        background-color: ${fillColor};
        color: ${neutralForegroundRest};
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host {
                background-color: ${SystemColors.ButtonFace};
                box-shadow: 0 0 0 1px ${SystemColors.CanvasText};
                color: ${SystemColors.ButtonText};
            }
        `
    )
);

function designToken<T>(token: DesignToken<T>) {
    return (source: DesignSystemProvider, key: string) => {
        source[key + "Changed"] = function (
            this: DesignSystemProvider,
            prev: T | undefined,
            next: T | undefined
        ) {
            if (next !== undefined && next !== null) {
                token.setValueFor(this, next as DesignTokenValue<T>);
            } else {
                token.deleteValueFor(this);
            }
        };
    };
}

/**
 * The FAST DesignSystemProvider Element.
 * @internal
 */
class DesignSystemProvider extends FoundationElement {
    constructor() {
        super();

        // If fillColor changes or is removed, we need to
        // re-evaluate whether we should have paint styles applied
        Observable.getNotifier(this).subscribe(
            {
                handleChange: this.noPaintChanged.bind(this),
            },
            "fillColor"
        );
    }
    /**
     * Used to instruct the FASTDesignSystemProvider
     * that it should not set the CSS
     * background-color and color properties
     *
     * @remarks
     * HTML boolean attribute: no-paint
     */
    @attr({ attribute: "no-paint", mode: "boolean" })
    public noPaint = false;
    private noPaintChanged() {
        if (!this.noPaint && this.fillColor !== void 0) {
            this.$fastController.addStyles(backgroundStyles);
        } else {
            this.$fastController.removeStyles(backgroundStyles);
        }
    }

    /**
     * Define design system property attributes
     * @remarks
     * HTML attribute: background-color
     *
     * CSS custom property: --background-color
     */
    @attr({
        attribute: "fill-color",
    })
    @designToken(fillColor)
    public fillColor: string;

    /**
     * Defines the palette that all neutral color recipes are derived from.
     * This is an array for hexadecimal color strings ordered from light to dark.
     *
     * @remarks
     * HTML attribute: N/A
     */
    @observable
    @designToken(neutralPalette)
    public neutralPalette: PaletteRGB;

    /**
     * Defines the palette that all accent color recipes are derived from.
     * This is an array for hexadecimal color strings ordered from light to dark.
     *
     * When setting this property, be sure to *also* set {@link FASTDesignSystemProvider.accentBaseColor|accentBaseColor} to
     * the base color deriving this palette.
     *
     * @remarks
     * HTML attribute: N/A
     */
    @observable
    @designToken(accentPalette)
    public accentPalette: PaletteRGB;

    /**
     *
     * The density offset, used with designUnit to calculate height and spacing.
     *
     * @remarks
     * HTML attribute: density
     *
     * CSS custom property: --density
     */
    @attr({
        converter: nullableNumberConverter,
    })
    @designToken(density)
    public density: number;

    /**
     * The grid-unit that UI dimensions are derived from in pixels.
     *
     * @remarks
     * HTML attribute: design-unit
     *
     * CSS custom property: --design-unit
     */
    @attr({
        attribute: "design-unit",
        converter: nullableNumberConverter,
    })
    @designToken(designUnit)
    public designUnit: number;

    /**
     * The primary document direction.
     *
     * @remarks
     * HTML attribute: direction
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "direction",
    })
    @designToken(direction)
    public direction: Direction;

    /**
     * The number of designUnits used for component height at the base density.
     *
     * @remarks
     * HTML attribute: base-height-multiplier
     *
     * CSS custom property: --base-height-multiplier
     */
    @attr({
        attribute: "base-height-multiplier",
        converter: nullableNumberConverter,
    })
    @designToken(baseHeightMultiplier)
    public baseHeightMultiplier: number;

    /**
     * The number of designUnits used for horizontal spacing at the base density.
     *
     * @remarks
     * HTML attribute: base-horizontal-spacing-multiplier
     *
     * CSS custom property: --base-horizontal-spacing-multiplier
     */
    @attr({
        attribute: "base-horizontal-spacing-multiplier",
        converter: nullableNumberConverter,
    })
    @designToken(baseHorizontalSpacingMultiplier)
    public baseHorizontalSpacingMultiplier: number;

    /**
     * The corner radius applied to controls.
     *
     * @remarks
     * HTML attribute: corner-radius
     *
     * CSS custom property: --corner-radius
     */
    @attr({
        attribute: "corner-radius",
        converter: nullableNumberConverter,
    })
    @designToken(cornerRadius)
    public cornerRadius: number;

    /**
     * The width of the standard outline applied to outline components in pixels.
     *
     * @remarks
     * HTML attribute: outline-width
     *
     * CSS custom property: --outline-width
     */
    @attr({
        attribute: "outline-width",
        converter: nullableNumberConverter,
    })
    @designToken(outlineWidth)
    public outlineWidth: number;

    /**
     * The width of the standard focus outline in pixels.
     *
     * @remarks
     * HTML attribute: focus-outline-width
     *
     * CSS custom property: --focus-outline-width
     */
    @attr({
        attribute: "focus-outline-width",
        converter: nullableNumberConverter,
    })
    @designToken(focusOutlineWidth)
    public focusOutlineWidth: number;

    /**
     * The opacity of a disabled control.
     *
     * @remarks
     * HTML attribute: disabled-opacity
     *
     * CSS custom property: --disabled-opacity
     */
    @attr({
        attribute: "disabled-opacity",
        converter: nullableNumberConverter,
    })
    @designToken(disabledOpacity)
    public disabledOpacity: number;

    /**
     * The font-size two steps below the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-minus-2-font-size
     *
     * CSS custom property: --type-ramp-minus-2-font-size
     */
    @attr({
        attribute: "type-ramp-minus-2-font-size",
    })
    @designToken(typeRampMinus2FontSize)
    public typeRampMinus2FontSize: string;

    /**
     * The line-height two steps below the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-minus-2-line-height
     *
     * CSS custom property: --type-ramp-minus-2-line-height
     */
    @attr({
        attribute: "type-ramp-minus-2-line-height",
    })
    @designToken(typeRampMinus2LineHeight)
    public typeRampMinus2LineHeight: string;

    /**
     * The font-size one step below the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-minus-1-font-size
     *
     * CSS custom property: --type-ramp-minus-1-font-size
     */
    @attr({
        attribute: "type-ramp-minus-1-font-size",
    })
    @designToken(typeRampMinus1FontSize)
    public typeRampMinus1FontSize: string;

    /**
     * The line-height one step below the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-minus-1-line-height
     *
     * CSS custom property: --type-ramp-minus-1-line-height
     */
    @attr({
        attribute: "type-ramp-minus-1-line-height",
    })
    @designToken(typeRampMinus1LineHeight)
    public typeRampMinus1LineHeight: string;

    /**
     * The base font-size of the relative type-ramp scale
     *
     * @remarks
     * HTML attribute: type-ramp-base-font-size
     *
     * CSS custom property: --type-ramp-base-font-size
     */
    @attr({
        attribute: "type-ramp-base-font-size",
    })
    @designToken(typeRampBaseFontSize)
    public typeRampBaseFontSize: string;

    /**
     * The base line-height of the relative type-ramp scale
     *
     * @remarks
     * HTML attribute: type-ramp-base-line-height
     *
     * CSS custom property: --type-ramp-base-line-height
     */
    @attr({
        attribute: "type-ramp-base-line-height",
    })
    @designToken(typeRampBaseLineHeight)
    public typeRampBaseLineHeight: string;

    /**
     * The font-size one step above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-1-font-size
     *
     * CSS custom property: --type-ramp-plus-1-font-size
     */
    @attr({
        attribute: "type-ramp-plus-1-font-size",
    })
    @designToken(typeRampPlus1FontSize)
    public typeRampPlus1FontSize: string;

    /**
     * The line-height one step above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-1-line-height
     *
     * CSS custom property: --type-ramp-plus-1-line-height
     */
    @attr({
        attribute: "type-ramp-plus-1-line-height",
    })
    @designToken(typeRampPlus1LineHeight)
    public typeRampPlus1LineHeight: string;

    /**
     * The font-size two steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-2-font-size
     *
     * CSS custom property: --type-ramp-plus-2-font-size
     */
    @attr({
        attribute: "type-ramp-plus-2-font-size",
    })
    @designToken(typeRampPlus2FontSize)
    public typeRampPlus2FontSize: string;

    /**
     * The line-height two steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-2-line-height
     *
     * CSS custom property: --type-ramp-plus-2-line-height
     */
    @attr({
        attribute: "type-ramp-plus-2-line-height",
    })
    @designToken(typeRampPlus2LineHeight)
    public typeRampPlus2LineHeight: string;

    /**
     * The font-size three steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-3-font-size
     *
     * CSS custom property: --type-ramp-plus-3-font-size
     */
    @attr({
        attribute: "type-ramp-plus-3-font-size",
    })
    @designToken(typeRampPlus3FontSize)
    public typeRampPlus3FontSize: string;

    /**
     * The line-height three steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-3-line-height
     *
     * CSS custom property: --type-ramp-plus-3-line-height
     */
    @attr({
        attribute: "type-ramp-plus-3-line-height",
    })
    @designToken(typeRampPlus3LineHeight)
    public typeRampPlus3LineHeight: string;

    /**
     * The font-size four steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-4-font-size
     *
     * CSS custom property: --type-ramp-plus-4-font-size
     */
    @attr({
        attribute: "type-ramp-plus-4-font-size",
    })
    @designToken(typeRampPlus4FontSize)
    public typeRampPlus4FontSize: string;

    /**
     * The line-height four steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-4-line-height
     *
     * CSS custom property: --type-ramp-plus-4-line-height
     */
    @attr({
        attribute: "type-ramp-plus-4-line-height",
    })
    @designToken(typeRampPlus4LineHeight)
    public typeRampPlus4LineHeight: string;

    /**
     * The font-size five steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-5-font-size
     *
     * CSS custom property: --type-ramp-plus-5-font-size
     */
    @attr({
        attribute: "type-ramp-plus-5-font-size",
    })
    @designToken(typeRampPlus5FontSize)
    public typeRampPlus5FontSize: string;

    /**
     * The line-height five steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-5-line-height
     *
     * CSS custom property: --type-ramp-plus-5-line-height
     */
    @attr({
        attribute: "type-ramp-plus-5-line-height",
    })
    @designToken(typeRampPlus5LineHeight)
    public typeRampPlus5LineHeight: string;

    /**
     * The font-size six steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-6-font-size
     *
     * CSS custom property: --type-ramp-plus-6-font-size
     */
    @attr({
        attribute: "type-ramp-plus-6-font-size",
    })
    @designToken(typeRampPlus6FontSize)
    public typeRampPlus6FontSize: string;

    /**
     * The line-height six steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-6-line-height
     *
     * CSS custom property: --type-ramp-plus-6-line-height
     */
    @attr({
        attribute: "type-ramp-plus-6-line-height",
    })
    @designToken(typeRampPlus6LineHeight)
    public typeRampPlus6LineHeight: string;

    /**
     * The distance from the resolved accent fill color for the rest state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-fill-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentFillRestDelta)
    public accentFillRestDelta: number;

    /**
     * The distance from the resolved accent fill color for the hover state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-fill-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentFillHoverDelta)
    public accentFillHoverDelta: number;

    /**
     * The distance from the resolved accent fill color for the active state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-fill-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentFillActiveDelta)
    public accentFillActiveDelta: number;

    /**
     * The distance from the resolved accent fill color for the focus state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-fill-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentFillFocusDelta)
    public accentFillFocusDelta: number;

    /**
     * The distance from the resolved accent fill color for the selected state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillSelectedBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-selected-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-fill-selected-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentFillSelectedDelta)
    public accentFillSelectedDelta: number;

    /**
     * The distance from the resolved accent foreground color for the rest state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-foreground-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentForegroundRestDelta)
    public accentForegroundRestDelta: number;

    /**
     * The distance from the resolved accent foreground color for the hover state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-foreground-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentForegroundHoverDelta)
    public accentForegroundHoverDelta: number;

    /**
     * The distance from the resolved accent foreground color for the active state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-foreground-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentForegroundActiveDelta)
    public accentForegroundActiveDelta: number;

    /**
     * The distance from the resolved accent foreground color for the focus state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "accent-foreground-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(accentForegroundFocusDelta)
    public accentForegroundFocusDelta: number;

    /**
     * The distance from the resolved neutral fill color for the rest state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillRestDelta)
    public neutralFillRestDelta: number;

    /**
     * The distance from the resolved neutral fill color for the hover state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillHoverDelta)
    public neutralFillHoverDelta: number;

    /**
     * The distance from the resolved neutral fill color for the active state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillActiveDelta)
    public neutralFillActiveDelta: number;

    /**
     * The distance from the resolved neutral fill color for the focus state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillFocusDelta)
    public neutralFillFocusDelta: number;

    /**
     * The distance from the resolved neutral fill color for the selected state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillSelectedBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-selected-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-selected-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillSelectedDelta)
    public neutralFillSelectedDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the rest state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-input-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillInputRestDelta)
    public neutralFillInputRestDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the hover state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-input-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillInputHoverDelta)
    public neutralFillInputHoverDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the active state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-input-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillInputActiveDelta)
    public neutralFillInputActiveDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the focus state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-input-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillInputFocusDelta)
    public neutralFillInputFocusDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the selected state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputSelectedBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-selected-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-input-selected-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillInputSelectedDelta)
    public neutralFillInputSelectedDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the rest state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-stealth-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillStealthRestDelta)
    public neutralFillStealthRestDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the hover state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-stealth-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillStealthHoverDelta)
    public neutralFillStealthHoverDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the active state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-stealth-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillStealthActiveDelta)
    public neutralFillStealthActiveDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the focus state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-stealth-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillStealthFocusDelta)
    public neutralFillStealthFocusDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the selected state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthSelectedBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-selected-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-stealth-selected-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillStealthSelectedDelta)
    public neutralFillStealthSelectedDelta: number;

    /**
     * The distance from the resolved neutral fill toggle color for the hover state of the neutral-fill-toggle recipe. See {@link @microsoft/fast-components#neutralFillToggleHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-toggle-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-toggle-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillToggleHoverDelta)
    public neutralFillToggleHoverDelta: number;

    /**
     * The distance from the resolved neutral fill toggle color for the active state of the neutral-fill-toggle recipe. See {@link @microsoft/fast-components#neutralFillToggleActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-toggle-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-toggle-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillToggleActiveDelta)
    public neutralFillToggleActiveDelta: number;

    /**
     * The distance from the resolved neutral fill toggle color for the focus state of the neutral-fill-toggle recipe. See {@link @microsoft/fast-components#neutralFillToggleFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-toggle-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-toggle-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillToggleFocusDelta)
    public neutralFillToggleFocusDelta: number;

    /**
     * The {@link https://www.w3.org/WAI/GL/wiki/Relative_luminance#:~:text=WCAG%20definition%20of%20relative%20luminance,and%201%20for%20lightest%20white|relative luminance} of the base layer of the application.
     *
     * @remarks
     * When set to a number between 0 and 1, this values controls the output of {@link @microsoft/fast-components#neutralLayerCardBehavior}, {@link @microsoft/fast-components#neutralLayerCardContainerBehavior}, {@link @microsoft/fast-components#neutralLayerFloatingBehavior}, {@link @microsoft/fast-components#neutralLayerL1AltBehavior}, {@link @microsoft/fast-components#neutralLayerL1Behavior}, {@link @microsoft/fast-components#neutralLayerL2Behavior}, {@link @microsoft/fast-components#neutralLayerL3Behavior}, {@link @microsoft/fast-components#neutralLayerL4Behavior}.
     *
     * HTML attribute: base-layer-luminance
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "base-layer-luminance",
        converter: nullableNumberConverter,
    })
    @designToken(baseLayerLuminance)
    public baseLayerLuminance: number; // 0...1

    /**
     * The distance from the background-color to resolve the card background. See {@link @microsoft/fast-components#neutralFillCardRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-card-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-card-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillCardDelta)
    public neutralFillCardDelta: number;

    /**
     * The distance from the resolved neutral foreground color for the hover state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralForegroundHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-foreground-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-foreground-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralForegroundHoverDelta)
    public neutralForegroundHoverDelta: number;

    /**
     * The distance from the resolved neutral foreground color for the active state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralForegroundActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-foreground-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-foreground-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralForegroundActiveDelta)
    public neutralForegroundActiveDelta: number;

    /**
     * The distance from the resolved neutral foreground color for the focus state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralForegroundFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-foreground-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-foreground-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralForegroundFocusDelta)
    public neutralForegroundFocusDelta: number;

    /**
     * The distance from the resolved neutral divider color for the rest state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralDividerRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-divider-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-divider-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralDividerRestDelta)
    public neutralDividerRestDelta: number;

    /**
     * The distance from the resolved neutral outline color for the rest state of the neutral-outline recipe. See {@link @microsoft/fast-components#neutralOutlineRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-outline-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-outline-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralOutlineRestDelta)
    public neutralOutlineRestDelta: number;

    /**
     * The distance from the resolved neutral outline color for the hover state of the neutral-outline recipe. See {@link @microsoft/fast-components#neutralOutlineHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-outline-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-outline-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralOutlineHoverDelta)
    public neutralOutlineHoverDelta: number;

    /**
     * The distance from the resolved neutral outline color for the active state of the neutral-outline recipe. See {@link @microsoft/fast-components#neutralOutlineActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-outline-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-outline-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralOutlineActiveDelta)
    public neutralOutlineActiveDelta: number;

    /**
     * The distance from the resolved neutral outline color for the focus state of the neutral-outline recipe. See {@link @microsoft/fast-components#neutralOutlineFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-outline-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-outline-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralOutlineFocusDelta)
    public neutralOutlineFocusDelta: number;
}

/**
 * The FAST Design System Provider Element.
 *
 * @public
 * @remarks
 * HTML Element: \<fast-design-system-provider\>
 */
export const fastDesignSystemProvider = DesignSystemProvider.compose({
    baseName: "design-system-provider",
    template: html`
        <slot></slot>
    `,
    styles: css`
        ${display("block")}
    `,
});
