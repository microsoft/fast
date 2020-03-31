import {
    attr,
    customElement,
    nullableNumberConverter,
    observable,
} from "@microsoft/fast-element";
import { designSystemProperty, DesignSystemProvider } from "./design-system-provider";
import { DesignSystemProviderStyles as styles } from "./design-system-provider.styles";
import { DesignSystemProviderTemplate as template } from "./design-system-provider.template";
import {
    DensityOffset,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";

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

    public connectedCallback() {
        super.connectedCallback();

        if (this.useDefaults === ("" as any)) {
            this.designSystemProperties.forEach(property => {
                const propName = property.property;

                if (this[propName] === void 0) {
                    this[property.property] = DesignSystemDefaults[property.property];
                }
            });
        }
    }
    /**
     * Define design system property atttributes
     */
    @attr({ attribute: "background-color" })
    @designSystemProperty("background-color")
    public backgroundColor: string;

    @attr({ attribute: "accent-base-color" })
    @designSystemProperty("accent-base-color")
    public accentBaseColor: string;

    @observable
    @designSystemProperty
    public neutralPalette: string[];

    @observable
    @designSystemProperty
    public accentPalette: string[];

    @attr({ converter: nullableNumberConverter })
    @designSystemProperty
    public density: DensityOffset;

    @attr({ attribute: "design-unit", converter: nullableNumberConverter })
    @designSystemProperty("design-unit")
    public designUnit: number;

    @attr({ attribute: "base-height-multiplier", converter: nullableNumberConverter })
    @designSystemProperty("base-height-multiplier")
    public baseHeightMultiplier: number;

    @attr({
        attribute: "base-horizontal-spacing-multiplier",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("base-horizontal-spacing-multiplier")
    public baseHorizontalSpacingMultiplier: number;

    @attr({ attribute: "corner-radius", converter: nullableNumberConverter })
    @designSystemProperty("corner-radius")
    public cornerRadius: number;

    @attr({ attribute: "elevated-corner-radius", converter: nullableNumberConverter })
    @designSystemProperty("elevated-corner-radius")
    public elevatedCornerRadius: number;

    @attr({ attribute: "outline-width", converter: nullableNumberConverter })
    @designSystemProperty("outline-width")
    public outlineWidth: number;

    @attr({ attribute: "focus-outline-width", converter: nullableNumberConverter })
    @designSystemProperty("focus-outline-width")
    public focusOutlineWidth: number;

    @attr({ attribute: "disabled-opacity", converter: nullableNumberConverter })
    @designSystemProperty("disabled-opacity")
    public disabledOpacity: number;

    @attr({ attribute: "accent-fill-rest-delta", converter: nullableNumberConverter })
    @designSystemProperty("accent-fill-rest-delta")
    public accentFillRestDelta: number;

    @attr({ attribute: "accent-fill-hover-delta", converter: nullableNumberConverter })
    @designSystemProperty("accent-fill-hover-delta")
    public accentFillHoverDelta: number;

    @attr({ attribute: "accent-fill-active-delta", converter: nullableNumberConverter })
    @designSystemProperty("accent-fill-active-delta")
    public accentFillActiveDelta: number;

    @attr({ attribute: "accent-fill-focus-delta", converter: nullableNumberConverter })
    @designSystemProperty("accent-fill-focus-delta")
    public accentFillFocusDelta: number;

    @attr({ attribute: "accent-fill-selected-delta", converter: nullableNumberConverter })
    @designSystemProperty("accent-fill-selected-delta")
    public accentFillSelectedDelta: number;

    @attr({
        attribute: "accent-foreground-rest-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("accent-foreground-rest-delta")
    public accentForegroundRestDelta: number;

    @attr({
        attribute: "accent-foreground-hover-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("accent-foreground-hover-delta")
    public accentForegroundHoverDelta: number;

    @attr({
        attribute: "accent-foreground-active-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("accent-foreground-active-delta")
    public accentForegroundActiveDelta: number;

    @attr({
        attribute: "accent-foreground-focus-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("accent-foreground-focus-delta")
    public accentForegroundFocusDelta: number;

    @attr({ attribute: "neutral-fill-rest-delta", converter: nullableNumberConverter })
    @designSystemProperty("neutral-fill-rest-delta")
    public neutralFillRestDelta: number;

    @attr({ attribute: "neutral-fill-hover-delta", converter: nullableNumberConverter })
    @designSystemProperty("neutral-fill-hover-delta")
    public neutralFillHoverDelta: number;

    @attr({ attribute: "neutral-fill-active-delta", converter: nullableNumberConverter })
    @designSystemProperty("neutral-fill-active-delta")
    public neutralFillActiveDelta: number;

    @attr({ attribute: "neutral-fill-focus-delta", converter: nullableNumberConverter })
    @designSystemProperty("neutral-fill-focus-delta")
    public neutralFillFocusDelta: number;

    @attr({
        attribute: "neutral-fill-selected-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-selected-delta")
    public neutralFillSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-input-rest-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-input-rest-delta")
    public neutralFillInputRestDelta: number;

    @attr({
        attribute: "neutral-fill-input-hover-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-input-hover-delta")
    public neutralFillInputHoverDelta: number;

    @attr({
        attribute: "neutral-fill-input-active-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-input-active-delta")
    public neutralFillInputActiveDelta: number;

    @attr({
        attribute: "neutral-fill-input-focus-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-input-focus-delta")
    public neutralFillInputFocusDelta: number;

    @attr({
        attribute: "neutral-fill-input-selected-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-input-selected-delta")
    public neutralFillInputSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-rest-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-stealth-rest-delta")
    public neutralFillStealthRestDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-hover-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-stealth-hover-delta")
    public neutralFillStealthHoverDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-active-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-stealth-active-delta")
    public neutralFillStealthActiveDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-focus-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-stealth-focus-delta")
    public neutralFillStealthFocusDelta: number;

    @attr({
        attribute: "neutral-fill-stealth-selected-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-stealth-selected-delta")
    public neutralFillStealthSelectedDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-toggle-hover-delta")
    public neutralFillToggleHoverDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-active",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-toggle-hover-active")
    public neutralFillToggleActiveDelta: number;

    @attr({
        attribute: "neutral-fill-toggle-hover-focus",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-fill-toggle-hover-focus")
    public neutralFillToggleFocusDelta: number;

    @attr({ attribute: "base-layer-luminance", converter: nullableNumberConverter })
    @designSystemProperty("base-layer-luminance")
    public baseLayerLuminance: number; // 0...1

    @attr({ attribute: "neutral-fill-card-delta", converter: nullableNumberConverter })
    @designSystemProperty("neutral-fill-card-delta")
    public neutralFillCardDelta: number;

    @attr({
        attribute: "neutral-foreground-hover-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-foreground-hover-delta")
    public neutralForegroundHoverDelta: number;

    @attr({
        attribute: "neutral-foreground-active-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-foreground-active-delta")
    public neutralForegroundActiveDelta: number;

    @attr({
        attribute: "neutral-foreground-focus-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-foreground-focus-delta")
    public neutralForegroundFocusDelta: number;

    @attr({ attribute: "neutral-divider-rest-delta", converter: nullableNumberConverter })
    @designSystemProperty("neutral-divider-rest-delta")
    public neutralDividerRestDelta: number;

    @attr({ attribute: "neutral-outline-rest-delta", converter: nullableNumberConverter })
    @designSystemProperty("neutral-outline-rest-delta")
    public neutralOutlineRestDelta: number;

    @attr({
        attribute: "neutral-outline-hover-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-outline-hover-delta")
    public neutralOutlineHoverDelta: number;

    @attr({
        attribute: "neutral-outline-active-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-outline-active-delta")
    public neutralOutlineActiveDelta: number;

    @attr({
        attribute: "neutral-outline-focus-delta",
        converter: nullableNumberConverter,
    })
    @designSystemProperty("neutral-outline-focus-delta")
    public neutralOutlineFocusDelta: number;
}
export * from "./design-system-provider";
export * from "./design-system-provider.styles";
export * from "./design-system-provider.template";
