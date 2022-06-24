import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Anchor as FoundationAnchor } from "../anchor.js";

type AnchorArgs = Args & FoundationAnchor;
type AnchorMeta = Meta<AnchorArgs>;

export const storyTemplate = html<AnchorArgs>`
    <fast-anchor
        href="${x => x?.href}"
        hreflang="${x => x?.hreflang}"
        download="${x => x?.download}"
    >
        ${x => x?.content}
    </fast-anchor>
`;

export default {
    title: "Anchor",
    includeStories: ["Anchor"],
    args: {
        content: "Anchor",
        href: "#",
    },
    argTypes: {
        download: { control: { type: "text" } },
        href: { control: { type: "text" } },
        hreflang: { control: { type: "text" } },
        ping: { control: { type: "text" } },
        referrerpolicy: { control: { type: "text" } },
        rel: { control: { type: "text" } },
        target: {
            options: ["_self", "_blank", "_parent", "_top"],
            control: { type: "select" },
        },
        type: { control: { type: "text" } },
    },
} as AnchorMeta;

export const Anchor = (args: AnchorArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
