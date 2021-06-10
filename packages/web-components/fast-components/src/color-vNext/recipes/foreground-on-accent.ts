import { Swatch, SwatchRGB } from "../swatch";
import { black, white } from "../utilities/color-constants";

/**
 * @internal
 */
export function foregroundOnAccent(reference: Swatch, contrastTarget: number): SwatchRGB {
    return reference.contrast(white) >= contrastTarget ? white : black;
}
