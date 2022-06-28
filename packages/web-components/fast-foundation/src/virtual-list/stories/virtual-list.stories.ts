import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { VirtualList as FoundationVirtualList } from "../virtual-list.js";

type VirtualListStoryArgs = Args & FoundationVirtualList;
type VirtualListStoryMeta = Meta<VirtualListStoryArgs>;

const storyTemplate = html<VirtualListStoryArgs>`
    <fast-virtual-list></fast-virtual-list>
`;

export default {
    title: "Virtual List",
    args: {},
    argTypes: {},
} as VirtualListStoryMeta;

export const VirtualList = (args: VirtualListStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
