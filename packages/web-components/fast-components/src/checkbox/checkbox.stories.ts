import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import "../design-system-provider";
import Examples from "./fixtures/base.html";
import "./index";
import type { FASTCheckbox } from "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("checkbox")) {
        setIndeterminate();
    }
});

function setIndeterminate(): void {
    document.querySelectorAll(".flag-indeterminate").forEach((el: FASTCheckbox) => {
        el.indeterminate = true;
    });
}

export default {
    title: "Checkbox",
};

export const Checkbox = (): string => Examples;
