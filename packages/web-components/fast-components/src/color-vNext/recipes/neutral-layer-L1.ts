import { PaletteRGB } from "../palette";
import { Swatch, SwatchRGB } from "../swatch";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

export function neutralLayerL1(
    palette: PaletteRGB,
    baseLayerLuminance: number
): SwatchRGB {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(baseLayerLuminance))
    );
}
