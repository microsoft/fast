import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTDivider } from "../divider.js";
import { DividerOrientation, DividerRole } from "../divider.options.js";

export const storyTemplate = html<StoryArgs<FASTDivider>>`
    <fast-divider
        orientation="${x => x.orientation}"
        role="${x => x.role}"
    ></fast-divider>
`;

export default {
    title: "Divider",
    excludeStories: ["storyTemplate"],
    argTypes: {
        orientation: { control: "radio", options: Object.values(DividerOrientation) },
        role: { control: "select", options: Object.values(DividerRole) },
    },
} as Meta<FASTDivider>;

export const Divider: Story<FASTDivider> = renderComponent(storyTemplate).bind({});
