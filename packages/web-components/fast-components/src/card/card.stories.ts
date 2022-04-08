import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import { renderComponent } from "../storybook-helpers.js";
import type { Card } from "./index.js";

const componentTemplate = html<Card & Args>`
    <fast-card>${x => x.content}</fast-card>
`;

export default {
    title: "Card",
    args: {
        content: "You got a fast card",
    },
    decorators: [
        Story => {
            const renderedStory = Story() as DocumentFragment;

            const styles = document.createElement("style");
            styles.innerHTML = /* css */ `
                .class-override {
                    height: 163px;
                    width: 300px;
                }
                .state-override:hover {
                    --elevation: 12;
                }
                .has-controls {
                    --card-height: 400px;
                    --card-width: 500px;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                }
            `;

            renderedStory.prepend(styles);
            return renderedStory;
        },
    ],
} as Meta<Card>;

export const Primary = renderComponent(componentTemplate).bind({});

export const WithCustomDimensions = renderComponent(componentTemplate).bind({});
WithCustomDimensions.args = {
    content: "Card with custom dimensions",
};
WithCustomDimensions.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;

        const card = renderedStory.querySelector<Card>("fast-card");
        if (!card) {
            return renderedStory;
        }
        card.style.setProperty("--card-height", "400px");
        card.style.setProperty("--card-width", "500px");

        return renderedStory;
    },
] as Meta["decorators"];

export const WithCustomDepth = renderComponent(componentTemplate).bind({});
WithCustomDepth.args = {
    content: "Custom depth with class-based height/width",
};
WithCustomDepth.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;

        const card = renderedStory.querySelector<Card>("fast-card");
        if (!card) {
            return renderedStory;
        }
        card.classList.add("class-override");
        card.style.setProperty("--elevation", "12");

        return renderedStory;
    },
] as Meta["decorators"];

export const WithCustomDepthOnHover = renderComponent(componentTemplate).bind({});
WithCustomDepthOnHover.args = {
    content: "Custom depth with class-based height/width",
};
WithCustomDepthOnHover.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;

        const card = renderedStory.querySelector<Card>("fast-card");
        card?.classList.add("class-override", "state-override");

        return renderedStory;
    },
] as Meta["decorators"];

export const WithSlottedControls = renderComponent(componentTemplate).bind({});
WithSlottedControls.args = {
    content: html`
        Card with slotted controls
        <fast-button appearance="stealth">Test Button</fast-button>
    `,
};
WithSlottedControls.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;
        const card = renderedStory.querySelector<Card>("fast-card");
        card?.classList.add("has-controls");
        return renderedStory;
    },
] as Meta["decorators"];
