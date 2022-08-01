import { html } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { Args, Meta } from "@storybook/html";
import type { FASTDivider } from "../divider.js";
import { DividerRole } from "../divider.options.js";

type DividerStoryArgs = Args & FASTDivider;
type DividerStoryMeta = Meta<DividerStoryArgs>;

const componentTemplate = html<DividerStoryArgs>`
    <fast-divider
        orientation="${x => x.orientation}"
        role="${x => x.role}"
    ></fast-divider>
`;

export default {
    title: "Divider",
    argTypes: {
        orientation: {
            options: Object.values(Orientation),
            control: { type: "select" },
        },
        role: {
            options: Object.values(DividerRole),
            control: { type: "select" },
        },
    },
} as DividerStoryMeta;

export const Divider = (args: DividerStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const DividerPresentation = Divider.bind({});
DividerPresentation.storyName = "Divider (presentation role)";
DividerPresentation.args = {
    role: DividerRole.presentation,
};

export const DividerVertical = Divider.bind({});
DividerVertical.args = {
    orientation: Orientation.vertical,
};
