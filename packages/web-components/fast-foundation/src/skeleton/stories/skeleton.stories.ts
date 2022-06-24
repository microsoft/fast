import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Card as FoundationCard } from "../../card/card.js";
import { Skeleton as FoundationSkeleton, SkeletonShape } from "../skeleton.js";

type SkeletonStoryArgs = Args & FoundationSkeleton;
type SkeletonStoryMeta = Meta<SkeletonStoryArgs>;

const componentTemplate = html<SkeletonStoryArgs>`
    <fast-skeleton
        ?shimmer="${x => x.shimmer}"
        fill="${x => x.fill}"
        pattern="${x => x.pattern}"
        shape="${x => x.shape}"
    ></fast-skeleton>
`;

export default {
    title: "Skeleton",
    args: {
        shape: "rect",
        shimmer: true,
    },
    argTypes: {
        fill: { control: { type: "text" } },
        pattern: { control: { type: "text" } },
        shape: {
            options: Object.values(SkeletonShape),
            control: { type: "radio" },
        },
        shimmer: { control: { type: "boolean" } },
    },
} as SkeletonStoryMeta;

export const Skeleton: SkeletonStoryMeta = (args: SkeletonStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
Skeleton.decorators = [
    (Story, { id }) => {
        const renderedStory = Story() as FoundationSkeleton;
        renderedStory.id = id;

        const styles = document.createElement("style");
        styles.innerHTML = /* css */ `
            #${id} {
                height: 100px;
                width: 100px;
            }
        `;
        renderedStory.append(styles);
        return renderedStory;
    },
];

export const SkeletonExample: SkeletonStoryMeta = (args: SkeletonStoryArgs) => {
    const componentTemplate = html<SkeletonStoryArgs>`
        <fast-card>
            <fast-skeleton
                style="width: 50px; height: 50px;"
                shape="circle"
                :shimmer="${x => x.shimmer}"
            ></fast-skeleton>
            <fast-skeleton :shimmer="${x => x.shimmer}" shape="rect"></fast-skeleton>
            <fast-skeleton :shimmer="${x => x.shimmer}" shape="rect"></fast-skeleton>
            <fast-skeleton :shimmer="${x => x.shimmer}" shape="rect"></fast-skeleton>
            <fast-skeleton :shimmer="${x => x.shimmer}" shape="rect"></fast-skeleton>
        </fast-card>
    `;
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
SkeletonExample.args = {
    shimmer: true,
};
SkeletonExample.decorators = [
    (Story, { id }) => {
        const renderedStory = Story() as FoundationCard;
        renderedStory.id = id;

        const styles = document.createElement("style");
        styles.innerHTML = /* css */ `
            #${id} {
                width: 300px;
                padding: 1rem;
            }
            #${id} fast-skeleton[shape="rect"]:not(:first-of-type) {
                border-radius: 4px;
                height: 10px;
                margin: 10px 0;
            }
            #${id} fast-skeleton[shape="rect"]:last-of-type {
                height: 30px;
                margin: 20px 0 0;
                width: 75px;
            }
        `;

        renderedStory.append(styles);
        return renderedStory;
    },
];
