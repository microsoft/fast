import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    attr,
    css,
    html,
    nullableNumberConverter,
    Observable,
    ValueConverter,
} from "@microsoft/fast-element";
import {
    DesignToken,
    DesignTokenValue,
    display,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElement,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { Direction, SystemColors } from "@microsoft/fast-web-utilities";
import { Swatch, SwatchRGB } from "../color/swatch";
import {
    accentColor,
    accentFillActiveDelta,
    accentFillFocusDelta,
    accentFillHoverDelta,
    accentFillRestDelta,
    accentForegroundActiveDelta,
    accentForegroundFocusDelta,
    accentForegroundHoverDelta,
    accentForegroundRestDelta,
    baseHeightMultiplier,
    baseHorizontalSpacingMultiplier,
    baseLayerLuminance,
    controlCornerRadius,
    density,
    designUnit,
    direction,
    disabledOpacity,
    fillColor,
    focusStrokeWidth,
    neutralColor,
    neutralFillActiveDelta,
    neutralFillFocusDelta,
    neutralFillHoverDelta,
    neutralFillInputActiveDelta,
    neutralFillInputFocusDelta,
    neutralFillInputHoverDelta,
    neutralFillInputRestDelta,
    neutralFillLayerRestDelta,
    neutralFillRestDelta,
    neutralFillStealthActiveDelta,
    neutralFillStealthFocusDelta,
    neutralFillStealthHoverDelta,
    neutralFillStealthRestDelta,
    neutralFillStrongActiveDelta,
    neutralFillStrongFocusDelta,
    neutralFillStrongHoverDelta,
    neutralForegroundRest,
    neutralStrokeActiveDelta,
    neutralStrokeDividerRestDelta,
    neutralStrokeFocusDelta,
    neutralStrokeHoverDelta,
    neutralStrokeRestDelta,
    strokeWidth,
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

/**
 * A {@link ValueConverter} that converts to and from `Swatch` values.
 * @remarks
 * This converter allows for colors represented as string hex values, returning `null` if the
 * input was `null` or `undefined`.
 * @internal
 */
const swatchConverter: ValueConverter = {
    toView(value: any): string | null {
        if (value === null || value === undefined) {
            return null;
        }
        return (value as Swatch)?.toColorString();
    },

    fromView(value: any): any {
        if (value === null || value === undefined) {
            return null;
        }
        const color = parseColorHexRGB(value);
        return color ? SwatchRGB.create(color.r, color.g, color.b) : null;
    },
};

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
export class DesignSystemProvider extends FoundationElement {
    constructor() {
        super();

        // If fillColor or baseLayerLuminance change, we need to
        // re-evaluate whether we should have paint styles applied
        const subscriber = {
            handleChange: this.noPaintChanged.bind(this),
        };
        Observable.getNotifier(this).subscribe(subscriber, "fillColor");
        Observable.getNotifier(this).subscribe(subscriber, "baseLayerLuminance");
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
        if (!this.noPaint && (this.fillColor !== void 0 || this.baseLayerLuminance)) {
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
     * CSS custom property: --fill-color
     */
    @attr({
        attribute: "fill-color",
        converter: swatchConverter,
    })
    @designToken(fillColor)
    public fillColor: Swatch = fillColor.getValueFor(this);

    /**
     * Set the accent color
     * @remarks
     * HTML attribute: accent-color
     */
    @observable
    @designToken(neutralPalette)
    public neutralPalette?: Palette;

    /**
     * Set the neutral color
     * @remarks
     * HTML attribute: neutral-color
     */
    @observable
    @designToken(accentPalette)
    public accentPalette?: Palette;

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
    public density = density.getValueFor(this);

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
    public designUnit = designUnit.getValueFor(this);

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
    public direction = direction.getValueFor(this);

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
    public baseHeightMultiplier = baseHeightMultiplier.getValueFor(this);

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
    public baseHorizontalSpacingMultiplier = baseHorizontalSpacingMultiplier.getValueFor(
        this
    );

    /**
     * The corner radius applied to controls.
     *
     * @remarks
     * HTML attribute: control-corner-radius
     *
     * CSS custom property: --control-corner-radius
     */
    @attr({
        attribute: "control-corner-radius",
        converter: nullableNumberConverter,
    })
    @designToken(controlCornerRadius)
    public controlCornerRadius = controlCornerRadius.getValueFor(this);

    /**
     * The width of the standard stroke applied to stroke components in pixels.
     *
     * @remarks
     * HTML attribute: stroke-width
     *
     * CSS custom property: --stroke-width
     */
    @attr({
        attribute: "stroke-width",
        converter: nullableNumberConverter,
    })
    @designToken(strokeWidth)
    public strokeWidth = strokeWidth.getValueFor(this);

    /**
     * The width of the standard focus stroke in pixels.
     *
     * @remarks
     * HTML attribute: focus-stroke-width
     *
     * CSS custom property: --focus-stroke-width
     */
    @attr({
        attribute: "focus-stroke-width",
        converter: nullableNumberConverter,
    })
    @designToken(focusStrokeWidth)
    public focusStrokeWidth = focusStrokeWidth.getValueFor(this);

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
    public disabledOpacity = disabledOpacity.getValueFor(this);

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
    public typeRampMinus2FontSize = typeRampMinus2FontSize.getValueFor(this);

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
    public typeRampMinus2LineHeight = typeRampMinus2LineHeight.getValueFor(this);

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
    public typeRampMinus1FontSize = typeRampMinus1FontSize.getValueFor(this);

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
    public typeRampMinus1LineHeight = typeRampMinus1LineHeight.getValueFor(this);

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
    public typeRampBaseFontSize = typeRampBaseFontSize.getValueFor(this);

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
    public typeRampBaseLineHeight = typeRampBaseLineHeight.getValueFor(this);

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
    public typeRampPlus1FontSize = typeRampPlus1FontSize.getValueFor(this);

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
    public typeRampPlus1LineHeight = typeRampPlus1LineHeight.getValueFor(this);

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
    public typeRampPlus2FontSize = typeRampPlus2FontSize.getValueFor(this);

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
    public typeRampPlus2LineHeight = typeRampPlus2LineHeight.getValueFor(this);

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
    public typeRampPlus3FontSize = typeRampPlus3FontSize.getValueFor(this);

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
    public typeRampPlus3LineHeight = typeRampPlus3LineHeight.getValueFor(this);

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
    public typeRampPlus4FontSize = typeRampPlus4FontSize.getValueFor(this);

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
    public typeRampPlus4LineHeight = typeRampPlus4LineHeight.getValueFor(this);

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
    public typeRampPlus5FontSize = typeRampPlus5FontSize.getValueFor(this);

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
    public typeRampPlus5LineHeight = typeRampPlus5LineHeight.getValueFor(this);

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
    public typeRampPlus6FontSize = typeRampPlus6FontSize.getValueFor(this);

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
    public typeRampPlus6LineHeight = typeRampPlus6LineHeight.getValueFor(this);

    /**
     * The distance from the resolved accent fill color for the rest state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillRest} for usage in CSS.
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
    public accentFillRestDelta = accentFillRestDelta.getValueFor(this);

    /**
     * The distance from the resolved accent fill color for the hover state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillHover} for usage in CSS.
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
    public accentFillHoverDelta = accentFillHoverDelta.getValueFor(this);

    /**
     * The distance from the resolved accent fill color for the active state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillActive} for usage in CSS.
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
    public accentFillActiveDelta = accentFillActiveDelta.getValueFor(this);

    /**
     * The distance from the resolved accent fill color for the focus state of the accent-fill recipe. See {@link @microsoft/fast-components#accentFillFocus} for usage in CSS.
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
    public accentFillFocusDelta = accentFillFocusDelta.getValueFor(this);

    /**
     * The distance from the resolved accent foreground color for the rest state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundRest} for usage in CSS.
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
    public accentForegroundRestDelta = accentForegroundRestDelta.getValueFor(this);

    /**
     * The distance from the resolved accent foreground color for the hover state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundHover} for usage in CSS.
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
    public accentForegroundHoverDelta = accentForegroundHoverDelta.getValueFor(this);

    /**
     * The distance from the resolved accent foreground color for the active state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundActive} for usage in CSS.
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
    public accentForegroundActiveDelta = accentForegroundActiveDelta.getValueFor(this);

    /**
     * The distance from the resolved accent foreground color for the focus state of the accent-foreground recipe. See {@link @microsoft/fast-components#accentForegroundFocus} for usage in CSS.
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
    public accentForegroundFocusDelta = accentForegroundFocusDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill color for the rest state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillRest} for usage in CSS.
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
    public neutralFillRestDelta = neutralFillRestDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill color for the hover state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillHover} for usage in CSS.
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
    public neutralFillHoverDelta = neutralFillHoverDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill color for the active state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillActive} for usage in CSS.
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
    public neutralFillActiveDelta = neutralFillActiveDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill color for the focus state of the neutral-fill recipe. See {@link @microsoft/fast-components#neutralFillFocus} for usage in CSS.
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
    public neutralFillFocusDelta = neutralFillFocusDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill input color for the rest state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputRest} for usage in CSS.
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
    public neutralFillInputRestDelta = neutralFillInputRestDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill input color for the hover state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputHover} for usage in CSS.
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
    public neutralFillInputHoverDelta = neutralFillInputHoverDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill input color for the active state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputActive} for usage in CSS.
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
    public neutralFillInputActiveDelta = neutralFillInputActiveDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill input color for the focus state of the neutral-fill-input recipe. See {@link @microsoft/fast-components#neutralFillInputFocus} for usage in CSS.
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
    public neutralFillInputFocusDelta = neutralFillInputFocusDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill stealth color for the rest state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthRest} for usage in CSS.
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
    public neutralFillStealthRestDelta = neutralFillStealthRestDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill stealth color for the hover state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthHover} for usage in CSS.
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
    public neutralFillStealthHoverDelta = neutralFillStealthHoverDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill stealth color for the active state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthActive} for usage in CSS.
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
    public neutralFillStealthActiveDelta = neutralFillStealthActiveDelta.getValueFor(
        this
    );

    /**
     * The distance from the resolved neutral fill stealth color for the focus state of the neutral-fill-stealth recipe. See {@link @microsoft/fast-components#neutralFillStealthFocus} for usage in CSS.
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
    public neutralFillStealthFocusDelta = neutralFillStealthFocusDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill strong color for the hover state of the neutral-fill-strong recipe. See {@link @microsoft/fast-components#neutralFillStrongHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-strong-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-strong-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillStrongHoverDelta)
    public neutralFillStrongHoverDelta = neutralFillStrongHoverDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill strong color for the active state of the neutral-fill-strong recipe. See {@link @microsoft/fast-components#neutralFillStrongActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-strong-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-strong-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillStrongActiveDelta)
    public neutralFillStrongActiveDelta = neutralFillStrongActiveDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral fill strong color for the focus state of the neutral-fill-strong recipe. See {@link @microsoft/fast-components#neutralFillStrongFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-strong-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-strong-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillStrongFocusDelta)
    public neutralFillStrongFocusDelta = neutralFillStrongFocusDelta.getValueFor(this);

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
    @attr({
        attribute: "base-layer-luminance",
        converter: nullableNumberConverter,
    })
    @designToken(baseLayerLuminance)
    public baseLayerLuminance = baseLayerLuminance.getValueFor(this); // 0...1

    /**
     * The distance from the background-color to resolve the card background. See {@link @microsoft/fast-components#neutralFillLayerRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-fill-layer-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-fill-layer-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralFillLayerRestDelta)
    public neutralFillLayerRestDelta = neutralFillLayerRestDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral divider color for the rest state of the neutral-foreground recipe. See {@link @microsoft/fast-components#neutralStrokeDividerRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-divider-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-stroke-divider-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralStrokeDividerRestDelta)
    public neutralStrokeDividerRestDelta = neutralStrokeDividerRestDelta.getValueFor(
        this
    );

    /**
     * The distance from the resolved neutral stroke color for the rest state of the neutral-stroke recipe. See {@link @microsoft/fast-components#neutralStrokeRest} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-rest-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-stroke-rest-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralStrokeRestDelta)
    public neutralStrokeRestDelta = neutralStrokeRestDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral stroke color for the hover state of the neutral-stroke recipe. See {@link @microsoft/fast-components#neutralStrokeHover} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-hover-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-stroke-hover-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralStrokeHoverDelta)
    public neutralStrokeHoverDelta = neutralStrokeHoverDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral stroke color for the active state of the neutral-stroke recipe. See {@link @microsoft/fast-components#neutralStrokeActive} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-active-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-stroke-active-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralStrokeActiveDelta)
    public neutralStrokeActiveDelta = neutralStrokeActiveDelta.getValueFor(this);

    /**
     * The distance from the resolved neutral stroke color for the focus state of the neutral-stroke recipe. See {@link @microsoft/fast-components#neutralStrokeFocus} for usage in CSS.
     *
     * @remarks
     * HTML attribute: neutral-stroke-focus-delta
     *
     * CSS custom property: N/A
     */
    @attr({
        attribute: "neutral-stroke-focus-delta",
        converter: nullableNumberConverter,
    })
    @designToken(neutralStrokeFocusDelta)
    public neutralStrokeFocusDelta = neutralStrokeFocusDelta.getValueFor(this);
}

/**
 * Template for DesignSystemProvider.
 * @public
 */
export const designSystemProviderTemplate = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <slot></slot>
`;

/**
 * Styles for DesignSystemProvider.
 * @public
 */
export const designSystemProviderStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    ${display("block")}
`;

/**
 * A function that returns a {@link DesignSystemProvider} registration for configuring the component with a DesignSystem.
 * @public
 * @remarks
 * Generates HTML Element: `<fast-design-system-provider>`
 */
export const fastDesignSystemProvider = DesignSystemProvider.compose({
    baseName: "design-system-provider",
    template: designSystemProviderTemplate,
    styles: designSystemProviderStyles,
});
