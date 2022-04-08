import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import { renderComponent } from "../storybook-helpers.js";
import type { Avatar } from "./index.js";

const componentTemplate = html<Avatar & Args>`
    <fast-avatar
        alt="${x => x.alt}"
        src="${x => x.src}"
        link="${x => x.link}"
        shape="${x => x.shape}"
        fill="${x => x.fill}"
        color="${x => x.color}"
    >
        ${x => x.content}
    </fast-avatar>
`;

export default {
    title: "Avatar",
    decorators: [
        Story => {
            const renderedStory = Story() as DocumentFragment;
            const styles = document.createElement("style");
            styles.innerHTML = /* css */ `
                fast-avatar {
                    --avatar-fill-accent-primary: #cf4073;
                    --avatar-fill-accent-secondary: #0078d4;
                    --avatar-color-foo: hsl(0, 0%, 100%);
                    --avatar-color-bar: grey;
                    --avatar-text-ratio: 3;
                    --badge-fill-primary: var(--accent-fill-rest);
                }

                fast-badge {
                    right: 0px;
                    bottom: 0px;
                }

                fast-badge::part(control) {
                    min-width: 8px;
                    height: 8px;
                }

                .container {
                    padding: 1em;
                }
            `;
            renderedStory.prepend(styles);
            return renderedStory;
        },
    ],
} as Meta<Avatar>;

export const Primary = renderComponent(componentTemplate).bind({});
Primary.args = {
    alt: "Annie's profile image",
    link: "#",
    shape: "circle",
    fill: "accent-primary",
    color: "bar",
    content: html`
        <img class="image" slot="media" src="https://via.placeholder.com/32" />
    `,
};

export const CircleAvatarWithText = renderComponent(componentTemplate).bind({});
CircleAvatarWithText.args = {
    alt: "Carlos's profile image",
    link: "#",
    shape: "circle",
    fill: "accent-primary",
    color: "foo",
    content: "CR",
};

export const CircleAvatarWithImageAndBadge = renderComponent(componentTemplate).bind({});

CircleAvatarWithImageAndBadge.args = {
    src: "https://via.placeholder.com/32",
    alt: "Harper's profile image",
    link: "#",
    shape: "circle",
    fill: "accent-primary",
    color: "foo",
    content: html`
        <fast-badge slot="badge" fill="primary" circular></fast-badge>
    `,
};

export const CircleAvatarWithTextAndBadge = renderComponent(componentTemplate).bind({});
CircleAvatarWithTextAndBadge.args = {
    alt: "Bob's profile image",
    content: html`
        BV
        <fast-badge slot="badge" fill="primary" circular></fast-badge>
    `,
    fill: "accent-secondary",
    link: "#",
    shape: "circle",
};

export const SquareAvatarWithImage = renderComponent(componentTemplate).bind({});
SquareAvatarWithImage.args = {
    alt: "Fang's profile image",
    fill: "accent-secondary",
    link: "#",
    shape: "square",
    src: "https://via.placeholder.com/32",
};

export const SquareAvatarWithText = renderComponent(componentTemplate).bind({});
SquareAvatarWithText.args = {
    alt: "Scott's profile image",
    content: "SW",
    link: "#",
    fill: "accent-primary",
    shape: "square",
};

export const SquareAvatarWithImageAndBadge = renderComponent(componentTemplate).bind({});
SquareAvatarWithImageAndBadge.args = {
    alt: "Albert's profile image",
    content: html`
        <fast-badge slot="badge" fill="primary" circular></fast-badge>
    `,
    fill: "accent-secondary",
    link: "#",
    shape: "square",
    src: "https://via.placeholder.com/32",
};

export const SquareAvatarWithTextAndBadge = renderComponent(componentTemplate).bind({});
SquareAvatarWithTextAndBadge.args = {
    alt: "Austin's profile image",
    link: "#",
    shape: "square",
    fill: "accent-secondary",
    content: html`
        JS
        <fast-badge slot="badge" fill="primary" circular></fast-badge>
    `,
};
