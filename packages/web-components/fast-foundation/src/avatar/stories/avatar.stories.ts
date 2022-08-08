import { css, html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTAvatar } from "../avatar.js";

type AvatarStoryArgs = Args & FASTAvatar;
type AvatarStoryMeta = Meta<AvatarStoryArgs>;

const storyTemplate = html<AvatarStoryArgs>`
    <fast-avatar alt="${x => x.alt}" link="#">
        ${x => x.content}
    </fast-avatar>
`;

export default {
    title: "Avatar",
    args: {
        content: html`
            <img class="image" slot="media" src="https://via.placeholder.com/32x32" />
        `,
        alt: "Annie's profile image",
        link: "#",
    },
    decorators: [
        Story => {
            const renderedStory = Story() as FASTAvatar;

            const storyStyles = css`
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
            `;

            renderedStory.$fastController.addStyles(storyStyles);

            return renderedStory;
        },
    ],
} as AvatarStoryMeta;

export const Avatar = (args: AvatarStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const CircleWithTextContent: AvatarStoryMeta = Avatar.bind({});
CircleWithTextContent.args = {
    alt: "Carlos's profile image",
    content: html`
        CR
    `,
    link: "#",
};
