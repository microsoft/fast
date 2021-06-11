import {
    accentPalette,
    baseLayerLuminance,
    controlCornerRadius,
    disabledOpacity,
    fillColor,
    focusStrokeWidth,
    PaletteRGB,
    strokeWidth,
    SwatchRGB,
} from "@microsoft/fast-components";
import { parseColorHexRGB } from "@microsoft/fast-colors";

export function setupFASTComponentDesignSystem(element: HTMLElement) {
    element.setAttribute(
        "style",
        `background-color: var(${fillColor.cssCustomProperty});`
    );
}

export function mapFASTComponentsDesignSystem(
    element: HTMLElement,
    designSystem: {
        [key: string]: any;
    }
): void {
    Object.entries(designSystem).forEach(([attribute, value]: [string, any]) => {
        switch (attribute) {
            case "fill-color":
                fillColor.setValueFor(element, value);
                break;
            case "base-layer-luminance":
                baseLayerLuminance.setValueFor(element, value);
                break;
            case "accent-base-color": {
                const base = parseColorHexRGB(value);

                if (base) {
                    accentPalette.setValueFor(
                        element,
                        PaletteRGB.create(SwatchRGB.create(base.r, base.g, base.b))
                    );
                }

                break;
            }
            case "control-corner-radius":
                controlCornerRadius.setValueFor(element, value);
                break;
            case "stroke-width":
                strokeWidth.setValueFor(element, value);
                break;
            case "focus-stroke-width":
                focusStrokeWidth.setValueFor(element, value);
                break;
            case "disabled-opacity":
                disabledOpacity.setValueFor(element, value);
                break;
            case "theme":
                baseLayerLuminance.setValueFor(element, value);
                fillColor.setValueFor(element, SwatchRGB.create(value, value, value));
                break;
        }
    });
}
