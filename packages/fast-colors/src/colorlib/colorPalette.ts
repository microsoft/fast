// tslint:disable:member-ordering
// tslint:disable:prefer-for-of

import { blendMultiply, blendOverlay, saturateViaLCH } from "./colorBlending";
import { rgbToHSL } from "./colorConverters";
import { ColorHSL } from "./colorHSL";
import { ColorInterpolationSpace, interpolateByColorSpace } from "./colorInterpolation";
import { ColorRGBA64 } from "./colorRGBA64";
import { ColorScale } from "./colorScale";

export class ColorPalette {
    public static readonly defaultSteps: number = 7;
    public static readonly defaultInterpolationMode: ColorInterpolationSpace =
        ColorInterpolationSpace.RGB;
    public static readonly defaultScaleColorLight: ColorRGBA64 = new ColorRGBA64(
        1,
        1,
        1,
        1
    );
    public static readonly defaultScaleColorDark: ColorRGBA64 = new ColorRGBA64(
        0,
        0,
        0,
        1
    );
    public static readonly defaultClipLight: number = 0.185;
    public static readonly defaultClipDark: number = 0.16;
    public static readonly defaultSaturationAdjustmentCutoff: number = 0.05;
    public static readonly defaultSaturationLight: number = 0.35;
    public static readonly defaultSaturationDark: number = 1.25;
    public static readonly defaultOverlayLight: number = 0;
    public static readonly defaultOverlayDark: number = 0.25;
    public static readonly defaultMultiplyLight: number = 0;
    public static readonly defaultMultiplyDark: number = 0;

    constructor(
        baseColor: ColorRGBA64,
        steps: number,
        interpolationMode: ColorInterpolationSpace | null = null,
        scaleColorLight: ColorRGBA64 | null = null,
        scaleColorDark: ColorRGBA64 | null = null,
        clipLight: number | null = null,
        clipDark: number | null = null,
        saturationAdjustmentCutoff: number | null = null,
        saturationLight: number | null = null,
        saturationDark: number | null = null,
        overlayLight: number | null = null,
        overlayDark: number | null = null,
        multiplyLight: number | null = null,
        multiplyDark: number | null = null
    ) {
        this.baseColor = baseColor;
        this.steps = steps;
        this.palette = [];
        if (
            !this.updatePaletteGenerationValues(
                interpolationMode,
                scaleColorLight,
                scaleColorDark,
                clipLight,
                clipDark,
                saturationAdjustmentCutoff,
                saturationLight,
                saturationDark,
                overlayLight,
                overlayDark,
                multiplyLight,
                multiplyDark
            )
        ) {
            this.updatePaletteColors();
        }
    }

    public readonly baseColor: ColorRGBA64;
    public readonly steps: number;
    public readonly palette: ColorRGBA64[];

    private interpolationMode: ColorInterpolationSpace =
        ColorPalette.defaultInterpolationMode;
    private scaleColorLight: ColorRGBA64 = ColorPalette.defaultScaleColorLight;
    private scaleColorDark: ColorRGBA64 = ColorPalette.defaultScaleColorDark;
    private clipLight: number = ColorPalette.defaultClipLight;
    private clipDark: number = ColorPalette.defaultClipDark;
    private saturationAdjustmentCutoff: number =
        ColorPalette.defaultSaturationAdjustmentCutoff;
    private saturationLight: number = ColorPalette.defaultSaturationLight;
    private saturationDark: number = ColorPalette.defaultSaturationDark;
    private overlayLight: number = ColorPalette.defaultOverlayLight;
    private overlayDark: number = ColorPalette.defaultOverlayDark;
    private multiplyLight: number = ColorPalette.defaultMultiplyLight;
    private multiplyDark: number = ColorPalette.defaultMultiplyDark;

    public updatePaletteGenerationValues(
        interpolationMode: ColorInterpolationSpace | null,
        scaleColorLight: ColorRGBA64 | null,
        scaleColorDark: ColorRGBA64 | null,
        clipLight: number | null,
        clipDark: number | null,
        saturationAdjustmentCutoff: number | null,
        saturationLight: number | null,
        saturationDark: number | null,
        overlayLight: number | null,
        overlayDark: number | null,
        multiplyLight: number | null,
        multiplyDark: number | null
    ): boolean {
        let changed: boolean = false;
        if (interpolationMode != null && interpolationMode !== this.interpolationMode) {
            this.interpolationMode = interpolationMode;
            changed = true;
        }
        if (
            scaleColorLight != null &&
            !this.scaleColorLight.equalValue(scaleColorLight)
        ) {
            this.scaleColorLight = scaleColorLight;
            changed = true;
        }
        if (scaleColorDark != null && !this.scaleColorDark.equalValue(scaleColorDark)) {
            this.scaleColorDark = scaleColorDark;
            changed = true;
        }
        if (clipLight != null && this.clipLight !== clipLight) {
            this.clipLight = clipLight;
            changed = true;
        }
        if (clipDark != null && this.clipDark !== clipDark) {
            this.clipDark = clipDark;
            changed = true;
        }
        if (
            saturationAdjustmentCutoff != null &&
            this.saturationAdjustmentCutoff !== saturationAdjustmentCutoff
        ) {
            this.saturationAdjustmentCutoff = saturationAdjustmentCutoff;
            changed = true;
        }
        if (saturationLight != null && this.saturationLight !== saturationLight) {
            this.saturationLight = saturationLight;
            changed = true;
        }
        if (saturationDark != null && this.saturationDark !== saturationDark) {
            this.saturationDark = saturationDark;
            changed = true;
        }
        if (overlayLight != null && this.overlayLight !== overlayLight) {
            this.overlayLight = overlayLight;
            changed = true;
        }
        if (overlayDark != null && this.overlayDark !== overlayDark) {
            this.overlayDark = overlayDark;
            changed = true;
        }
        if (multiplyLight != null && this.multiplyLight !== multiplyLight) {
            this.multiplyLight = multiplyLight;
            changed = true;
        }
        if (multiplyDark != null && this.multiplyDark !== multiplyDark) {
            this.multiplyDark = multiplyDark;
            changed = true;
        }
        if (changed) {
            this.updatePaletteColors();
        }
        return changed;
    }

    private updatePaletteColors(): void {
        const scale: ColorScale = this.generatePaletteColorScale();
        for (let i: number = 0; i < this.steps; i++) {
            this.palette[i] = scale.getColor(
                i / (this.steps - 1),
                this.interpolationMode
            );
        }
    }

    public generatePaletteColorScale(): ColorScale {
        const baseColorHSL: ColorHSL = rgbToHSL(this.baseColor);
        const baseScale: ColorScale = new ColorScale([
            { position: 0, color: this.scaleColorLight },
            { position: 0.5, color: this.baseColor },
            { position: 1, color: this.scaleColorDark },
        ]);
        const trimmedScale: ColorScale = baseScale.trim(
            this.clipLight,
            1 - this.clipDark
        );
        const trimmedLight: ColorRGBA64 = trimmedScale.getColor(0);
        const trimmedDark: ColorRGBA64 = trimmedScale.getColor(1);
        let adjustedLight: ColorRGBA64 = trimmedLight;
        let adjustedDark: ColorRGBA64 = trimmedDark;

        if (baseColorHSL.s >= this.saturationAdjustmentCutoff) {
            adjustedLight = saturateViaLCH(adjustedLight, this.saturationLight);
            adjustedDark = saturateViaLCH(adjustedDark, this.saturationDark);
        }

        if (this.multiplyLight !== 0) {
            const multiply: ColorRGBA64 = blendMultiply(this.baseColor, adjustedLight);
            adjustedLight = interpolateByColorSpace(
                this.multiplyLight,
                this.interpolationMode,
                adjustedLight,
                multiply
            );
        }

        if (this.multiplyDark !== 0) {
            const multiply: ColorRGBA64 = blendMultiply(this.baseColor, adjustedDark);
            adjustedDark = interpolateByColorSpace(
                this.multiplyDark,
                this.interpolationMode,
                adjustedDark,
                multiply
            );
        }

        if (this.overlayLight !== 0) {
            const overlay: ColorRGBA64 = blendOverlay(this.baseColor, adjustedLight);
            adjustedLight = interpolateByColorSpace(
                this.overlayLight,
                this.interpolationMode,
                adjustedLight,
                overlay
            );
        }

        if (this.overlayDark !== 0) {
            const overlay: ColorRGBA64 = blendOverlay(this.baseColor, adjustedDark);
            adjustedDark = interpolateByColorSpace(
                this.overlayDark,
                this.interpolationMode,
                adjustedDark,
                overlay
            );
        }

        return new ColorScale([
            { position: 0, color: adjustedLight.clamp() },
            { position: 0.5, color: this.baseColor },
            { position: 1, color: adjustedDark.clamp() },
        ]);
    }
}
