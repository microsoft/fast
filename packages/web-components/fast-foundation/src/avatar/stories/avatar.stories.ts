import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTAvatar } from "../avatar.js";

const storyTemplate = html<StoryArgs<FASTAvatar>>`
    <fast-avatar>
        ${x => x.storyContent}
    </fast-avatar>
`;

export default {
    title: "Avatar",
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTAvatar>;

export const Avatar: Story<FASTAvatar> = renderComponent(storyTemplate).bind({});
Avatar.args = {
    storyContent: html`
        <img
            class="image"
            slot="media"
            src="https://via.placeholder.com/32x32"
            alt="Annie's profile image"
        />
    `,
};

export const AvatarCircleWithTextContent: Story<FASTAvatar> = Avatar.bind({});
AvatarCircleWithTextContent.args = {
    storyContent: "CR",
};

export const AvatarCircleWithTextAndMediaContent: Story<FASTAvatar> = Avatar.bind({});
AvatarCircleWithTextAndMediaContent.args = {
    storyContent: html`
        <img
            class="image"
            slot="media"
            src="https://via.placeholder.com/32x32"
            alt="Annie's profile image"
        />
        CR
    `,
};

export const AvatarWithBadge: Story<FASTAvatar> = Avatar.bind({});
AvatarWithBadge.args = {
    storyContent: html`
        <fast-badge slot="badge">1</fast-badge>
        CR
    `,
};
