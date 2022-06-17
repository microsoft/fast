import { css, html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Avatar as FoundationAvatar } from "../avatar.js";

type AvatarStoryArgs = Args & FoundationAvatar;
type AvatarStoryMeta = Meta<AvatarStoryArgs>;

const storyTemplate = html<AvatarStoryArgs>`
    <fast-avatar
        alt="${x => x.alt}"
        link="#"
        shape="circle"
        fill="accent-primary"
        color="bar"
    >
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
        shape: "circle",
        fill: "accent-primary",
        color: "bar",
    },
    argTypes: {
        shape: {
            options: ["circle", "square"],
            control: {
                type: "select",
            },
        },
    },
    decorators: [
        Story => {
            const renderedStory = Story() as FoundationAvatar;

            const storyStyles = css`
                :host {
                    --avatar-fill-accent-primary: #cf4073;
                    --avatar-fill-accent-secondary: #0078d4;
                    --avatar-color-foo: hsl(0, 0%, 100%);
                    --avatar-color-bar: gray;
                    --avatar-text-ratio: 3;
                    --badge-fill-primary: var(--accent-fill-rest);
                }

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
    shape: "circle",
    fill: "accent-primary",
    color: "foo",
};
