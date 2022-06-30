import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTBreadcrumb } from "../breadcrumb.js";

type BreadcrumbStoryArgs = Args & FASTBreadcrumb;
type BreadcrumbStoryMeta = Meta<BreadcrumbStoryArgs>;

const storyTemplate = html<BreadcrumbStoryArgs>`
    <fast-breadcrumb>
        ${x => x.content}
    </fast-breadcrumb>
`;

export default {
    title: "Breadcrumb",
    args: {
        content: html`
            <fast-breadcrumb-item href="#">Breadcrumb Item 1</fast-breadcrumb-item>
            <fast-breadcrumb-item href="#">Breadcrumb Item 2</fast-breadcrumb-item>
            <fast-breadcrumb-item>Breadcrumb Item 3</fast-breadcrumb-item>
        `,
    },
} as BreadcrumbStoryMeta;

export const Breadcrumb = (args: BreadcrumbStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const BreadcrumbsWithSeparators: BreadcrumbStoryMeta = Breadcrumb.bind({});
BreadcrumbsWithSeparators.args = {
    content: html`
        <fast-breadcrumb-item href="#">
            Breadcrumb Item 1
            <svg slot="separator"><use href="#test-icon" /></svg>
        </fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">
            Breadcrumb Item 2
            <svg slot="separator"><use href="#test-icon" /></svg>
        </fast-breadcrumb-item>
        <fast-breadcrumb-item>
            Breadcrumb Item 3
            <svg slot="separator"><use href="#test-icon" /></svg>
        </fast-breadcrumb-item>
    `,
};

export const BreadcrumbsWithAnchors: BreadcrumbStoryMeta = Breadcrumb.bind({});
BreadcrumbsWithAnchors.args = {
    content: html`
        <a href="#">Breadcrumb Item 1</a>
        <a href="#">Breadcrumb Item 2</a>
        <a href="#">Breadcrumb Item 3</a>
    `,
};
