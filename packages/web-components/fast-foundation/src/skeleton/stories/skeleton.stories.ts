import { css, html, repeat, Updates } from "@microsoft/fast-element";
import type { FASTCard } from "../../card/card.js";
import { storyTemplate as cardStoryTemplate } from "../../card/stories/card.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import { FASTSkeleton, SkeletonShape } from "../skeleton.js";

const storyTemplate = html<StoryArgs<FASTSkeleton>>`
    <fast-skeleton
        ?shimmer="${x => x.shimmer}"
        fill="${x => x.fill}"
        pattern="${x => x.pattern}"
        shape="${x => x.shape}"
    >
        ${x => x.storyContent}
    </fast-skeleton>
`;

export default {
    title: "Skeleton",
    args: {
        shimmer: true,
    },
    argTypes: {
        fill: { control: "text" },
        pattern: { control: "text" },
        shape: { control: "radio", options: Object.values(SkeletonShape) },
        shimmer: { control: "boolean" },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
    },
} as Meta<FASTSkeleton>;

export const Skeleton: Story<FASTSkeleton> = renderComponent(storyTemplate).bind({});
Skeleton.decorators = [
    Story => {
        const renderedStory = Story() as FASTSkeleton;

        Updates.enqueue(() => {
            renderedStory.$fastController.addStyles(css`
                :host(fast-skeleton) {
                    height: 100px;
                    width: 100px;
                }
            `);
        });

        return renderedStory;
    },
];

export const SkeletonCardExample: Story<FASTSkeleton> = renderComponent(
    cardStoryTemplate
).bind({});
SkeletonCardExample.args = {
    shimmer: true,
    storyContent: html`
        ${repeat(x => x.storyItems, storyTemplate)}
    `,
    storyItems: [
        { shimmer: true, shape: SkeletonShape.circle },
        { shape: SkeletonShape.rect, shimmer: true },
        { shape: SkeletonShape.rect, shimmer: true },
        { shape: SkeletonShape.rect, shimmer: true },
        { shape: SkeletonShape.rect, shimmer: true },
    ],
};
SkeletonCardExample.parameters = { controls: { include: [] } };
SkeletonCardExample.decorators = [
    Story => {
        const renderedStory = Story() as FASTCard;

        Updates.enqueue(() => {
            renderedStory.$fastController.addStyles(css`
                :host(fast-card) {
                    height: auto;
                    padding: 1rem;
                    width: 300px;
                }

                ::slotted(fast-skeleton[shape="circle"]) {
                    height: 50px;
                    width: 50px;
                }

                ::slotted(fast-skeleton[shape="rect"]:not(:first-of-type)) {
                    border-radius: 4px;
                    height: 10px;
                    margin: 10px 0;
                }

                ::slotted(fast-skeleton[shape="rect"]:last-of-type) {
                    height: 30px;
                    margin: 20px 0 0;
                    width: 75px;
                }
            `);
        });

        return renderedStory;
    },
];
