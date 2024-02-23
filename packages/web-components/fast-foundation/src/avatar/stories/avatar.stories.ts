import { css, html, Updates } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTAvatar } from "../avatar.js";

const storyTemplate = html<StoryArgs<FASTAvatar>>`
    <fast-avatar>${x => x.storyContent}</fast-avatar>
`;

export default {
    title: "Avatar",
    argTypes: {
        storyContent: { table: { disable: true } },
    },
    decorators: [
        Story => {
            const renderedStory = Story() as FASTAvatar;

            Updates.enqueue(() => {
                renderedStory.$fastController.addStyles(css`
                    ::slotted(fast-badge) {
                        bottom: 0;
                        right: 0;
                    }

                    .control {
                        height: 8px;
                        min-width: 8px;
                    }

                    ::slotted(.container) {
                        padding: 1em;
                    }
                `);
            });

            return renderedStory;
        },
    ],
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
