import { html } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTDivider } from "../divider.js";
import { DividerRole } from "../divider.options.js";

const storyTemplate = html<StoryArgs<FASTDivider>>`
    <fast-divider
        orientation="${x => x.orientation}"
        role="${x => x.role}"
    ></fast-divider>
`;

export default {
    title: "Divider",
    argTypes: {
        orientation: { control: "radio", options: Object.values(Orientation) },
        role: { control: "select", options: Object.values(DividerRole) },
    },
} as Meta<FASTDivider>;

export const Divider: Story<FASTDivider> = renderComponent(storyTemplate).bind({});
