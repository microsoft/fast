import { Swatch } from "../swatch.js";
import { black, white } from "../utilities/color-constants.js";

/**
 * @internal
 */
export function foregroundOnAccent(reference: Swatch, contrastTarget: number): Swatch {
    return reference.contrast(white) >= contrastTarget ? white : black;
}
