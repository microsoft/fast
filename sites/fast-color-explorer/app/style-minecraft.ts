import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    accentColor,
    accentFillActive,
    accentFillFocus,
    accentFillHover,
    accentFillRest,
    attributeValue,
    bodyFont,
    Button,
    Card,
    controlCornerRadius,
    deleteAllStyleModules,
    deleteStyleModule,
    foregroundOnAccentActive,
    foregroundOnAccentFocus,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
    interactionColor,
    layerCornerRadius,
    Menu,
    neutralStrokeActive,
    neutralStrokeActiveDelta,
    neutralStrokeFocus,
    neutralStrokeFocusDelta,
    neutralStrokeHover,
    neutralStrokeHoverDelta,
    neutralStrokeInputFilledActive,
    neutralStrokeInputFilledActiveDelta,
    neutralStrokeInputFilledFocus,
    neutralStrokeInputFilledFocusDelta,
    neutralStrokeInputFilledHover,
    neutralStrokeInputFilledHoverDelta,
    neutralStrokeInputFilledRest,
    neutralStrokeInputFilledRestDelta,
    neutralStrokeRest,
    neutralStrokeRestDelta,
    registerStyleModule,
    strokeWidth,
    SwatchRGB,
    Tab,
} from "@microsoft/fast-components";
import { Constructable } from "@microsoft/fast-element";
import { App, luminanceSettings } from "./app";
import { cornerShape } from "./style-modules";

export function registerMinecraftStyle() {
    if ("paintWorklet" in CSS) {
        (CSS as any).paintWorklet.addModule("./corner-shape.js");
    } else {
        console.log("No CSS Houdini Support");
    }

    // deleteAllStyleModules();

    App.instance.accentColor = "#569953";

    luminanceSettings.lightMode = 0.88;
    luminanceSettings.darkMode = 0.21;

    bodyFont.withDefault("Minecraft, sans-serif");

    accentColor.withDefault(SwatchRGB.from(parseColorHexRGB(App.instance.accentColor)));
    strokeWidth.withDefault(4);
    controlCornerRadius.withDefault(0);
    layerCornerRadius.withDefault(0);

    // Use for highlight top and left
    neutralStrokeRestDelta.withDefault(-3);
    neutralStrokeHoverDelta.withDefault(-3);
    neutralStrokeActiveDelta.withDefault(-3);
    neutralStrokeFocusDelta.withDefault(-3);

    // Use for shadow bottom and right
    neutralStrokeInputFilledRestDelta.withDefault(13);
    neutralStrokeInputFilledHoverDelta.withDefault(13);
    neutralStrokeInputFilledActiveDelta.withDefault(13);
    neutralStrokeInputFilledFocusDelta.withDefault(13);

    const borderTop = interactionColor(
        "border-top-color",
        neutralStrokeRest,
        neutralStrokeHover,
        neutralStrokeActive,
        neutralStrokeFocus
    );
    const borderLeft = interactionColor(
        "border-left-color",
        neutralStrokeRest,
        neutralStrokeHover,
        neutralStrokeActive,
        neutralStrokeFocus
    );
    const borderRight = interactionColor(
        "border-right-color",
        neutralStrokeInputFilledRest,
        neutralStrokeInputFilledHover,
        neutralStrokeInputFilledActive,
        neutralStrokeInputFilledFocus
    );
    const borderBottom = interactionColor(
        "border-bottom-color",
        neutralStrokeInputFilledRest,
        neutralStrokeInputFilledHover,
        neutralStrokeInputFilledActive,
        neutralStrokeInputFilledFocus
    );
    const cornerShapeModule = cornerShape("4px", "notch");

    function registerBorderTreatment(component: Constructable, selector: string) {
        registerStyleModule(component, "border-top", selector, borderTop);
        registerStyleModule(component, "border-left", selector, borderLeft);
        registerStyleModule(component, "border-right", selector, borderRight);
        registerStyleModule(component, "border-bottom", selector, borderBottom);
        const cornerSelector = selector.replace(/STATE/g, "");
        registerStyleModule(component, "corner-shape", cornerSelector, cornerShapeModule);
    }

    registerBorderTreatment(Button, ":host .control");

    deleteStyleModule(Card, "elevation");
    registerBorderTreatment(Card, ":host");

    deleteStyleModule(Menu, "elevation");
    registerBorderTreatment(Menu, ":host");

    registerBorderTreatment(
        Tab,
        ":host(:not(.disabled)STATE), :host(.vertical:not(.disabled)STATE)"
    );
    registerBorderTreatment(
        Tab,
        ":host([aria-selected='true']STATE), :host(.vertical[aria-selected='true']STATE)"
    );
    registerStyleModule(
        Tab,
        "background",
        ":host([aria-selected='true']STATE), :host(.vertical[aria-selected='true']STATE)",
        interactionColor(
            "background",
            accentFillRest,
            accentFillHover,
            accentFillActive,
            accentFillFocus
        )
    );
    registerStyleModule(
        Tab,
        "color",
        ":host([aria-selected='true']STATE), :host(.vertical[aria-selected='true']STATE)",
        interactionColor(
            "color",
            foregroundOnAccentRest,
            foregroundOnAccentHover,
            foregroundOnAccentActive,
            foregroundOnAccentFocus
        )
    );
}
