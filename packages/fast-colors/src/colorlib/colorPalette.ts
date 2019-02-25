// tslint:disable:member-ordering
// tslint:disable:prefer-for-of
// tslint:disable:interface-name

import { blendMultiply, blendOverlay, saturateViaLCH } from "./colorBlending";
import { rgbToHSL } from "./colorConverters";
import { ColorHSL } from "./colorHSL";
import { ColorInterpolationSpace, interpolateByColorSpace } from "./colorInterpolation";
import { ColorRGBA64 } from "./colorRGBA64";
import { ColorScale } from "./colorScale";

export interface IColorPaletteConfig {
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
    public static readonly defaultPaletteConfig: IColorPaletteConfig = {
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

    constructor(config: IColorPaletteConfig) {
        this.config = {
            baseColor: config.baseColor
                ? config.baseColor
                : ColorPalette.defaultPaletteConfig.baseColor,
            steps: config.steps ? config.steps : ColorPalette.defaultPaletteConfig.steps,
            interpolationMode: config.interpolationMode
                ? config.interpolationMode
                : ColorPalette.defaultPaletteConfig.interpolationMode,
            scaleColorLight: config.scaleColorLight
                ? config.scaleColorLight
                : ColorPalette.defaultPaletteConfig.scaleColorLight,
            scaleColorDark: config.scaleColorDark
                ? config.scaleColorDark
                : ColorPalette.defaultPaletteConfig.scaleColorDark,
            clipLight: config.clipLight
                ? config.clipLight
                : ColorPalette.defaultPaletteConfig.clipLight,
            clipDark: config.clipDark
                ? config.clipDark
                : ColorPalette.defaultPaletteConfig.clipDark,
            saturationAdjustmentCutoff: config.saturationAdjustmentCutoff
                ? config.saturationAdjustmentCutoff
                : ColorPalette.defaultPaletteConfig.saturationAdjustmentCutoff,
            saturationLight: config.saturationLight
                ? config.saturationLight
                : ColorPalette.defaultPaletteConfig.saturationLight,
            saturationDark: config.saturationDark
                ? config.saturationDark
                : ColorPalette.defaultPaletteConfig.saturationDark,
            overlayLight: config.overlayLight
                ? config.overlayLight
                : ColorPalette.defaultPaletteConfig.overlayLight,
            overlayDark: config.overlayDark
                ? config.overlayDark
                : ColorPalette.defaultPaletteConfig.overlayDark,
            multiplyLight: config.multiplyLight
                ? config.multiplyLight
                : ColorPalette.defaultPaletteConfig.multiplyLight,
            multiplyDark: config.multiplyDark
                ? config.multiplyDark
                : ColorPalette.defaultPaletteConfig.multiplyDark,
        };

        this.palette = [];
        this.updatePaletteColors();
    }

    private readonly config: IColorPaletteConfig;
    public readonly palette: ColorRGBA64[];

    public updatePaletteGenerationValues(newConfig: IColorPaletteConfig): boolean {
        let changed: boolean = false;
        if (
            newConfig.interpolationMode &&
            newConfig.interpolationMode !== this.config.interpolationMode
        ) {
            this.config.interpolationMode = newConfig.interpolationMode;
            changed = true;
        }
        if (
            newConfig.scaleColorLight &&
            !newConfig.scaleColorLight.equalValue(this.config.scaleColorLight)
        ) {
            this.config.scaleColorLight = newConfig.scaleColorLight;
            changed = true;
        }
        if (
            newConfig.scaleColorDark &&
            !newConfig.scaleColorDark.equalValue(this.config.scaleColorDark)
        ) {
            this.config.scaleColorDark = newConfig.scaleColorDark;
            changed = true;
        }
        if (newConfig.clipLight && newConfig.clipLight !== this.config.clipLight) {
            this.config.clipLight = newConfig.clipLight;
            changed = true;
        }
        if (newConfig.clipDark && newConfig.clipDark !== this.config.clipDark) {
            this.config.clipDark = newConfig.clipDark;
            changed = true;
        }
        if (
            newConfig.saturationAdjustmentCutoff &&
            newConfig.saturationAdjustmentCutoff !==
                this.config.saturationAdjustmentCutoff
        ) {
            this.config.saturationAdjustmentCutoff = newConfig.saturationAdjustmentCutoff;
            changed = true;
        }
        if (
            newConfig.saturationLight &&
            newConfig.saturationLight !== this.config.saturationLight
        ) {
            this.config.saturationLight = newConfig.saturationLight;
            changed = true;
        }
        if (
            newConfig.saturationDark &&
            newConfig.saturationDark !== this.config.saturationDark
        ) {
            this.config.saturationDark = newConfig.saturationDark;
            changed = true;
        }
        if (
            newConfig.overlayLight &&
            newConfig.overlayLight !== this.config.overlayLight
        ) {
            this.config.overlayLight = newConfig.overlayLight;
            changed = true;
        }
        if (newConfig.overlayDark && newConfig.overlayDark !== this.config.overlayDark) {
            this.config.overlayDark = newConfig.overlayDark;
            changed = true;
        }
        if (
            newConfig.multiplyLight &&
            newConfig.multiplyLight !== this.config.multiplyLight
        ) {
            this.config.multiplyLight = newConfig.multiplyLight;
            changed = true;
        }
        if (
            newConfig.multiplyDark &&
            newConfig.multiplyDark !== this.config.multiplyDark
        ) {
            this.config.multiplyDark = newConfig.multiplyDark;
            changed = true;
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
