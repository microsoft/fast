import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import {
    DensityOffset,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import {
    designSystemProperty,
    designSystemProvider,
    DesignSystemProvider,
    DesignSystemProviderTemplate as template,
} from "@microsoft/fast-foundation";
import { DesignSystemProviderStyles as styles } from "./design-system-provider.styles";

const fromView: { mode: "fromView" } = {
    mode: "fromView",
};

const fromViewNumber: { mode: "fromView"; converter: typeof nullableNumberConverter } = {
    ...fromView,
    converter: nullableNumberConverter,
};

@designSystemProvider({
    name: "fast-design-system-provider",
    template,
    styles,
})
export class FASTDesignSystemProvider extends DesignSystemProvider
    implements
        Omit<
            DesignSystem,
            | "contrast"
            | "direction"
            | "fontWeight"
            | "neutralForegroundDarkIndex"
            | "neutralForegroundLightIndex"
        > {
    /**
     * Define design system property attributes
     */
    @attr({ attribute: "background-color", ...fromView })
    @designSystemProperty({
        cssCustomProperty: "background-color",
        default: DesignSystemDefaults.backgroundColor,
    })
    public backgroundColor: string;

    @attr({ attribute: "accent-base-color", ...fromView })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentBaseColor,
    })
    public accentBaseColor: string;

    @observable
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralPalette,
    })
    public neutralPalette: string[];

    @observable
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentPalette,
    })
    public accentPalette: string[];

    @attr(fromViewNumber)
    @designSystemProperty({ default: DesignSystemDefaults.density })
    public density: DensityOffset;

    @attr({
        attribute: "design-unit",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: "design-unit",
        default: DesignSystemDefaults.designUnit,
    })
    public designUnit: number;

    @attr({
        attribute: "base-height-multiplier",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: "base-height-multiplier",
        default: DesignSystemDefaults.baseHeightMultiplier,
    })
    public baseHeightMultiplier: number;

    @attr({
        attribute: "base-horizontal-spacing-multiplier",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: "base-horizontal-spacing-multiplier",
        default: DesignSystemDefaults.baseHorizontalSpacingMultiplier,
    })
    public baseHorizontalSpacingMultiplier: number;

    @attr({
        attribute: "corner-radius",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: "corner-radius",
        default: DesignSystemDefaults.cornerRadius,
    })
    public cornerRadius: number;

    @attr({
        attribute: "elevated-corner-radius",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: "elevated-corner-radius",
        default: DesignSystemDefaults.elevatedCornerRadius,
    })
    public elevatedCornerRadius: number;

    @attr({
        attribute: "outline-width",
        converter: nullableNumberConverter,
        ...fromView,
    })
    @designSystemProperty({
        cssCustomProperty: "outline-width",
        default: DesignSystemDefaults.outlineWidth,
    })
    public outlineWidth: number;

    @attr({
        attribute: "focus-outline-width",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: "focus-outline-width",
        default: DesignSystemDefaults.focusOutlineWidth,
    })
    public focusOutlineWidth: number;

    @attr({
        attribute: "disabled-opacity",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: "disabled-opacity",
        default: DesignSystemDefaults.disabledOpacity,
    })
    public disabledOpacity: number;

    @attr({ ...fromView, attribute: "type-ramp-minus-2-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-minus-2-font-size",
        default: "10px",
    })
    public typeRampMinus2FontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-minus-2-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-minus-2-line-height",
        default: "16px",
    })
    public typeRampMinus2LineHeight: string;

    @attr({ ...fromView, attribute: "type-ramp-minus-1-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-minus-1-font-size",
        default: "12px",
    })
    public typeRampMinus1FontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-minus-1-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-minus-1-line-height",
        default: "16px",
    })
    public typeRampMinus1LineHeight: string;

    @attr({ ...fromView, attribute: "type-ramp-base-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-base-font-size",
        default: "14px",
    })
    public typeRampBaseFontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-base-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-base-line-height",
        default: "20px",
    })
    public typeRampBaseLineHeight: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-1-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-1-font-size",
        default: "16px",
    })
    public typeRampPlus1FontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-1-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-1-line-height",
        default: "24px",
    })
    public typeRampPlus1LineHeight: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-2-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-2-font-size",
        default: "20px",
    })
    public typeRampPlus2FontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-2-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-2-line-height",
        default: "28px",
    })
    public typeRampPlus2LineHeight: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-3-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-3-font-size",
        default: "28px",
    })
    public typeRampPlus3FontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-3-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-3-line-height",
        default: "36px",
    })
    public typeRampPlus3LineHeight: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-4-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-4-font-size",
        default: "34px",
    })
    public typeRampPlus4FontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-4-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-4-line-height",
        default: "44px",
    })
    public typeRampPlus4LineHeight: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-5-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-5-font-size",
        default: "46px",
    })
    public typeRampPlus5FontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-5-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-5-line-height",
        default: "56px",
    })
    public typeRampPlus5LineHeight: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-6-font-size" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-6-font-size",
        default: "60px",
    })
    public typeRampPlus6FontSize: string;

    @attr({ ...fromView, attribute: "type-ramp-plus-6-line-height" })
    @designSystemProperty({
        cssCustomProperty: "type-ramp-plus-6-line-height",
        default: "72px",
    })
    public typeRampPlus6LineHeight: string;

    @attr({
        attribute: "accent-fill-rest-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillRestDelta,
    })
    public accentFillRestDelta: number;

    @attr({
        attribute: "accent-fill-hover-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillHoverDelta,
    })
    public accentFillHoverDelta: number;

    @attr({
        attribute: "accent-fill-active-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillActiveDelta,
    })
    public accentFillActiveDelta: number;

    @attr({
        attribute: "accent-fill-focus-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillFocusDelta,
    })
    public accentFillFocusDelta: number;

    @attr({
        attribute: "accent-fill-selected-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillSelectedDelta,
    })
    public accentFillSelectedDelta: number;

    @attr({
        attribute: "accent-foreground-rest-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentForegroundRestDelta,
    })
    public accentForegroundRestDelta: number;

    @attr({
        attribute: "accent-foreground-hover-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentForegroundHoverDelta,
    })
    public accentForegroundHoverDelta: number;

    @attr({
        attribute: "accent-foreground-active-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentForegroundActiveDelta,
    })
    public accentForegroundActiveDelta: number;

    @attr({
        attribute: "accent-foreground-focus-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentForegroundFocusDelta,
    })
    public accentForegroundFocusDelta: number;

    @attr({
        attribute: "neutral-fill-rest-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillRestDelta,
    })
    public neutralFillRestDelta: number;

    @attr({
        attribute: "neutral-fill-hover-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillHoverDelta,
    })
    public neutralFillHoverDelta: number;

    @attr({
        attribute: "neutral-fill-active-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillActiveDelta,
    })
    public neutralFillActiveDelta: number;

    @attr({
        attribute: "neutral-fill-focus-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillFocusDelta,
    })
    public neutralFillFocusDelta: number;

    @attr({
        attribute: "neutral-fill-selected-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillSelectedDelta,
    })
    public neutralFillSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-input-rest-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputRestDelta,
    })
    public neutralFillInputRestDelta: number;

    @attr({
        attribute: "neutral-fill-input-hover-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputHoverDelta,
    })
    public neutralFillInputHoverDelta: number;

    @attr({
        attribute: "neutral-fill-input-active-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputActiveDelta,
    })
    public neutralFillInputActiveDelta: number;

    @attr({
        attribute: "neutral-fill-input-focus-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputFocusDelta,
    })
    public neutralFillInputFocusDelta: number;

    @attr({
        attribute: "neutral-fill-input-selected-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputSelectedDelta,
    })
    public neutralFillInputSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-rest-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthRestDelta,
    })
    public neutralFillStealthRestDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-hover-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthHoverDelta,
    })
    public neutralFillStealthHoverDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-active-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthActiveDelta,
    })
    public neutralFillStealthActiveDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-focus-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthFocusDelta,
    })
    public neutralFillStealthFocusDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-selected-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthSelectedDelta,
    })
    public neutralFillStealthSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillToggleHoverDelta,
    })
    public neutralFillToggleHoverDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-active",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillToggleActiveDelta,
    })
    public neutralFillToggleActiveDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-focus",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillToggleFocusDelta,
    })
    public neutralFillToggleFocusDelta: number;

    @attr({
        attribute: "base-layer-luminance",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.baseLayerLuminance,
    })
    public baseLayerLuminance: number; // 0...1

    @attr({
        attribute: "neutral-fill-card-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillCardDelta,
    })
    public neutralFillCardDelta: number;

    @attr({
        attribute: "neutral-foreground-hover-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralForegroundHoverDelta,
    })
    public neutralForegroundHoverDelta: number;

    @attr({
        attribute: "neutral-foreground-active-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralForegroundActiveDelta,
    })
    public neutralForegroundActiveDelta: number;

    @attr({
        attribute: "neutral-foreground-focus-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralForegroundFocusDelta,
    })
    public neutralForegroundFocusDelta: number;

    @attr({
        attribute: "neutral-divider-rest-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralDividerRestDelta,
    })
    public neutralDividerRestDelta: number;

    @attr({
        attribute: "neutral-outline-rest-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralOutlineRestDelta,
    })
    public neutralOutlineRestDelta: number;

    @attr({
        attribute: "neutral-outline-hover-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralOutlineHoverDelta,
    })
    public neutralOutlineHoverDelta: number;

    @attr({
        attribute: "neutral-outline-active-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralOutlineActiveDelta,
    })
    public neutralOutlineActiveDelta: number;

    @attr({
        attribute: "neutral-outline-focus-delta",
        ...fromViewNumber,
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralOutlineFocusDelta,
    })
    public neutralOutlineFocusDelta: number;
}
