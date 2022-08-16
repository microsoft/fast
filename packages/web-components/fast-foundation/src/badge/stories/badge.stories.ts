import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTBadge } from "../badge.js";

const storyTemplate = html<StoryArgs<FASTBadge>>`
    <fast-badge>
        <svg
            slot="start"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10.35 3.15c.2.2.2.5 0 .7L6.21 8l4.14 4.15a.5.5 0 0 1-.7.7l-4.5-4.5a.5.5 0 0 1 0-.7l4.5-4.5c.2-.2.5-.2.7 0Z"
            />
        </svg>
        ${x => x.storyContent}
        <svg
            slot="end"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M5.65 3.15a.5.5 0 0 0 0 .7L9.79 8l-4.14 4.15a.5.5 0 0 0 .7.7l4.5-4.5a.5.5 0 0 0 0-.7l-4.5-4.5a.5.5 0 0 0-.7 0Z"
            />
        </svg>
    </fast-badge>
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
