import { css, html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTCard } from "../card.js";

type CardStoryMeta = Meta<Args & FASTCard>;
type CardStoryArgs = CardStoryMeta["args"];

const storyTemplate = html<CardStoryArgs>`
    <fast-card>
        ${x => x?.content}
    </fast-card>
`;

export default {
    title: "Card",
    args: {
        content: "You got a fast card",
    },
} as CardStoryMeta;

export const Card = (args: CardStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const CardWithCustomDimensions: CardStoryMeta = Card.bind({});
CardWithCustomDimensions.decorators = [
    Story => {
        const renderedStory = Story() as FASTCard;
        renderedStory.style.setProperty("--card-height", "400px");
        renderedStory.style.setProperty("--card-width", "500px");
        return renderedStory;
    },
];

export const CardWithControls: CardStoryMeta = Card.bind({});
CardWithControls.args = {
    content: html`
        <fast-button>Test Button</fast-button>
    `,
};

CardWithControls.decorators = [
    Story => {
        const renderedStory = Story() as FASTCard;
        const style = css`
            :host {
                --card-height: 400px;
                --card-width: 500px;
                display: flex;
                flex-direction: column;
                padding: 20px;
            }
        `;

        renderedStory.$fastController.addStyles(style);
        return renderedStory;
    },
];
