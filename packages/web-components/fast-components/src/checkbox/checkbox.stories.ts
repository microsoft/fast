import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import Examples from "./fixtures/base.html";
import "./index";
import { FASTCheckbox } from "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("checkbox")) {
        document.querySelectorAll(".flag-indeterminate").forEach((el: FASTCheckbox) => {
            el.indeterminate = true;
        });
    }
});

export default {
    title: "Checkbox",
};

export const Checkbox = () => Examples;
