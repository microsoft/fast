import { css, html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTCard } from "../card.js";

export const storyTemplate = html<StoryArgs<FASTCard>>`
    <fast-card>${x => x.storyContent}</fast-card>
`;

export default {
    title: "Card",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "You got a fast card",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTCard>;

export const Card: Story<FASTCard> = renderComponent(storyTemplate).bind({});

export const CardWithCustomDimensions: Story<FASTCard> = Card.bind({});
CardWithCustomDimensions.decorators = [
    Story => {
        const renderedStory = Story() as FASTCard;
        renderedStory.style.setProperty("--card-height", "400px");
        renderedStory.style.setProperty("--card-width", "500px");
        return renderedStory;
    },
];

export const CardWithSlottedControls: Story<FASTCard> = Card.bind({});
CardWithSlottedControls.args = {
    storyContent: html`
        <fast-button>Test Button</fast-button>
    `,
};
CardWithSlottedControls.decorators = [
    Story => {
        const renderedStory = Story() as FASTCard;
        renderedStory.$fastController?.addStyles(css`
            :host {
                --card-height: 400px;
                --card-width: 500px;
                display: flex;
                flex-direction: column;
                padding: 20px;
            }
        `);
        return renderedStory;
    },
];
