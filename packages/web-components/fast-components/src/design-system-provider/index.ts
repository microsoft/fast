import { nullableNumberConverter } from "@microsoft/fast-element";
import {
    designSystemProperty,
    designSystemProvider,
    DesignSystemProvider,
    DesignSystemProviderTemplate as template,
} from "@microsoft/fast-foundation";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system.js";
import { DesignSystemProviderStyles as styles } from "./design-system-provider.styles.js";

@designSystemProvider({
    name: "fast-design-system-provider",
    template,
    styles,
})
export class FASTDesignSystemProvider extends DesignSystemProvider
    implements FASTDesignSystem {
    /**
     * Define design system property attributes
     */
    @designSystemProperty({
        attribute: "background-color",
        default: fastDesignSystemDefaults.backgroundColor,
    })
    public backgroundColor: string;

    @designSystemProperty({
        attribute: "accent-base-color",
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentBaseColor,
    })
    public accentBaseColor: string;

    @designSystemProperty({
        attribute: false,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralPalette,
    })
    public neutralPalette: string[];

    @designSystemProperty({
        attribute: false,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentPalette,
    })
    public accentPalette: string[];

    @designSystemProperty({
        default: fastDesignSystemDefaults.density,
        converter: nullableNumberConverter,
    })
    public density: 0;

    @designSystemProperty({
        attribute: "design-unit",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.designUnit,
    })
    public designUnit: number;

    @designSystemProperty({
        attribute: "base-height-multiplier",
        default: fastDesignSystemDefaults.baseHeightMultiplier,
        converter: nullableNumberConverter,
    })
    public baseHeightMultiplier: number;

    @designSystemProperty({
        attribute: "base-horizontal-spacing-multiplier",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.baseHorizontalSpacingMultiplier,
    })
    public baseHorizontalSpacingMultiplier: number;

    @designSystemProperty({
        attribute: "corner-radius",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.cornerRadius,
    })
    public cornerRadius: number;

    @designSystemProperty({
        attribute: "outline-width",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.outlineWidth,
    })
    public outlineWidth: number;

    @designSystemProperty({
        attribute: "focus-outline-width",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.focusOutlineWidth,
    })
    public focusOutlineWidth: number;

    @designSystemProperty({
        attribute: "disabled-opacity",
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.disabledOpacity,
    })
    public disabledOpacity: number;

    @designSystemProperty({
        attribute: "type-ramp-minus-2-font-size",
        default: "10px",
    })
    public typeRampMinus2FontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-minus-2-line-height",
        default: "16px",
    })
    public typeRampMinus2LineHeight: string;

    @designSystemProperty({
        attribute: "type-ramp-minus-1-font-size",
        default: "12px",
    })
    public typeRampMinus1FontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-minus-1-line-height",
        default: "16px",
    })
    public typeRampMinus1LineHeight: string;

    @designSystemProperty({
        attribute: "type-ramp-base-font-size",
        default: "14px",
    })
    public typeRampBaseFontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-base-line-height",
        default: "20px",
    })
    public typeRampBaseLineHeight: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-1-font-size",
        default: "16px",
    })
    public typeRampPlus1FontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-1-line-height",
        default: "24px",
    })
    public typeRampPlus1LineHeight: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-2-font-size",
        default: "20px",
    })
    public typeRampPlus2FontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-2-line-height",
        default: "28px",
    })
    public typeRampPlus2LineHeight: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-3-font-size",
        default: "28px",
    })
    public typeRampPlus3FontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-3-line-height",
        default: "36px",
    })
    public typeRampPlus3LineHeight: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-4-font-size",
        default: "34px",
    })
    public typeRampPlus4FontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-4-line-height",
        default: "44px",
    })
    public typeRampPlus4LineHeight: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-5-font-size",
        default: "46px",
    })
    public typeRampPlus5FontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-5-line-height",
        default: "56px",
    })
    public typeRampPlus5LineHeight: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-6-font-size",
        default: "60px",
    })
    public typeRampPlus6FontSize: string;

    @designSystemProperty({
        attribute: "type-ramp-plus-6-line-height",
        default: "72px",
    })
    public typeRampPlus6LineHeight: string;

    @designSystemProperty({
        attribute: "accent-fill-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentFillRestDelta,
    })
    public accentFillRestDelta: number;

    @designSystemProperty({
        attribute: "accent-fill-hover-delta",
        cssCustomProperty: false,
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.accentFillHoverDelta,
    })
    public accentFillHoverDelta: number;

    @designSystemProperty({
        attribute: "accent-fill-active-delta",
        cssCustomProperty: false,
        converter: nullableNumberConverter,
        default: fastDesignSystemDefaults.accentFillActiveDelta,
    })
    public accentFillActiveDelta: number;

    @designSystemProperty({
        attribute: "accent-fill-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentFillFocusDelta,
    })
    public accentFillFocusDelta: number;

    @designSystemProperty({
        attribute: "accent-fill-selected-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentFillSelectedDelta,
    })
    public accentFillSelectedDelta: number;

    @designSystemProperty({
        attribute: "accent-foreground-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentForegroundRestDelta,
    })
    public accentForegroundRestDelta: number;

    @designSystemProperty({
        attribute: "accent-foreground-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentForegroundHoverDelta,
    })
    public accentForegroundHoverDelta: number;

    @designSystemProperty({
        attribute: "accent-foreground-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentForegroundActiveDelta,
    })
    public accentForegroundActiveDelta: number;

    @designSystemProperty({
        attribute: "accent-foreground-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.accentForegroundFocusDelta,
    })
    public accentForegroundFocusDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillRestDelta,
    })
    public neutralFillRestDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillHoverDelta,
    })
    public neutralFillHoverDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillActiveDelta,
    })
    public neutralFillActiveDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillFocusDelta,
    })
    public neutralFillFocusDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-selected-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillSelectedDelta,
    })
    public neutralFillSelectedDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-input-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputRestDelta,
    })
    public neutralFillInputRestDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-input-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputHoverDelta,
    })
    public neutralFillInputHoverDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-input-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputActiveDelta,
    })
    public neutralFillInputActiveDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-input-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputFocusDelta,
    })
    public neutralFillInputFocusDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-input-selected-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillInputSelectedDelta,
    })
    public neutralFillInputSelectedDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-stealth-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthRestDelta,
    })
    public neutralFillStealthRestDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-stealth-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthHoverDelta,
    })
    public neutralFillStealthHoverDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-stealth-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthActiveDelta,
    })
    public neutralFillStealthActiveDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-stealth-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthFocusDelta,
    })
    public neutralFillStealthFocusDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-stealth-selected-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillStealthSelectedDelta,
    })
    public neutralFillStealthSelectedDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-toggle-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillToggleHoverDelta,
    })
    public neutralFillToggleHoverDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-toggle-hover-active",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillToggleActiveDelta,
    })
    public neutralFillToggleActiveDelta: number;

    @designSystemProperty({
        attribute: "neutral-fill-toggle-hover-focus",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillToggleFocusDelta,
    })
    public neutralFillToggleFocusDelta: number;

    @designSystemProperty({
        attribute: "base-layer-luminance",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.baseLayerLuminance,
    })
    public baseLayerLuminance: number; // 0...1

    @designSystemProperty({
        attribute: "neutral-fill-card-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralFillCardDelta,
    })
    public neutralFillCardDelta: number;

    @designSystemProperty({
        attribute: "neutral-foreground-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralForegroundHoverDelta,
    })
    public neutralForegroundHoverDelta: number;

    @designSystemProperty({
        attribute: "neutral-foreground-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralForegroundActiveDelta,
    })
    public neutralForegroundActiveDelta: number;

    @designSystemProperty({
        attribute: "neutral-foreground-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralForegroundFocusDelta,
    })
    public neutralForegroundFocusDelta: number;

    @designSystemProperty({
        attribute: "neutral-divider-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralDividerRestDelta,
    })
    public neutralDividerRestDelta: number;

    @designSystemProperty({
        attribute: "neutral-outline-rest-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralOutlineRestDelta,
    })
    public neutralOutlineRestDelta: number;

    @designSystemProperty({
        attribute: "neutral-outline-hover-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralOutlineHoverDelta,
    })
    public neutralOutlineHoverDelta: number;

    @designSystemProperty({
        attribute: "neutral-outline-active-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralOutlineActiveDelta,
    })
    public neutralOutlineActiveDelta: number;

    @designSystemProperty({
        attribute: "neutral-outline-focus-delta",
        converter: nullableNumberConverter,
        cssCustomProperty: false,
        default: fastDesignSystemDefaults.neutralOutlineFocusDelta,
    })
    public neutralOutlineFocusDelta: number;
}
