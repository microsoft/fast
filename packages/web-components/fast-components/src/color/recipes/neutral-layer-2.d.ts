import { Palette } from "../palette";
import { Swatch } from "../swatch";
/**
 * @internal
 */
export declare function neutralLayer2Index(
    palette: Palette,
    luminance: number,
    layerDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number
): number;
/**
 * @internal
 */
export declare function neutralLayer2(
    palette: Palette,
    luminance: number,
    layerDelta: number,
    fillRestDelta: number,
    fillHoverDelta: number,
    fillActiveDelta: number
): Swatch;
