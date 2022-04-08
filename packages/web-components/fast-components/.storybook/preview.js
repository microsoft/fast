import "../src/index-rollup.js";
import {
    baseLayerLuminance,
    direction,
    fillColor,
    neutralLayer1,
    StandardLuminance,
} from "../src/index.js";

export const parameters = {
    layout: "fullscreen",
};

export const globalTypes = {
    theme: {
        defaultValue: "light",
        toolbar: {
            items: ["light", "dark"],
            showName: true,
        },
    },
    direction: {
        defaultValue: "ltr",
        toolbar: {
            items: ["ltr", "rtl"],
            showName: true,
        },
    },
};

const themeLuminance = {
    dark: StandardLuminance.DarkMode,
    light: StandardLuminance.LightMode,
};

export const decorators = [
    (Story, context) => {
        const root = document.body;

        fillColor.setValueFor(document.body, neutralLayer1);
        baseLayerLuminance.setValueFor(
            document.body,
            themeLuminance[context.globals.theme]
        );
        document.body.style.setProperty(
            "background-color",
            fillColor.createCSS().toString()
        );
        root.setAttribute("dir", context.globals.direction);
        direction.setValueFor(document.body, context.globals.direction);
        return Story();
    },
];
