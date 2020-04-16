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
    @designSystemProperty({ customPropertyName: "background-color" })
    public backgroundColor: string;

    @attr({ attribute: "accent-base-color", mode: "fromView" })
    @designSystemProperty({ customProperty: false })
    public accentBaseColor: string;

    @observable
    @designSystemProperty({ customProperty: false })
    public neutralPalette: string[];

    @observable
    @designSystemProperty({ customProperty: false })
    public accentPalette: string[];

    @attr({ converter: nullableNumberConverter, mode: "fromView" })
    @designSystemProperty
    public density: DensityOffset;

    @attr({
        attribute: "design-unit",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customPropertyName: "design-unit" })
    public designUnit: number;

    @attr({
        attribute: "base-height-multiplier",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customPropertyName: "base-height-multiplier" })
    public baseHeightMultiplier: number;

    @attr({
        attribute: "base-horizontal-spacing-multiplier",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customPropertyName: "base-horizontal-spacing-multiplier" })
    public baseHorizontalSpacingMultiplier: number;

    @attr({
        attribute: "corner-radius",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customPropertyName: "corner-radius" })
    public cornerRadius: number;

    @attr({
        attribute: "elevated-corner-radius",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customPropertyName: "elevated-corner-radius" })
    public elevatedCornerRadius: number;

    @attr({
        attribute: "outline-width",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customPropertyName: "outline-width" })
    public outlineWidth: number;

    @attr({
        attribute: "focus-outline-width",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customPropertyName: "focus-outline-width" })
    public focusOutlineWidth: number;

    @attr({
        attribute: "disabled-opacity",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customPropertyName: "disabled-opacity" })
    public disabledOpacity: number;

    @attr({
        attribute: "accent-fill-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentFillRestDelta: number;

    @attr({
        attribute: "accent-fill-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentFillHoverDelta: number;

    @attr({
        attribute: "accent-fill-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentFillActiveDelta: number;

    @attr({
        attribute: "accent-fill-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentFillFocusDelta: number;

    @attr({
        attribute: "accent-fill-selected-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentFillSelectedDelta: number;

    @attr({
        attribute: "accent-foreground-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentForegroundRestDelta: number;

    @attr({
        attribute: "accent-foreground-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentForegroundHoverDelta: number;

    @attr({
        attribute: "accent-foreground-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentForegroundActiveDelta: number;

    @attr({
        attribute: "accent-foreground-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public accentForegroundFocusDelta: number;

    @attr({
        attribute: "neutral-fill-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillRestDelta: number;

    @attr({
        attribute: "neutral-fill-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillHoverDelta: number;

    @attr({
        attribute: "neutral-fill-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillActiveDelta: number;

    @attr({
        attribute: "neutral-fill-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillFocusDelta: number;

    @attr({
        attribute: "neutral-fill-selected-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-input-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillInputRestDelta: number;

    @attr({
        attribute: "neutral-fill-input-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillInputHoverDelta: number;

    @attr({
        attribute: "neutral-fill-input-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillInputActiveDelta: number;

    @attr({
        attribute: "neutral-fill-input-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillInputFocusDelta: number;

    @attr({
        attribute: "neutral-fill-input-selected-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillInputSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillStealthRestDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillStealthHoverDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillStealthActiveDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillStealthFocusDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-selected-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillStealthSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillToggleHoverDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-active",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillToggleActiveDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-focus",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillToggleFocusDelta: number;

    @attr({
        attribute: "base-layer-luminance",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public baseLayerLuminance: number; // 0...1

    @attr({
        attribute: "neutral-fill-card-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralFillCardDelta: number;

    @attr({
        attribute: "neutral-foreground-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralForegroundHoverDelta: number;

    @attr({
        attribute: "neutral-foreground-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralForegroundActiveDelta: number;

    @attr({
        attribute: "neutral-foreground-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralForegroundFocusDelta: number;

    @attr({
        attribute: "neutral-divider-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralDividerRestDelta: number;

    @attr({
        attribute: "neutral-outline-rest-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralOutlineRestDelta: number;

    @attr({
        attribute: "neutral-outline-hover-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralOutlineHoverDelta: number;

    @attr({
        attribute: "neutral-outline-active-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralOutlineActiveDelta: number;

    @attr({
        attribute: "neutral-outline-focus-delta",
        converter: nullableNumberConverter,
        mode: "fromView",
    })
    @designSystemProperty({ customProperty: false })
    public neutralOutlineFocusDelta: number;
}
export * from "./design-system-provider";
export * from "./design-system-provider.styles";
export * from "./design-system-provider.template";
