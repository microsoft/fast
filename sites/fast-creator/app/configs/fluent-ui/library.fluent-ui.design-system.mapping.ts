import {
    baseLayerLuminance,
    controlCornerRadius,
    disabledOpacity,
    fillColor,
    focusStrokeWidth,
    neutralForegroundRest,
    strokeWidth,
    SwatchRGB,
} from "@fluentui/web-components";

export function setupFluentUIComponentDesignSystem(element: HTMLElement) {
    element.style.setProperty("background-color", `var(${fillColor.cssCustomProperty})`);
    element.style.setProperty("color", `var(${neutralForegroundRest.cssCustomProperty})`);
}

export function mapFluentUIComponentsDesignSystem(
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
