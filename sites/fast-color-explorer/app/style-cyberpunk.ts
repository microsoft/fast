import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    accentColor,
    bodyFont,
    Button,
    Card,
    controlCornerRadius,
    layerCornerRadius,
    Menu,
    neutralColor,
    neutralFillLayerRestDelta,
    neutralStrokeRest,
    registerStyleModule,
    SwatchRGB,
} from "@microsoft/fast-components";
import { Tabs } from "@microsoft/fast-foundation";
import { App, luminanceSettings } from "./app";
import { angledBorder } from "./style-modules";

export function registerCyberpunk() {
    if ("paintWorklet" in CSS) {
        (CSS as any).paintWorklet.addModule("./angled-corners.js");
    } else {
        console.log("No CSS Houdini Support");
    }

    App.instance.neutralColor = "#fcee0a";
    App.instance.accentColor = "#60d5ef";

    luminanceSettings.lightMode = 0.96;
    luminanceSettings.darkMode = 0.05;

    bodyFont.withDefault("Blender Pro, sans-serif");

    neutralColor.withDefault(SwatchRGB.from(parseColorHexRGB(App.instance.neutralColor)));
    accentColor.withDefault(SwatchRGB.from(parseColorHexRGB(App.instance.accentColor)));
    controlCornerRadius.withDefault(0);
    layerCornerRadius.withDefault(0);

    neutralFillLayerRestDelta.withDefault(0);

    registerStyleModule(
        Button,
        "angled-border",
        ":host .control",
        angledBorder("0 0 10 0", neutralStrokeRest, 1)
    );

    registerStyleModule(
        Card,
        "angled-border",
        ":host",
        angledBorder("0 10 0 10", neutralStrokeRest, 1)
    );

    registerStyleModule(
        Menu,
        "angled-border",
        ":host",
        angledBorder("0 10 0 10", neutralStrokeRest, 1)
    );

    registerStyleModule(
        Tabs,
        "angled-border-first",
        "::slotted(fast-tab[aria-selected='true']:first-of-type)",
        angledBorder("10 0 0 0", App.instance.accentColor, 1)
    );
    registerStyleModule(
        Tabs,
        "angled-border-last",
        "::slotted(fast-tab[aria-selected='true']:last-of-type)",
        angledBorder("0 0 10 0", App.instance.accentColor, 1)
    );
}
