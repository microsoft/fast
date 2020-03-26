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
    document.querySelectorAll(".fastest-slider").forEach(el => {
        console.log("found another slider...");
        if (el instanceof FASTSlider) {
            console.log("attaching handler for onchange");
            el.addEventListener("change", (e: any) => {
                console.log("handler in slider story hit, e:", e);
            });
        }
    });
}

document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        console.log("SLIDER STORY READY!");
        setChangeHandler();
    }
});

export const Base = () => Examples;
