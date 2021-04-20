import { Swatch } from "../swatch";
import { black, white } from "../utilities/color-constants";

export function accentForegroundCut(reference: Swatch, contrastTarget: number) {
    return reference.contrast(white) >= contrastTarget ? white : black;
}
