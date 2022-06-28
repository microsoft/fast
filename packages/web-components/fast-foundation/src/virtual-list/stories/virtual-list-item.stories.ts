import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { VirtualListItem as FoundationVirtualListItem } from "../virtual-list-item.js";

type VirtualListItemStoryArgs = Args & FoundationVirtualListItem;
type VirtualListItemStoryMeta = Meta<VirtualListItemStoryArgs>;

const storyTemplate = html<VirtualListItemStoryArgs>`
    <fast-virtual-list-item></fast-virtual-list-item>
`;

export default {
    title: "Virtul List/Virtual List Item",
    args: {},
    argTypes: {},
} as VirtualListItemStoryMeta;

export const VirtualListItem = (args: VirtualListItemStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
