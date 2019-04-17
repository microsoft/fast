// tslint:disable:prefer-for-of

import { QuantizedColor } from "./color-quantization";
import { ColorHSL } from "./color-hsl";
import { rgbToHSL } from "./color-converters";

export interface PaletteEntryConstraint {
    id: string;
    targetSaturation: number;
    minSaturation: number;
    maxSaturation: number;
    targetLuminosity: number;
    minLuminosity: number;
    maxLuminosity: number;
}

export interface PaletteEntry {
    found: boolean;
    constraint: PaletteEntryConstraint;
    color?: QuantizedColor;
}

export interface PaletteExtractionConfig {
    saturationWeight: number;
    luminosityWeight: number;
    populationWeight: number;
    volumeWeight: number;
    constraints: PaletteEntryConstraint[];
}

export const defaultPaletteExtractionConfig: PaletteExtractionConfig = {
    saturationWeight: 6,
    luminosityWeight: 3,
    populationWeight: 1,
    volumeWeight: 0.1,
    constraints: [
        {
            id: "Vibrant",
            targetSaturation: 1,
            minSaturation: 0.35,
            maxSaturation: 1,
            targetLuminosity: 0.5,
            minLuminosity: 0.3,
            maxLuminosity: 0.7,
        },
        {
            id: "LightVibrant",
            targetSaturation: 1,
            minSaturation: 0.35,
            maxSaturation: 1,
            targetLuminosity: 0.74,
            minLuminosity: 0.55,
            maxLuminosity: 1,
        },
        {
            id: "DarkVibrant",
            targetSaturation: 1,
            minSaturation: 0.35,
            maxSaturation: 1,
            targetLuminosity: 0.26,
            minLuminosity: 0,
            maxLuminosity: 0.45,
        },
        {
            id: "Muted",
            targetSaturation: 0.3,
            minSaturation: 0,
            maxSaturation: 0.4,
            targetLuminosity: 0.5,
            minLuminosity: 0.3,
            maxLuminosity: 0.7,
        },
        {
            id: "LightMuted",
            targetSaturation: 0.3,
            minSaturation: 0,
            maxSaturation: 0.4,
            targetLuminosity: 0.74,
            minLuminosity: 0.55,
            maxLuminosity: 1,
        },
        {
            id: "DarkMuted",
            targetSaturation: 0.3,
            minSaturation: 0,
            maxSaturation: 0.4,
            targetLuminosity: 0.26,
            minLuminosity: 0,
            maxLuminosity: 0.45,
        },
    ],
};

export function extractPalette(
    colors: QuantizedColor[],
    config: PaletteExtractionConfig = defaultPaletteExtractionConfig
): PaletteEntry[] {
    if (config.constraints.length === 0) {
        return [];
    }

    let totalPixelCount: number = 0;
    let totalVolume: number = 0;
    for (let i: number = 0; i < colors.length; i++) {
        totalPixelCount += colors[i].pixelCount;
        totalVolume += colors[i].colorVolume;
    }

    const retVal: PaletteEntry[] = new Array(config.constraints.length);
    const bestFitValues: number[] = new Array(config.constraints.length);
    for (let i: number = 0; i < retVal.length; i++) {
        bestFitValues[i] = 0;
        retVal[i] = {
            found: false,
            constraint: config.constraints[i],
        };
    }

    const totalWeight: number =
        config.saturationWeight +
        config.luminosityWeight +
        config.populationWeight +
        config.volumeWeight;
    for (let i: number = 0; i < colors.length; i++) {
        const hsl: ColorHSL = rgbToHSL(colors[i].color);
        for (let j: number = 0; j < config.constraints.length; j++) {
            // Check for min and max saturation / luminosity
            if (
                hsl.s >= config.constraints[j].minSaturation &&
                hsl.s <= config.constraints[j].maxSaturation &&
                hsl.l >= config.constraints[j].minLuminosity &&
                hsl.l <= config.constraints[j].maxLuminosity
            ) {
                const populationFactor: number = colors[i].pixelCount / totalPixelCount;
                const volumeFactor: number = colors[i].colorVolume / totalVolume;
                const saturationFactor: number =
                    1 - Math.abs(hsl.s - config.constraints[j].targetSaturation);
                const luminosityFactor: number =
                    1 - Math.abs(hsl.l - config.constraints[j].targetLuminosity);
                const fitValue: number =
                    (populationFactor * config.populationWeight +
                        volumeFactor * config.volumeWeight +
                        saturationFactor * config.saturationWeight +
                        luminosityFactor * config.luminosityWeight) /
                    totalWeight;

                if (fitValue > bestFitValues[j]) {
                    // Check if this color is already in use
                    let dupe: boolean = false;
                    for (let k: number = 0; k < j; k++) {
                        if (
                            retVal[k].found &&
                            retVal[k].color!.color.equalValue(colors[i].color)
                        ) {
                            dupe = true;
                            break;
                        }
                    }

                    if (!dupe) {
                        bestFitValues[j] = fitValue;
                        retVal[j].found = true;
                        retVal[j].color = colors[i];
                    }
                }
            }
        }
    }

    return retVal;
}
