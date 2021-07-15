import { black, white } from "../utilities/color-constants";
/**
 * @internal
 */
export function foregroundOnAccent(reference, contrastTarget) {
    return reference.contrast(white) >= contrastTarget ? white : black;
}
