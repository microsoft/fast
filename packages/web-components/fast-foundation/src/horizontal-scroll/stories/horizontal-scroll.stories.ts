import { css, html, repeat, Updates } from "@microsoft/fast-element";
import { storyTemplate as cardStoryTemplate } from "../../card/stories/card.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTHorizontalScroll } from "../horizontal-scroll.js";
import { HorizontalScrollView, ScrollEasing } from "../horizontal-scroll.options.js";

const storyTemplate = html<StoryArgs<FASTHorizontalScroll>>`
    <fast-horizontal-scroll
        speed="${x => x.speed}"
        duration="${x => x.duration}"
        easing="${x => x.easing}"
        flippers-hidden-from-at="${x => x.flippersHiddenFromAT}"
        view="${x => x.view}"
    >
        ${x => x.storyContent}
    </fast-horizontal-scroll>
`;

export default {
    title: "Horizontal Scroll",
    args: {
        flippersHiddenFromAT: false,
        storyContent: html`
            ${repeat(x => x.storyItems, cardStoryTemplate)}
        `,
        storyItems: new Array(16).fill(null).map((_, i) => ({
            storyContent: html`
                <div>Card ${i + 1}</div>
                <fast-button>button</fast-button>
            `,
        })),
    },
    argTypes: {
        duration: { control: "text" },
        flippersHiddenFromAT: { control: "boolean" },
        easing: { control: "text", options: Object.values(ScrollEasing) },
        speed: { control: { type: "number", min: 0 } },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        view: { control: "radio", options: Object.values(HorizontalScrollView) },
    },
    decorators: [
        Story => {
            const renderedStory = Story() as FASTHorizontalScroll;

            Updates.enqueue(() => {
                renderedStory.$fastController.addStyles(css`
                    ::slotted(fast-card) {
                        color: var(--neutral-foreground-rest);
                        height: 200px;
                        width: 120px;
                    }

                    :host {
                        max-width: 620px;
                        margin: 20px;
                    }
                `);
            });

            return renderedStory;
        },
    ],
} as Meta<FASTHorizontalScroll>;

export const HorizontalScroll: Story<FASTHorizontalScroll> = renderComponent(
    storyTemplate
).bind({});
