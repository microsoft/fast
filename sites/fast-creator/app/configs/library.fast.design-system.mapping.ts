import {
    accentPalette,
    baseLayerLuminance,
    cornerRadius,
    disabledOpacity,
    fillColor,
    focusOutlineWidth,
    outlineWidth,
    PaletteRGB,
    SwatchRGB,
} from "@microsoft/fast-components";
import { parseColorHexRGB } from "@microsoft/fast-colors";

export function mapFASTComponentsDesignSystem(designSystem: {
    [key: string]: any;
}): void {
    Object.entries(designSystem).forEach(([attribute, value]: [string, any]) => {
        switch (attribute) {
            case "fill-color":
                fillColor.withDefault(value);
                break;
            case "base-layer-luminance":
                baseLayerLuminance.withDefault(value);
                break;
            case "accent-color": {
                const base = parseColorHexRGB(value);

                if (base) {
                    accentPalette.withDefault(
                        PaletteRGB.create(SwatchRGB.create(base.r, base.g, base.b))
                    );
                }

                break;
            }
            case "control-corner-radius":
                cornerRadius.withDefault(value);
                break;
            case "stroke-width":
                outlineWidth.withDefault(value);
                break;
            case "focus-stroke-width":
                focusOutlineWidth.withDefault(value);
                break;
            case "disabled-opacity":
                disabledOpacity.withDefault(value);
                break;
        }
    });
}
