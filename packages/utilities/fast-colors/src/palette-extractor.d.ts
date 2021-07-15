import { QuantizedColor } from "./color-quantization";
/**
 * @public
 */
export interface PaletteEntryConstraint {
    id: string;
    targetSaturation: number;
    minSaturation: number;
    maxSaturation: number;
    targetLuminosity: number;
    minLuminosity: number;
    maxLuminosity: number;
}
/**
 * @public
 */
export interface PaletteEntry {
    found: boolean;
    constraint: PaletteEntryConstraint;
    color?: QuantizedColor;
}
/**
 * Configuration structure for palette extraction.
 * @public
 */
export interface PaletteExtractionConfig {
    saturationWeight: number;
    luminosityWeight: number;
    populationWeight: number;
    volumeWeight: number;
    constraints: PaletteEntryConstraint[];
}
/**
 * The default configuration for palette extraction.
 * @public
 */
export declare const defaultPaletteExtractionConfig: PaletteExtractionConfig;
/**
 * Extracts a palette.
 * @param colors - the quantized colors
 * @param config - the extraction config
 * @public
 */
export declare function extractPalette(
    colors: QuantizedColor[],
    config?: PaletteExtractionConfig
): PaletteEntry[];
