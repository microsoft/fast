import {
    attr,
    customElement,
    nullableNumberConverter,
    observable,
} from "@microsoft/fast-element";
import {
    DensityOffset,
    DesignSystem,
    DesignSystemDefaults,
    neutralFillInputHoverDelta,
} from "@microsoft/fast-components-styles-msft";
import { designSystemProperty, DesignSystemProvider } from "./design-system-provider";
import { DesignSystemProviderStyles as styles } from "./design-system-provider.styles";
import { DesignSystemProviderTemplate as template } from "./design-system-provider.template";

@customElement({
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
     * Applies the default design-system values to the instance where properties
     * are not explicitly assigned. This is generally used to set the root design
     * system context.
     */
    @attr({ attribute: "use-defaults" })
    public useDefaults: boolean;

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.useDefaults === ("" as any)) {
            Object.keys(this.designSystemProperties).forEach(property => {
                if (this[property] === void 0) {
                    this[property] = DesignSystemDefaults[property];
                }
            });
        }
    }
    /**
     * Define design system property attributes
     */
    @attr({ attribute: "background-color", mode: "fromView" })
    @designSystemProperty({
        cssCustomProperty: "background-color",
        default: DesignSystemDefaults.backgroundColor,
    })
    public backgroundColor: string;

    @attr({ attribute: "accent-base-color", mode: "fromView" })
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

    @attr({ converter: nullableNumberConverter, mode: "fromView" })
    @designSystemProperty({ default: DesignSystemDefaults.density })
    public density: DensityOffset;

    @attr({
        attribute: "design-unit",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: "design-unit",
        default: DesignSystemDefaults.designUnit,
    })
    public designUnit: number;

    @attr({
        attribute: "base-height-multiplier",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: "base-height-multiplier",
        default: DesignSystemDefaults.baseHeightMultiplier,
    })
    public baseHeightMultiplier: number;

    @attr({
        attribute: "base-horizontal-spacing-multiplier",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: "base-horizontal-spacing-multiplier",
        default: DesignSystemDefaults.baseHorizontalSpacingMultiplier,
    })
    public baseHorizontalSpacingMultiplier: number;

    @attr({
        attribute: "corner-radius",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: "corner-radius",
        default: DesignSystemDefaults.cornerRadius,
    })
    public cornerRadius: number;

    @attr({
        attribute: "elevated-corner-radius",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: "elevated-corner-radius",
        default: DesignSystemDefaults.elevatedCornerRadius,
    })
    public elevatedCornerRadius: number;

    @attr({
        attribute: "outline-width",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: "outline-width",
        default: DesignSystemDefaults.outlineWidth,
    })
    public outlineWidth: number;

    @attr({
        attribute: "focus-outline-width",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: "focus-outline-width",
        default: DesignSystemDefaults.focusOutlineWidth,
    })
    public focusOutlineWidth: number;

    @attr({
        attribute: "disabled-opacity",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: "disabled-opacity",
        default: DesignSystemDefaults.disabledOpacity,
    })
    public disabledOpacity: number;

    @attr({
        attribute: "accent-fill-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillRestDelta,
    })
    public accentFillRestDelta: number;

    @attr({
        attribute: "accent-fill-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillHoverDelta,
    })
    public accentFillHoverDelta: number;

    @attr({
        attribute: "accent-fill-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillActiveDelta,
    })
    public accentFillActiveDelta: number;

    @attr({
        attribute: "accent-fill-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillFocusDelta,
    })
    public accentFillFocusDelta: number;

    @attr({
        attribute: "accent-fill-selected-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentFillSelectedDelta,
    })
    public accentFillSelectedDelta: number;

    @attr({
        attribute: "accent-foreground-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentForegroundRestDelta,
    })
    public accentForegroundRestDelta: number;

    @attr({
        attribute: "accent-foreground-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentForegroundHoverDelta,
    })
    public accentForegroundHoverDelta: number;

    @attr({
        attribute: "accent-foreground-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentForegroundActiveDelta,
    })
    public accentForegroundActiveDelta: number;

    @attr({
        attribute: "accent-foreground-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.accentForegroundFocusDelta,
    })
    public accentForegroundFocusDelta: number;

    @attr({
        attribute: "neutral-fill-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillRestDelta,
    })
    public neutralFillRestDelta: number;

    @attr({
        attribute: "neutral-fill-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillHoverDelta,
    })
    public neutralFillHoverDelta: number;

    @attr({
        attribute: "neutral-fill-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillActiveDelta,
    })
    public neutralFillActiveDelta: number;

    @attr({
        attribute: "neutral-fill-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillFocusDelta,
    })
    public neutralFillFocusDelta: number;

    @attr({
        attribute: "neutral-fill-selected-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillSelectedDelta,
    })
    public neutralFillSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-input-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputRestDelta,
    })
    public neutralFillInputRestDelta: number;

    @attr({
        attribute: "neutral-fill-input-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputHoverDelta,
    })
    public neutralFillInputHoverDelta: number;

    @attr({
        attribute: "neutral-fill-input-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputActiveDelta,
    })
    public neutralFillInputActiveDelta: number;

    @attr({
        attribute: "neutral-fill-input-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputFocusDelta,
    })
    public neutralFillInputFocusDelta: number;

    @attr({
        attribute: "neutral-fill-input-selected-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillInputSelectedDelta,
    })
    public neutralFillInputSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthRestDelta,
    })
    public neutralFillStealthRestDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthHoverDelta,
    })
    public neutralFillStealthHoverDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthActiveDelta,
    })
    public neutralFillStealthActiveDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthFocusDelta,
    })
    public neutralFillStealthFocusDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-selected-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillStealthSelectedDelta,
    })
    public neutralFillStealthSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillToggleHoverDelta,
    })
    public neutralFillToggleHoverDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-active",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillToggleActiveDelta,
    })
    public neutralFillToggleActiveDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-focus",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillToggleFocusDelta,
    })
    public neutralFillToggleFocusDelta: number;

    @attr({
        attribute: "base-layer-luminance",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.baseLayerLuminance,
    })
    public baseLayerLuminance: number; // 0...1

    @attr({
        attribute: "neutral-fill-card-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralFillCardDelta,
    })
    public neutralFillCardDelta: number;

    @attr({
        attribute: "neutral-foreground-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralForegroundHoverDelta,
    })
    public neutralForegroundHoverDelta: number;

    @attr({
        attribute: "neutral-foreground-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralForegroundActiveDelta,
    })
    public neutralForegroundActiveDelta: number;

    @attr({
        attribute: "neutral-foreground-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralForegroundFocusDelta,
    })
    public neutralForegroundFocusDelta: number;

    @attr({
        attribute: "neutral-divider-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralDividerRestDelta,
    })
    public neutralDividerRestDelta: number;

    @attr({
        attribute: "neutral-outline-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralOutlineRestDelta,
    })
    public neutralOutlineRestDelta: number;

    @attr({
        attribute: "neutral-outline-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralOutlineHoverDelta,
    })
    public neutralOutlineHoverDelta: number;

    @attr({
        attribute: "neutral-outline-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralOutlineActiveDelta,
    })
    public neutralOutlineActiveDelta: number;

    @attr({
        attribute: "neutral-outline-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({
        cssCustomProperty: false,
        default: DesignSystemDefaults.neutralOutlineFocusDelta,
    })
    public neutralOutlineFocusDelta: number;
}
export * from "./design-system-provider";
export * from "./design-system-provider.styles";
export * from "./design-system-provider.template";
