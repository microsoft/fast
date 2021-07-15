var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    attr,
    css,
    html,
    nullableNumberConverter,
    Observable,
    observable,
} from "@microsoft/fast-element";
import {
    display,
    forcedColorsStylesheetBehavior,
    FoundationElement,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { SwatchRGB } from "../color/swatch";
import {
    accentFillActiveDelta,
    accentFillFocusDelta,
    accentFillHoverDelta,
    accentFillRestDelta,
    accentForegroundActiveDelta,
    accentForegroundFocusDelta,
    accentForegroundHoverDelta,
    accentForegroundRestDelta,
    accentPalette,
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
    neutralPalette,
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
const swatchConverter = {
    toView(value) {
        var _a;
        if (value === null || value === undefined) {
            return null;
        }
        return (_a = value) === null || _a === void 0 ? void 0 : _a.toColorString();
    },
    fromView(value) {
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
    forcedColorsStylesheetBehavior(css`
        :host {
            background-color: ${SystemColors.ButtonFace};
            box-shadow: 0 0 0 1px ${SystemColors.CanvasText};
            color: ${SystemColors.ButtonText};
        }
    `)
);
function designToken(token) {
    return (source, key) => {
        source[key + "Changed"] = function (prev, next) {
            if (next !== undefined && next !== null) {
                token.setValueFor(this, next);
            } else {
                token.deleteValueFor(this);
            }
        };
    };
}
/**
 * The FAST DesignSystemProvider Element.
 * @public
 */
export class DesignSystemProvider extends FoundationElement {
    constructor() {
        super();
        /**
         * Used to instruct the FASTDesignSystemProvider
         * that it should not set the CSS
         * background-color and color properties
         *
         * @remarks
         * HTML boolean attribute: no-paint
         */
        this.noPaint = false;
        // If fillColor changes or is removed, we need to
        // re-evaluate whether we should have paint styles applied
        Observable.getNotifier(this).subscribe(
            {
                handleChange: this.noPaintChanged.bind(this),
            },
            "fillColor"
        );
    }
    noPaintChanged() {
        if (!this.noPaint && this.fillColor !== void 0) {
            this.$fastController.addStyles(backgroundStyles);
        } else {
            this.$fastController.removeStyles(backgroundStyles);
        }
    }
}
__decorate(
    [attr({ attribute: "no-paint", mode: "boolean" })],
    DesignSystemProvider.prototype,
    "noPaint",
    void 0
);
__decorate(
    [
        attr({
            attribute: "fill-color",
            converter: swatchConverter,
        }),
        designToken(fillColor),
    ],
    DesignSystemProvider.prototype,
    "fillColor",
    void 0
);
__decorate(
    [observable, designToken(neutralPalette)],
    DesignSystemProvider.prototype,
    "neutralPalette",
    void 0
);
__decorate(
    [observable, designToken(accentPalette)],
    DesignSystemProvider.prototype,
    "accentPalette",
    void 0
);
__decorate(
    [
        attr({
            converter: nullableNumberConverter,
        }),
        designToken(density),
    ],
    DesignSystemProvider.prototype,
    "density",
    void 0
);
__decorate(
    [
        attr({
            attribute: "design-unit",
            converter: nullableNumberConverter,
        }),
        designToken(designUnit),
    ],
    DesignSystemProvider.prototype,
    "designUnit",
    void 0
);
__decorate(
    [
        attr({
            attribute: "direction",
        }),
        designToken(direction),
    ],
    DesignSystemProvider.prototype,
    "direction",
    void 0
);
__decorate(
    [
        attr({
            attribute: "base-height-multiplier",
            converter: nullableNumberConverter,
        }),
        designToken(baseHeightMultiplier),
    ],
    DesignSystemProvider.prototype,
    "baseHeightMultiplier",
    void 0
);
__decorate(
    [
        attr({
            attribute: "base-horizontal-spacing-multiplier",
            converter: nullableNumberConverter,
        }),
        designToken(baseHorizontalSpacingMultiplier),
    ],
    DesignSystemProvider.prototype,
    "baseHorizontalSpacingMultiplier",
    void 0
);
__decorate(
    [
        attr({
            attribute: "control-corner-radius",
            converter: nullableNumberConverter,
        }),
        designToken(controlCornerRadius),
    ],
    DesignSystemProvider.prototype,
    "controlCornerRadius",
    void 0
);
__decorate(
    [
        attr({
            attribute: "stroke-width",
            converter: nullableNumberConverter,
        }),
        designToken(strokeWidth),
    ],
    DesignSystemProvider.prototype,
    "strokeWidth",
    void 0
);
__decorate(
    [
        attr({
            attribute: "focus-stroke-width",
            converter: nullableNumberConverter,
        }),
        designToken(focusStrokeWidth),
    ],
    DesignSystemProvider.prototype,
    "focusStrokeWidth",
    void 0
);
__decorate(
    [
        attr({
            attribute: "disabled-opacity",
            converter: nullableNumberConverter,
        }),
        designToken(disabledOpacity),
    ],
    DesignSystemProvider.prototype,
    "disabledOpacity",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-minus-2-font-size",
        }),
        designToken(typeRampMinus2FontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampMinus2FontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-minus-2-line-height",
        }),
        designToken(typeRampMinus2LineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampMinus2LineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-minus-1-font-size",
        }),
        designToken(typeRampMinus1FontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampMinus1FontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-minus-1-line-height",
        }),
        designToken(typeRampMinus1LineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampMinus1LineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-base-font-size",
        }),
        designToken(typeRampBaseFontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampBaseFontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-base-line-height",
        }),
        designToken(typeRampBaseLineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampBaseLineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-1-font-size",
        }),
        designToken(typeRampPlus1FontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus1FontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-1-line-height",
        }),
        designToken(typeRampPlus1LineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus1LineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-2-font-size",
        }),
        designToken(typeRampPlus2FontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus2FontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-2-line-height",
        }),
        designToken(typeRampPlus2LineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus2LineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-3-font-size",
        }),
        designToken(typeRampPlus3FontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus3FontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-3-line-height",
        }),
        designToken(typeRampPlus3LineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus3LineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-4-font-size",
        }),
        designToken(typeRampPlus4FontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus4FontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-4-line-height",
        }),
        designToken(typeRampPlus4LineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus4LineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-5-font-size",
        }),
        designToken(typeRampPlus5FontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus5FontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-5-line-height",
        }),
        designToken(typeRampPlus5LineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus5LineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-6-font-size",
        }),
        designToken(typeRampPlus6FontSize),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus6FontSize",
    void 0
);
__decorate(
    [
        attr({
            attribute: "type-ramp-plus-6-line-height",
        }),
        designToken(typeRampPlus6LineHeight),
    ],
    DesignSystemProvider.prototype,
    "typeRampPlus6LineHeight",
    void 0
);
__decorate(
    [
        attr({
            attribute: "accent-fill-rest-delta",
            converter: nullableNumberConverter,
        }),
        designToken(accentFillRestDelta),
    ],
    DesignSystemProvider.prototype,
    "accentFillRestDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "accent-fill-hover-delta",
            converter: nullableNumberConverter,
        }),
        designToken(accentFillHoverDelta),
    ],
    DesignSystemProvider.prototype,
    "accentFillHoverDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "accent-fill-active-delta",
            converter: nullableNumberConverter,
        }),
        designToken(accentFillActiveDelta),
    ],
    DesignSystemProvider.prototype,
    "accentFillActiveDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "accent-fill-focus-delta",
            converter: nullableNumberConverter,
        }),
        designToken(accentFillFocusDelta),
    ],
    DesignSystemProvider.prototype,
    "accentFillFocusDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "accent-foreground-rest-delta",
            converter: nullableNumberConverter,
        }),
        designToken(accentForegroundRestDelta),
    ],
    DesignSystemProvider.prototype,
    "accentForegroundRestDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "accent-foreground-hover-delta",
            converter: nullableNumberConverter,
        }),
        designToken(accentForegroundHoverDelta),
    ],
    DesignSystemProvider.prototype,
    "accentForegroundHoverDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "accent-foreground-active-delta",
            converter: nullableNumberConverter,
        }),
        designToken(accentForegroundActiveDelta),
    ],
    DesignSystemProvider.prototype,
    "accentForegroundActiveDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "accent-foreground-focus-delta",
            converter: nullableNumberConverter,
        }),
        designToken(accentForegroundFocusDelta),
    ],
    DesignSystemProvider.prototype,
    "accentForegroundFocusDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-rest-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillRestDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillRestDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-hover-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillHoverDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillHoverDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-active-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillActiveDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillActiveDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-focus-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillFocusDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillFocusDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-input-rest-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillInputRestDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillInputRestDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-input-hover-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillInputHoverDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillInputHoverDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-input-active-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillInputActiveDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillInputActiveDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-input-focus-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillInputFocusDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillInputFocusDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-stealth-rest-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillStealthRestDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillStealthRestDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-stealth-hover-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillStealthHoverDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillStealthHoverDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-stealth-active-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillStealthActiveDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillStealthActiveDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-stealth-focus-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillStealthFocusDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillStealthFocusDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-strong-hover-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillStrongHoverDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillStrongHoverDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-strong-active-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillStrongActiveDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillStrongActiveDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-strong-focus-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillStrongFocusDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillStrongFocusDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "base-layer-luminance",
            converter: nullableNumberConverter,
        }),
        designToken(baseLayerLuminance),
    ],
    DesignSystemProvider.prototype,
    "baseLayerLuminance",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-fill-layer-rest-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralFillLayerRestDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralFillLayerRestDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-stroke-divider-rest-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralStrokeDividerRestDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralStrokeDividerRestDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-stroke-rest-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralStrokeRestDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralStrokeRestDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-stroke-hover-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralStrokeHoverDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralStrokeHoverDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-stroke-active-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralStrokeActiveDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralStrokeActiveDelta",
    void 0
);
__decorate(
    [
        attr({
            attribute: "neutral-stroke-focus-delta",
            converter: nullableNumberConverter,
        }),
        designToken(neutralStrokeFocusDelta),
    ],
    DesignSystemProvider.prototype,
    "neutralStrokeFocusDelta",
    void 0
);
/**
A function that returns a {@link @microsoft/fast-foundation#DesignSystemProvider} registration for configuring the component with a DesignSystem. *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-design-system-provider\>
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
