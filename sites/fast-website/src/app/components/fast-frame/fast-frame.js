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
import { FASTElement, attr, observable, DOM } from "@microsoft/fast-element";
import {
    StandardLuminance,
    PaletteRGB,
    SwatchRGB,
    baseLayerLuminance,
    neutralPalette,
    accentPalette,
    fillColor,
    density,
    baseHeightMultiplier,
    baseHorizontalSpacingMultiplier,
    controlCornerRadius,
    strokeWidth,
    neutralLayerCardContainer,
} from "@microsoft/fast-components";
import { RadioGroup, Slider } from "@microsoft/fast-foundation";
import { ColorHSL, hslToRGB, parseColorHexRGB, rgbToHSL } from "@microsoft/fast-colors";
export const drawerBreakpoint = "660px";
export class FastFrame extends FASTElement {
    constructor() {
        super();
        this.accentColor = "#F33378";
        this.darkMode = true;
        this.baseLayerLuminance = StandardLuminance.DarkMode;
        this.previewNeutralPalette = [
            "#808080",
            "#35719F",
            "#2D5F2D",
            "#5D437C",
            "#A35436",
        ];
        this.previewAccentPalette = [
            "#F33378",
            "#F34733",
            "#10A7B5",
            "#109B82",
            "#E1A054",
        ];
        this.mql = window.matchMedia(`(max-width: ${drawerBreakpoint})`);
        this.density = 0;
        this.borderRadius = 3;
        this.strokeWidth = 1;
        this.expanded = false;
        this.isMobile = this.mql.matches;
        this.accentChangeHandler = e => {
            if (e.target instanceof RadioGroup) {
                this.accentColor = e.target.value;
                const accentColorHSL = rgbToHSL(parseColorHexRGB(this.accentColor));
                this.hue = accentColorHSL.h;
                this.saturation = accentColorHSL.s;
                this.lightness = accentColorHSL.l;
                const parsedColor = parseColorHexRGB(this.accentColor);
                if (parsedColor) {
                    this.accentPalette = PaletteRGB.create(
                        SwatchRGB.create(parsedColor.r, parsedColor.g, parsedColor.b)
                    );
                }
            }
        };
        this.neutralChangeHandler = e => {
            if (e.target instanceof RadioGroup) {
                const parsedColor = parseColorHexRGB(e.target.value);
                if (parsedColor) {
                    this.neutralPalette = PaletteRGB.create(
                        SwatchRGB.create(parsedColor.r, parsedColor.g, parsedColor.b)
                    );
                }
            }
        };
        this.densityChangeHandler = e => {
            if (e.target instanceof Slider) {
                this.density = parseInt(e.target.value);
            }
        };
        this.borderRadiusChangeHandler = e => {
            if (e.target instanceof Slider) {
                this.borderRadius = parseInt(e.target.value);
            }
        };
        this.strokeWidthChangeHandler = e => {
            if (e.target instanceof Slider) {
                this.strokeWidth = parseInt(e.target.value);
            }
        };
        this.saturationChangeHandler = e => {
            if (e.target instanceof Slider) {
                this.saturation = parseFloat(e.target.value);
            }
            this.updateAccentColor();
        };
        this.hueChangeHandler = e => {
            if (e.target instanceof Slider) {
                this.hue = parseFloat(e.target.value);
            }
            this.updateAccentColor();
        };
        this.handleExpandKeypress = e => {
            this.expanded = !this.expanded;
        };
        this.modeChange = e => {
            this.darkMode = !this.darkMode;
            this.baseLayerLuminance = this.darkMode
                ? StandardLuminance.DarkMode
                : StandardLuminance.LightMode;
        };
        this.resetExpandedResponsive = e => {
            this.expanded = false;
            this.isMobile = e.matches;
        };
        this.setTabIndex = () => (!this.expanded && this.isMobile ? "-1" : "0");
        const accentColorHSL = rgbToHSL(parseColorHexRGB(this.accentColor));
        this.hue = accentColorHSL.h;
        this.saturation = accentColorHSL.s;
        this.lightness = accentColorHSL.l;
        this.mql.addListener(this.resetExpandedResponsive);
    }
    baseLayerLuminanceChanged() {
        if (typeof this.baseLayerLuminance === "number") {
            DOM.queueUpdate(() => {
                baseLayerLuminance.setValueFor(this.preview, this.baseLayerLuminance);
            });
        }
    }
    neutralPaletteChanged() {
        if (this.neutralPalette) {
            DOM.queueUpdate(() => {
                neutralPalette.setValueFor(this.preview, this.neutralPalette);
            });
        }
    }
    accentPaletteChanged() {
        if (this.accentPalette) {
            DOM.queueUpdate(() => {
                accentPalette.setValueFor(this.preview, this.accentPalette);
            });
        }
    }
    densityChanged() {
        DOM.queueUpdate(() => {
            density.setValueFor(this.preview, this.density);
        });
    }
    borderRadiusChanged() {
        DOM.queueUpdate(() => {
            controlCornerRadius.setValueFor(this.preview, this.borderRadius);
        });
    }
    strokeWidthChanged() {
        DOM.queueUpdate(() => {
            strokeWidth.setValueFor(this.preview, this.strokeWidth);
        });
    }
    updateAccentColor() {
        const accentHSL = new ColorHSL(this.hue, this.saturation, this.lightness);
        const accentRGB = hslToRGB(accentHSL);
        this.accentColor = accentRGB.toStringHexRGB();
        this.accentPalette = PaletteRGB.create(
            SwatchRGB.create(accentRGB.r, accentRGB.g, accentRGB.b)
        );
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        fillColor.setValueFor(this.preview, neutralLayerCardContainer);
        density.setValueFor(this, 0);
        baseHeightMultiplier.setValueFor(this, 10);
        baseHorizontalSpacingMultiplier.setValueFor(this, 3);
    }
}
__decorate([observable], FastFrame.prototype, "preview", void 0);
__decorate(
    [attr({ attribute: "accent-color" })],
    FastFrame.prototype,
    "accentColor",
    void 0
);
__decorate([attr], FastFrame.prototype, "darkMode", void 0);
__decorate([attr], FastFrame.prototype, "baseLayerLuminance", void 0);
__decorate([observable], FastFrame.prototype, "previewNeutralPalette", void 0);
__decorate([observable], FastFrame.prototype, "previewAccentPalette", void 0);
__decorate([observable], FastFrame.prototype, "neutralPalette", void 0);
__decorate([observable], FastFrame.prototype, "accentPalette", void 0);
__decorate([observable], FastFrame.prototype, "density", void 0);
__decorate([observable], FastFrame.prototype, "borderRadius", void 0);
__decorate([observable], FastFrame.prototype, "strokeWidth", void 0);
__decorate([observable], FastFrame.prototype, "saturation", void 0);
__decorate([observable], FastFrame.prototype, "hue", void 0);
__decorate([observable], FastFrame.prototype, "lightness", void 0);
__decorate([observable], FastFrame.prototype, "expanded", void 0);
__decorate([observable], FastFrame.prototype, "isMobile", void 0);
