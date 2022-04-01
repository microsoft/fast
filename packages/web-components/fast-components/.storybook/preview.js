import { addons } from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { Direction } from "@microsoft/fast-web-utilities";
import "../src/index-rollup";
import { StandardLuminance } from "../src/index";
import {
    baseLayerLuminance,
    direction,
    fillColor,
    neutralLayer1,
    neutralLayer2,
} from "../src/design-tokens";

function toggleBgMode() {
    const bgChecked = this.checked;
    if (bgChecked) {
        baseLayerLuminance.withDefault(StandardLuminance.LightMode);
    } else {
        baseLayerLuminance.withDefault(StandardLuminance.DarkMode);
    }
}

function toggleLtr() {
    const dirChecked = this.checked;
    if (dirChecked) {
        storyContainer.style.direction = "rtl";
        direction.withDefault(Direction.rtl);
    } else {
        storyContainer.style.direction = "ltr";
        direction.withDefault(Direction.ltr);
    }
}

document
    .getElementById("luminance-switch")
    .addEventListener("change", toggleBgMode, false);
document.getElementById("direction-switch").addEventListener("change", toggleLtr, false);

export const parameters = {
    layout: "fullscreen",
};

addons.getChannel().addListener(STORY_RENDERED, name => {
    if (name.endsWith("-accordion") || name.endsWith("-card")) {
        fillColor.withDefault(neutralLayer2);
    } else {
        fillColor.withDefault(neutralLayer1);
    }
});
