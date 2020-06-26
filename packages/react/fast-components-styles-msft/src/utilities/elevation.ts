import { toPx } from "@microsoft/fast-jss-utilities";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { ColorRGBA64, rgbToRelativeLuminance } from "@microsoft/fast-colors";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { black } from "../utilities/color/color-constants";
import { parseColorString } from "../utilities/color/common";
import { backgroundColor } from "./design-system";

/**
 * Shadow config
 */
export interface ShadowConfig {
    blurMultiplier: number;
    blurBase?: number;
    opacity: number;
    xOffsetMultiplier: number;
    yOffsetMultiplier: number;
}

/**
 * The MSFT elevation values
 */
export enum ElevationMultiplier {
    e1 = 1,
    e2 = 2,
    e3 = 3,
    e4 = 4,
    e5 = 6,
    e6 = 8,
    e7 = 9,
    e8 = 12,
    e9 = 16,
    e10 = 24,
    e11 = 32,
    e12 = 40,
    e13 = 48,
    e14 = 64,
    e15 = 80,
    e16 = 96,
    e17 = 192,
}

/**
 * Ambient shadow config
 */
export const ambientShadowConfig: ShadowConfig = {
    blurMultiplier: 0.225,
    blurBase: 2,
    xOffsetMultiplier: 0,
    yOffsetMultiplier: 0,
    opacity: 0.11,
};

/**
 * Directional shadow config
 */
export const directionalShadowConfig: ShadowConfig = {
    blurMultiplier: 0.9,
    blurBase: 0,
    xOffsetMultiplier: 0,
    yOffsetMultiplier: 0.4,
    opacity: 0.13,
};

/**
 * Generate Elevation Shadow
 * Generates a string representing a box shadow value
 */
export function elevationShadow(
    elevationValue: number,
    color: string,
    shadowConfig: ShadowConfig
): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const { r, g, b }: ColorRGBA64 = parseColorString(color);
        const {
            xOffsetMultiplier,
            yOffsetMultiplier,
            opacity,
            blurMultiplier,
            blurBase = 0,
        }: ShadowConfig = shadowConfig;
        // TODO: (Breaking) Remove default https://github.com/microsoft/fast/issues/2469

        const lum: number = rgbToRelativeLuminance(
            parseColorString(backgroundColor(config))
        );
        const opacityMultiple: number = 2 - lum; // white (1) = 1; black (0) = 2;
        return [xOffsetMultiplier, yOffsetMultiplier]
            .map((val: number) => parseFloat((val * elevationValue).toFixed(1)))
            .concat(blurBase + blurMultiplier * elevationValue)
            .map(toPx)
            .concat(new ColorRGBA64(r, g, b, opacity * opacityMultiple).toStringWebRGBA())
            .join(" ");
    };
}

function combinedShadow(
    elevationValue: ElevationMultiplier | number,
    color: string = black
): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string => {
        const fn: (
            conf: ShadowConfig
        ) => DesignSystemResolver<string> = elevationShadow.bind(
            null,
            elevationValue,
            color
        );

        return [directionalShadowConfig, ambientShadowConfig]
            .map((conf: ShadowConfig) => fn(conf)(designSystem))
            .join(", ");
    };
}

/**
 * Apply elevation shadow treatment to a component.
 *
 * @param elevationValue The number of pixels of depth or an ElevationMultiplier value.
 */
export function applyElevation(
    elevationValue: ElevationMultiplier | number
): CSSRules<DesignSystem> {
    return { "box-shadow": combinedShadow(elevationValue) };
}

/**
 * Apply elevation
 * Used to apply elevation shadow treatment to a component
 *
 * @deprecated Use applyElevation.
 */
export function elevation(
    elevationValue: ElevationMultiplier | number,
    color: string = black
): (config: DesignSystem) => CSSRules<DesignSystem> {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    return (config: DesignSystem): CSSRules<DesignSystem> => {
        return {
            "box-shadow": combinedShadow(elevationValue, color),
        };
    };
}
