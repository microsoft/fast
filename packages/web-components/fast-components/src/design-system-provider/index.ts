import { attr, css, nullableNumberConverter } from "@microsoft/fast-element";
import {
    CSSCustomPropertyBehavior,
    designSystemProperty,
    DesignSystemProvider,
    designSystemProvider,
    forcedColorsStylesheetBehavior,
    DesignSystemProviderTemplate as template,
} from "@microsoft/fast-foundation";
import { Direction, SystemColors } from "@microsoft/fast-web-utilities";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import { neutralForegroundRest } from "../color";
import { DesignSystemProviderStyles as styles } from "./design-system-provider.styles";

const color = new CSSCustomPropertyBehavior(
    "neutral-foreground-rest",
    neutralForegroundRest,
    (el: FASTDesignSystemProvider) => el
);

const backgroundStyles = css`
    :host {
        background-color: var(--background-color);
        color: ${color.var};
    }
`.withBehaviors(
    color,
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

/**
 * The FAST DesignSystemProvider Element. Implements {@link @microsoft/fast-foundation#DesignSystemProvider},
 * {@link @microsoft/fast-foundation#DesignSystemProviderTemplate} and {@link @microsoft/fast-components#FASTDesignSystem}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-design-system-provider\>
 */
@designSystemProvider({
    name: "fast-design-system-provider",
    template,
    styles,
})
export class FASTDesignSystemProvider extends DesignSystemProvider
    implements FASTDesignSystem {
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
        if (!this.noPaint && this.backgroundColor !== void 0) {
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
    @designSystemProperty({
        attribute: "background-color",
        default: fastDesignSystemDefaults.backgroundColor,
    })
    public backgroundColor: string;
    private backgroundColorChanged() {
        // If background changes or is removed, we need to
        // re-evaluate whether we should have paint styles applied
        this.noPaintChanged();
    }

    /**
     * This color is intended to be the *source color* of the {@link FASTDesignSystemProvider.accentPalette|accentPalette}.
     * When setting this value, you should be sure to *also* update the {@link FASTDesignSystemProvider.accentPalette|accentPalette}.
     *
     * @remarks
     * HTML attribute: accent-base-color
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-base-color",
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentBaseColor,
    })
    public accentBaseColor: string;

    /**
     * Defines the palette that all neutral color recipes are derived from.
     * This is an array for hexadecimal color strings ordered from light to dark.
     *
     * @remarks
     * HTML attribute: N/A
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: false,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralPalette,
    })
    public neutralPalette: string[];

    /**
     * Defines the palette that all accent color recipes are derived from.
     * This is an array for hexadecimal color strings ordered from light to dark.
     *
     * When setting this property, be sure to *also* set {@link FASTDesignSystemProvider.accentBaseColor|accentBaseColor} to
     * the base color deriving this palette.
     *
     * @remarks
     * HTML attribute: N/A
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: false,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentPalette,
    })
    public accentPalette: string[];

    /**
     *
     * The density offset, used with designUnit to calculate height and spacing.
     *
     * @remarks
     * HTML attribute: density
     *
     * CSS custom property: --density
     */
    @designSystemProperty({
        default: fastDesignSystemDefaults.density,
        converter: nullableNumberConverter,
    })
    public density: number;

    /**
     * The grid-unit that UI dimensions are derived from in pixels.
     *
     * @remarks
     * HTML attribute: design-unit
     *
     * CSS custom property: --design-unit
     */
    @designSystemProperty({
        attribute: "design-unit",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.designUnit,
    })
    public designUnit: number;

    /**
     * The primary document direction.
     *
     * @remarks
     * HTML attribute: direction
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "direction",
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.direction,
    })
    public direction: Direction;

    /**
     * The number of designUnits used for component height at the base density.
     *
     * @remarks
     * HTML attribute: base-height-multiplier
     *
     * CSS custom property: --base-height-multiplier
     */
    @designSystemProperty({
        attribute: "base-height-multiplier",
        default: fastDesignSystemDefaults.baseHeightMultiplier,
        converter: nullableNumberConverter,
    })
    public baseHeightMultiplier: number;

    /**
     * The number of designUnits used for horizontal spacing at the base density.
     *
     * @remarks
     * HTML attribute: base-horizontal-spacing-multiplier
     *
     * CSS custom property: --base-horizontal-spacing-multiplier
     */
    @designSystemProperty({
        attribute: "base-horizontal-spacing-multiplier",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.baseHorizontalSpacingMultiplier,
    })
    public baseHorizontalSpacingMultiplier: number;

    /**
     * The corner radius applied to controls.
     *
     * @remarks
     * HTML attribute: corner-radius
     *
     * CSS custom property: --corner-radius
     */
    @designSystemProperty({
        attribute: "corner-radius",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.cornerRadius,
    })
    public cornerRadius: number;

    /**
     * The width of the standard outline applied to outline components in pixels.
     *
     * @remarks
     * HTML attribute: outline-width
     *
     * CSS custom property: --outline-width
     */
    @designSystemProperty({
        attribute: "outline-width",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.outlineWidth,
    })
    public outlineWidth: number;

    /**
     * The width of the standard focus outline in pixels.
     *
     * @remarks
     * HTML attribute: focus-outline-width
     *
     * CSS custom property: --focus-outline-width
     */
    @designSystemProperty({
        attribute: "focus-outline-width",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.focusOutlineWidth,
    })
    public focusOutlineWidth: number;

    /**
     * The opacity of a disabled control.
     *
     * @remarks
     * HTML attribute: disabled-opacity
     *
     * CSS custom property: --disabled-opacity
     */
    @designSystemProperty({
        attribute: "disabled-opacity",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.disabledOpacity,
    })
    public disabledOpacity: number;

    /**
     * The font-size two steps below the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-minus-2-font-size
     *
     * CSS custom property: --type-ramp-minus-2-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-minus-2-font-size",
        default: fastDesignSystemDefaults.typeRampMinus2FontSize,
    })
    public typeRampMinus2FontSize: string;

    /**
     * The line-height two steps below the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-minus-2-line-height
     *
     * CSS custom property: --type-ramp-minus-2-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-minus-2-line-height",
        default: fastDesignSystemDefaults.typeRampMinus2LineHeight,
    })
    public typeRampMinus2LineHeight: string;

    /**
     * The font-size one step below the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-minus-1-font-size
     *
     * CSS custom property: --type-ramp-minus-1-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-minus-1-font-size",
        default: fastDesignSystemDefaults.typeRampMinus1FontSize,
    })
    public typeRampMinus1FontSize: string;

    /**
     * The line-height one step below the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-minus-1-line-height
     *
     * CSS custom property: --type-ramp-minus-1-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-minus-1-line-height",
        default: fastDesignSystemDefaults.typeRampMinus1LineHeight,
    })
    public typeRampMinus1LineHeight: string;

    /**
     * The base font-size of the relative type-ramp scale
     *
     * @remarks
     * HTML attribute: type-ramp-base-font-size
     *
     * CSS custom property: --type-ramp-base-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-base-font-size",
        default: fastDesignSystemDefaults.typeRampBaseFontSize,
    })
    public typeRampBaseFontSize: string;

    /**
     * The base line-height of the relative type-ramp scale
     *
     * @remarks
     * HTML attribute: type-ramp-base-line-height
     *
     * CSS custom property: --type-ramp-base-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-base-line-height",
        default: fastDesignSystemDefaults.typeRampBaseLineHeight,
    })
    public typeRampBaseLineHeight: string;

    /**
     * The font-size one step above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-1-font-size
     *
     * CSS custom property: --type-ramp-plus-1-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-1-font-size",
        default: fastDesignSystemDefaults.typeRampPlus1FontSize,
    })
    public typeRampPlus1FontSize: string;

    /**
     * The line-height one step above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-1-line-height
     *
     * CSS custom property: --type-ramp-plus-1-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-1-line-height",
        default: fastDesignSystemDefaults.typeRampPlus1LineHeight,
    })
    public typeRampPlus1LineHeight: string;

    /**
     * The font-size two steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-2-font-size
     *
     * CSS custom property: --type-ramp-plus-2-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-2-font-size",
        default: fastDesignSystemDefaults.typeRampPlus2FontSize,
    })
    public typeRampPlus2FontSize: string;

    /**
     * The line-height two steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-2-line-height
     *
     * CSS custom property: --type-ramp-plus-2-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-2-line-height",
        default: fastDesignSystemDefaults.typeRampPlus2LineHeight,
    })
    public typeRampPlus2LineHeight: string;

    /**
     * The font-size three steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-3-font-size
     *
     * CSS custom property: --type-ramp-plus-3-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-3-font-size",
        default: fastDesignSystemDefaults.typeRampPlus3FontSize,
    })
    public typeRampPlus3FontSize: string;

    /**
     * The line-height three steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-3-line-height
     *
     * CSS custom property: --type-ramp-plus-3-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-3-line-height",
        default: fastDesignSystemDefaults.typeRampPlus3LineHeight,
    })
    public typeRampPlus3LineHeight: string;

    /**
     * The font-size four steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-4-font-size
     *
     * CSS custom property: --type-ramp-plus-4-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-4-font-size",
        default: fastDesignSystemDefaults.typeRampPlus4FontSize,
    })
    public typeRampPlus4FontSize: string;

    /**
     * The line-height four steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-4-line-height
     *
     * CSS custom property: --type-ramp-plus-4-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-4-line-height",
        default: fastDesignSystemDefaults.typeRampPlus4LineHeight,
    })
    public typeRampPlus4LineHeight: string;

    /**
     * The font-size five steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-5-font-size
     *
     * CSS custom property: --type-ramp-plus-5-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-5-font-size",
        default: fastDesignSystemDefaults.typeRampPlus5FontSize,
    })
    public typeRampPlus5FontSize: string;

    /**
     * The line-height five steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-5-line-height
     *
     * CSS custom property: --type-ramp-plus-5-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-5-line-height",
        default: fastDesignSystemDefaults.typeRampPlus5LineHeight,
    })
    public typeRampPlus5LineHeight: string;

    /**
     * The font-size six steps above the base font-size
     *
     * @remarks
     * HTML attribute: type-ramp-plus-6-font-size
     *
     * CSS custom property: --type-ramp-plus-6-font-size
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-6-font-size",
        default: fastDesignSystemDefaults.typeRampPlus6FontSize,
    })
    public typeRampPlus6FontSize: string;

    /**
     * The line-height six steps above the base line-height
     *
     * @remarks
     * HTML attribute: type-ramp-plus-6-line-height
     *
     * CSS custom property: --type-ramp-plus-6-line-height
     */
    @designSystemProperty({
        attribute: "type-ramp-plus-6-line-height",
        default: fastDesignSystemDefaults.typeRampPlus6LineHeight,
    })
    public typeRampPlus6LineHeight: string;

    /**
     * The distance from the resolved accent fill color for the rest state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-rest-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-fill-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentFillRestDelta,
    })
    public accentFillRestDelta: number;

    /**
     * The distance from the resolved accent fill color for the hover state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-fill-hover-delta",
        cssCustomProperty: false,
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.accentFillHoverDelta,
    })
    public accentFillHoverDelta: number;

    /**
     * The distance from the resolved accent fill color for the active state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-fill-active-delta",
        cssCustomProperty: false,
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.accentFillActiveDelta,
    })
    public accentFillActiveDelta: number;

    /**
     * The distance from the resolved accent fill color for the focus state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-fill-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentFillFocusDelta,
    })
    public accentFillFocusDelta: number;

    /**
     * The distance from the resolved accent fill color for the selected state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillSelectedBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-fill-selected-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-fill-selected-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentFillSelectedDelta,
    })
    public accentFillSelectedDelta: number;

    /**
     * The distance from the resolved accent foreground color for the rest state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-rest-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-foreground-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentForegroundRestDelta,
    })
    public accentForegroundRestDelta: number;

    /**
     * The distance from the resolved accent foreground color for the hover state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-foreground-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentForegroundHoverDelta,
    })
    public accentForegroundHoverDelta: number;

    /**
     * The distance from the resolved accent foreground color for the active state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-foreground-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentForegroundActiveDelta,
    })
    public accentForegroundActiveDelta: number;

    /**
     * The distance from the resolved accent foreground color for the focus state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: accent-foreground-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "accent-foreground-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentForegroundFocusDelta,
    })
    public accentForegroundFocusDelta: number;

    /**
     * The distance from the resolved neutral fill color for the rest state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-rest-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillRestDelta,
    })
    public neutralFillRestDelta: number;

    /**
     * The distance from the resolved neutral fill color for the hover state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillHoverDelta,
    })
    public neutralFillHoverDelta: number;

    /**
     * The distance from the resolved neutral fill color for the active state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillActiveDelta,
    })
    public neutralFillActiveDelta: number;

    /**
     * The distance from the resolved neutral fill color for the focus state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillFocusDelta,
    })
    public neutralFillFocusDelta: number;

    /**
     * The distance from the resolved neutral fill color for the selected state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillSelectedBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-selected-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-selected-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillSelectedDelta,
    })
    public neutralFillSelectedDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the rest state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-rest-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-input-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputRestDelta,
    })
    public neutralFillInputRestDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the hover state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-input-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputHoverDelta,
    })
    public neutralFillInputHoverDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the active state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-input-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputActiveDelta,
    })
    public neutralFillInputActiveDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the focus state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-input-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputFocusDelta,
    })
    public neutralFillInputFocusDelta: number;

    /**
     * The distance from the resolved neutral fill input color for the selected state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputSelectedBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-input-selected-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-input-selected-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputSelectedDelta,
    })
    public neutralFillInputSelectedDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the rest state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-rest-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-stealth-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthRestDelta,
    })
    public neutralFillStealthRestDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the hover state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-stealth-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthHoverDelta,
    })
    public neutralFillStealthHoverDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the active state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-stealth-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthActiveDelta,
    })
    public neutralFillStealthActiveDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the focus state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-stealth-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthFocusDelta,
    })
    public neutralFillStealthFocusDelta: number;

    /**
     * The distance from the resolved neutral fill stealth color for the selected state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthSelectedBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-stealth-selected-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-stealth-selected-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthSelectedDelta,
    })
    public neutralFillStealthSelectedDelta: number;

    /**
     * The distance from the resolved neutral fill toggle color for the hover state of the neutral-fill-toggle recipe. See {@link @microsoft/fast-components#neutralFillToggleHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-toggle-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-toggle-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillToggleHoverDelta,
    })
    public neutralFillToggleHoverDelta: number;

    /**
     * The distance from the resolved neutral fill toggle color for the active state of the neutral-fill-toggle recipe. See {@link @microsoft/fast-components#neutralFillToggleActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-toggle-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-toggle-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillToggleActiveDelta,
    })
    public neutralFillToggleActiveDelta: number;

    /**
     * The distance from the resolved neutral fill toggle color for the focus state of the neutral-fill-toggle recipe. See {@link @microsoft/fast-components#neutralFillToggleFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-toggle-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-toggle-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillToggleFocusDelta,
    })
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
    @designSystemProperty({
        attribute: "base-layer-luminance",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.baseLayerLuminance,
    })
    public baseLayerLuminance: number; // 0...1

    /**
     * The distance from the background-color to resolve the card background. See {@link @microsoft/fast-components#neutralFillCardRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-card-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-fill-card-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillCardDelta,
    })
    public neutralFillCardDelta: number;

    /**
     * The distance from the resolved neutral foreground color for the hover state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralForegroundHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-foreground-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-foreground-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralForegroundHoverDelta,
    })
    public neutralForegroundHoverDelta: number;

    /**
     * The distance from the resolved neutral foreground color for the active state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralForegroundActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-foreground-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-foreground-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralForegroundActiveDelta,
    })
    public neutralForegroundActiveDelta: number;

    /**
     * The distance from the resolved neutral foreground color for the focus state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralForegroundFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-foreground-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-foreground-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralForegroundFocusDelta,
    })
    public neutralForegroundFocusDelta: number;

    /**
     * The distance from the resolved neutral divider color for the rest state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralDividerRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-divider-rest-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-divider-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralDividerRestDelta,
    })
    public neutralDividerRestDelta: number;

    /**
     * The distance from the resolved neutral outline color for the rest state of the neutral-outline recipe. See {@link @microsoft/fast-components#neutralOutlineRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-outline-rest-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-outline-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralOutlineRestDelta,
    })
    public neutralOutlineRestDelta: number;

    /**
     * The distance from the resolved neutral outline color for the hover state of the neutral-outline recipe. See {@link @microsoft/fast-components#neutralOutlineHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-outline-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-outline-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralOutlineHoverDelta,
    })
    public neutralOutlineHoverDelta: number;

    /**
     * The distance from the resolved neutral outline color for the active state of the neutral-outline recipe. See {@link @microsoft/fast-components#neutralOutlineActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-outline-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-outline-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralOutlineActiveDelta,
    })
    public neutralOutlineActiveDelta: number;

    /**
     * The distance from the resolved neutral outline color for the focus state of the neutral-outline recipe. See {@link @microsoft/fast-components#neutralOutlineFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-outline-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-outline-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralOutlineFocusDelta,
    })
    public neutralOutlineFocusDelta: number;

    /**
     * The distance from the resolved neutral contrast fill color for the rest state of the neutral-contrast-fill recipe. See {@link @microsoft/fast-components#neutralContrastFillRestBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-contrast-fill-rest-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-contrast-fill-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralContrastFillRestDelta,
    })
    public neutralContrastFillRestDelta: number;

    /**
     * The distance from the resolved neutral contrast fill color for the rest state of the neutral-contrast-fillrecipe. See {@link @microsoft/fast-components#neutralContrastFillHoverBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-contrast-fill-hover-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-contrast-fill-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralContrastFillHoverDelta,
    })
    public neutralContrastFillHoverDelta: number;

    /**
     * The distance from the resolved neutral contrast fill color for the rest state of the neutral-contrast-fill recipe. See {@link @microsoft/fast-components#neutralContrastFillActiveBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-contrast-fill-active-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-contrast-fill-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralContrastFillActiveDelta,
    })
    public neutralContrastFillActiveDelta: number;

    /**
     * The distance from the resolved neutral contrast fill color for the rest state of the neutral-contrast-fill recipe. See {@link @microsoft/fast-components#neutralContrastFillFocusBehavior} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-contrast-fill-focus-delta
     *
     * CSS custom property: N/A
     */
    @designSystemProperty({
        attribute: "neutral-contrast-fill-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralContrastFillFocusDelta,
    })
    public neutralContrastFillFocusDelta: number;
}
