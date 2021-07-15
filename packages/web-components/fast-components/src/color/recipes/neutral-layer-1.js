import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";
export function neutralLayer1(palette, baseLayerLuminance) {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(baseLayerLuminance))
    );
}
