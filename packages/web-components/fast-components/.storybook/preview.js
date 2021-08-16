import "../src/index-rollup";
import * as FAST from "../src/index-rollup";
import { parseColor } from "@microsoft/fast-colors";

export const parameters = {
    layout: "fullscreen",
};

const root = document.body;

// By default, we grab the current background color to set the fillColor token.
// This value can be changed to see the components in light mode.
const backgroundColor = getComputedStyle(root).backgroundColor;

FAST.fillColor.setValueFor(root, FAST.SwatchRGB.from(parseColor(backgroundColor)));

root.style.backgroundColor = FAST.fillColor.createCSS();
root.style.color = FAST.neutralForegroundRest.createCSS();
