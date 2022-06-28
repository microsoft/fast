import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTBadge } from "../badge.js";

type BadgeStoryArgs = Args & FASTBadge;
type BadgeStoryMeta = Meta<BadgeStoryArgs>;

const storyTemplate = html<BadgeStoryArgs>`
    <fast-badge>${x => x.content}</fast-badge>
`;

export default {
    title: "Badge",
    args: {
        content: "Badge",
    },
} as BadgeStoryMeta;

export const Badge = (args: BadgeStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
