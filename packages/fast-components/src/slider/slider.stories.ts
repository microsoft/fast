import { FASTSlider } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";

// Prevent tree-shaking
FASTSlider;
FASTDesignSystemProvider;

export default {
    title: "Slider",
};

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("slider")) {
        setChangeHandler();
    }
});

function setChangeHandler(): void {
    document.querySelectorAll("fast-slider").forEach(el => {
        if (el instanceof FASTSlider) {
            el.addEventListener("change", (e: any) => {
                console.log(
                    "handler in slider story hit, e.target.value:",
                    e.target.value
                );
            });
        }
    });
}

export const Base = () => Examples;
