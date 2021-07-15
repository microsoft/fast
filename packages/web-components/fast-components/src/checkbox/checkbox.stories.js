import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import Examples from "./fixtures/base.html";
import "./index";
addons.getChannel().addListener(STORY_RENDERED, name => {
    if (name.toLowerCase().startsWith("checkbox")) {
        document.querySelectorAll(".flag-indeterminate").forEach(el => {
            el.indeterminate = true;
        });
    }
});
export default {
    title: "Checkbox",
};
export const Checkbox = () => Examples;
