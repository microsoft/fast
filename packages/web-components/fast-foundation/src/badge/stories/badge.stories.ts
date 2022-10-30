import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTBadge } from "../badge.js";

const storyTemplate = html<StoryArgs<FASTBadge>>`
    <fast-badge>${x => x.storyContent}</fast-badge>
`;

export default {
    title: "Badge",
    args: {
        storyContent: "Badge",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTBadge>;

export const Badge: Story<FASTBadge> = renderComponent(storyTemplate).bind({});
