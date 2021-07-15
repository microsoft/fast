import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import Examples from "./fixtures/base.html";
import "./index";
function valueTextFormatter(value) {
    return `${value} degrees celsius`;
}
addons.getChannel().addListener(STORY_RENDERED, name => {
    if (name.toLowerCase().endsWith("slider")) {
        ["switcher", "switcher2", "slider1"].forEach(x => {
            const slider = document.getElementById(x);
            slider.valueTextFormatter = valueTextFormatter;
        });
    }
});
export default {
    title: "Slider",
};
export const Slider = () => Examples;
