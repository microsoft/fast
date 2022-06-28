import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { BreadcrumbItem as FoundationBreadcrumbItem } from "../breadcrumb-item.js";

type BreadcrumbItemStoryArgs = Args & FoundationBreadcrumbItem;
type BreadcrumbItemStoryMeta = Meta<BreadcrumbItemStoryArgs>;

const storyTemplate = html<BreadcrumbItemStoryArgs>`
    <fast-breadcrumb-item href="${x => x.href}">
        ${x => x.content}
    </fast-breadcrumb-item>
`;

export default {
    title: "Breadcrumb/Breadcrumb Item",
    args: {
        content: "Breadcrumb item",
    },
    argTypes: {
        href: { control: { type: "text" } },
    },
} as BreadcrumbItemStoryMeta;

export const BreadcrumbItem = (args: BreadcrumbItemStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const WithHref: BreadcrumbItemStoryMeta = BreadcrumbItem.bind({});
WithHref.args = {
    content: "Breadcrumb item with href attribute",
    href: "https://www.fast.design/",
};

export const WithSlottedStart: BreadcrumbItemStoryMeta = BreadcrumbItem.bind({});
WithSlottedStart.args = {
    content: html`
        Breadcrumb Item with slotted start icon
        <svg slot="start"><use href="#test-icon"></svg>
    `,
};

export const WithSlottedEnd: BreadcrumbItemStoryMeta = BreadcrumbItem.bind({});
WithSlottedEnd.args = {
    content: html`
        Breadcrumb item with slotted end icon
        <svg slot="end"><use href="#test-icon"></svg>
    `,
};

export const WithSlottedSeparator: BreadcrumbItemStoryMeta = BreadcrumbItem.bind({});
WithSlottedSeparator.args = {
    content: html`
        Breadcrumb item with slotted separator icon
        <svg slot="separator"><use href="#test-icon"></svg>
    `,
};
