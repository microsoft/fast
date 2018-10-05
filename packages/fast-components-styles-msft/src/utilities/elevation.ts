import Chroma from "chroma-js";
import { toPx } from "@microsoft/fast-jss-utilities";
import { CSSRules } from "@microsoft/fast-jss-manager";
import designSystemDefaults, { DesignSystem } from "../design-system";
import { density } from "./density";

/**
 * Shadow config
 */
export interface ShadowConfig {
    blurMultiplier: number;
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
    e17 = 192
}

/**
 * Ambient shadow config
 */
export const ambientShadowConfig: ShadowConfig = {
    blurMultiplier: 0.225,
    xOffsetMultiplier: 0,
    yOffsetMultiplier: 0.075,
    opacity: 0.18
};

/**
 * Directional shadow config
 */
export const directionalShadowConfig: ShadowConfig = {
    blurMultiplier: 0.9,
    xOffsetMultiplier: 0,
    yOffsetMultiplier: 0.4,
    opacity: 0.22
};

/**
 * Apply elevation
 * Used to apply elevation shadow treatment to a component
 */
export function elevation(
    elevationValue: ElevationMultiplier | number,
    color: string = designSystemDefaults.foregroundColor
): (config: DesignSystem) => CSSRules<DesignSystem> {
    return (config: DesignSystem): CSSRules<DesignSystem> => {
        const ambientShadow: string = elevationShadow(elevationValue, color, ambientShadowConfig)(config);
        const directionalShadow: string = elevationShadow(elevationValue, color, directionalShadowConfig)(config);

        return {
            boxShadow: `${directionalShadow}, ${ambientShadow}`
        };
    };
}

/**
 * Generate Elevation Shadow
 * Generates a string representing a box shadow value
 */
export function elevationShadow(elevationValue: number, color: string, shadowConfig: ShadowConfig): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const xOffset: string = density(shadowConfig.xOffsetMultiplier * elevationValue)(config);
        const yOffset: string = density(shadowConfig.yOffsetMultiplier * elevationValue)(config);
        const blur: string = density(shadowConfig.blurMultiplier * elevationValue)(config);
        const opacity: number = shadowConfig.opacity;

        return `${xOffset} ${yOffset} ${blur} ${Chroma(color).alpha(opacity).css()}`;
    };
}
