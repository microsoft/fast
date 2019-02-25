// tslint:disable:member-ordering
// tslint:disable:prefer-for-of

import { blendMultiply, blendOverlay, saturateViaLCH } from "./colorBlending";
import { rgbToHSL } from "./colorConverters";
import { ColorHSL } from "./colorHSL";
import { ColorInterpolationSpace, interpolateByColorSpace } from "./colorInterpolation";
import { ColorRGBA64 } from "./colorRGBA64";
import { ColorScale } from "./colorScale";

export interface ColorPaletteConfig {
    baseColor?: ColorRGBA64;
    steps?: number;
    interpolationMode?: ColorInterpolationSpace;
    scaleColorLight?: ColorRGBA64;
    scaleColorDark?: ColorRGBA64;
    clipLight?: number;
    clipDark?: number;
    saturationAdjustmentCutoff?: number;
    saturationLight?: number;
    saturationDark?: number;
    overlayLight?: number;
    overlayDark?: number;
    multiplyLight?: number;
    multiplyDark?: number;
}

export class ColorPalette {
    public static readonly defaultPaletteConfig: ColorPaletteConfig = {
        baseColor: new ColorRGBA64(0.5, 0.5, 0.5, 1),
        steps: 7,
        interpolationMode: ColorInterpolationSpace.RGB,
        scaleColorLight: new ColorRGBA64(1, 1, 1, 1),
        scaleColorDark: new ColorRGBA64(0, 0, 0, 1),
        clipLight: 0.185,
        clipDark: 0.16,
        saturationAdjustmentCutoff: 0.05,
        saturationLight: 0.35,
        saturationDark: 1.25,
        overlayLight: 0,
        overlayDark: 0.25,
        multiplyLight: 0,
        multiplyDark: 0,
    };

    constructor(config: ColorPaletteConfig) {
        this.config = Object.assign({}, ColorPalette.defaultPaletteConfig, config);
        this.palette = [];
        this.updatePaletteColors();
    }

    private readonly config: ColorPaletteConfig;
    public readonly palette: ColorRGBA64[];

    public updatePaletteGenerationValues(newConfig: ColorPaletteConfig): boolean {
        let changed: boolean = false;
        for (const key in newConfig) {
            if (this.config[key]) {
                if (this.config[key].equalValue) {
                    if (!this.config[key].equalValue(newConfig[key])) {
                        this.config[key] = newConfig[key];
                        changed = true;
                    }
                } else {
                    if (newConfig[key] !== this.config[key]) {
                        this.config[key] = newConfig[key];
                        changed = true;
                    }
                }
            }
        }
        if (changed) {
            this.updatePaletteColors();
        }
        return changed;
    }

    private updatePaletteColors(): void {
        const scale: ColorScale = this.generatePaletteColorScale();
        for (let i: number = 0; i < this.config.steps; i++) {
            this.palette[i] = scale.getColor(
                i / (this.config.steps - 1),
                this.config.interpolationMode
            );
        }
    }

    public generatePaletteColorScale(): ColorScale {
        const baseColorHSL: ColorHSL = rgbToHSL(this.config.baseColor);
        const baseScale: ColorScale = new ColorScale([
            { position: 0, color: this.config.scaleColorLight },
            { position: 0.5, color: this.config.baseColor },
            { position: 1, color: this.config.scaleColorDark },
        ]);
        const trimmedScale: ColorScale = baseScale.trim(
            this.config.clipLight,
            1 - this.config.clipDark
        );
        const trimmedLight: ColorRGBA64 = trimmedScale.getColor(0);
        const trimmedDark: ColorRGBA64 = trimmedScale.getColor(1);
        let adjustedLight: ColorRGBA64 = trimmedLight;
        let adjustedDark: ColorRGBA64 = trimmedDark;

        if (baseColorHSL.s >= this.config.saturationAdjustmentCutoff) {
            adjustedLight = saturateViaLCH(adjustedLight, this.config.saturationLight);
            adjustedDark = saturateViaLCH(adjustedDark, this.config.saturationDark);
        }

        if (this.config.multiplyLight !== 0) {
            const multiply: ColorRGBA64 = blendMultiply(
                this.config.baseColor,
                adjustedLight
            );
            adjustedLight = interpolateByColorSpace(
                this.config.multiplyLight,
                this.config.interpolationMode,
                adjustedLight,
                multiply
            );
        }

        if (this.config.multiplyDark !== 0) {
            const multiply: ColorRGBA64 = blendMultiply(
                this.config.baseColor,
                adjustedDark
            );
            adjustedDark = interpolateByColorSpace(
                this.config.multiplyDark,
                this.config.interpolationMode,
                adjustedDark,
                multiply
            );
        }

        if (this.config.overlayLight !== 0) {
            const overlay: ColorRGBA64 = blendOverlay(
                this.config.baseColor,
                adjustedLight
            );
            adjustedLight = interpolateByColorSpace(
                this.config.overlayLight,
                this.config.interpolationMode,
                adjustedLight,
                overlay
            );
        }

        if (this.config.overlayDark !== 0) {
            const overlay: ColorRGBA64 = blendOverlay(
                this.config.baseColor,
                adjustedDark
            );
            adjustedDark = interpolateByColorSpace(
                this.config.overlayDark,
                this.config.interpolationMode,
                adjustedDark,
                overlay
            );
        }

        return new ColorScale([
            { position: 0, color: adjustedLight.clamp() },
            { position: 0.5, color: this.config.baseColor },
            { position: 1, color: adjustedDark.clamp() },
        ]);
    }
}
