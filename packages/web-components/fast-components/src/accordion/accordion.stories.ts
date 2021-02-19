import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import "../accordion-item";
import type { FASTDesignSystemProvider } from "../design-system-provider";
import { accentFillRestBehavior } from "../styles/recipes";
import Examples from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, name => {
    if (name === "accordion--accordion") {
        const provider = document.getElementById(
            "root-provider"
        ) as FASTDesignSystemProvider;

        // Example depends on accentFillRest but component itself does not.
        provider.registerCSSCustomProperty(accentFillRestBehavior);
    }
});

export default {
    title: "Accordion",
};

export const Accordion = () => Examples;
