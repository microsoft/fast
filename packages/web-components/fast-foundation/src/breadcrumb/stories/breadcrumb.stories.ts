import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTBreadcrumb } from "../breadcrumb.js";

const storyTemplate = html<StoryArgs<FASTBreadcrumb>>`
    <fast-breadcrumb>${x => x.storyContent}</fast-breadcrumb>
`;

export default {
    title: "Breadcrumb",
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTBreadcrumb>;

export const Breadcrumb: Story<FASTBreadcrumb> = renderComponent(storyTemplate).bind({});
Breadcrumb.args = {
    storyContent: html`
        <svg width="20" height="20" slot="start"><use href="#test-icon"/></svg>
        <fast-breadcrumb-item href="#">Breadcrumb Item 1</fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">Breadcrumb Item 2</fast-breadcrumb-item>
        <fast-breadcrumb-item>Breadcrumb Item 3</fast-breadcrumb-item>
        <svg width="20" height="20" slot="end"><use href="#test-icon-2"/></svg>
    `,
};

export const BreadcrumbWithSeparators: Story<FASTBreadcrumb> = Breadcrumb.bind({});
BreadcrumbWithSeparators.args = {
    storyContent: html`
        <fast-breadcrumb-item href="#">
            Breadcrumb Item 1
            <svg
                slot="separator"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5.65 3.15a.5.5 0 000 .7L9.79 8l-4.14 4.15a.5.5 0 00.7.7l4.5-4.5a.5.5 0 000-.7l-4.5-4.5a.5.5 0 00-.7 0z"
                />
            </svg>
        </fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">
            Breadcrumb Item 2
            <svg
                slot="separator"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5.65 3.15a.5.5 0 000 .7L9.79 8l-4.14 4.15a.5.5 0 00.7.7l4.5-4.5a.5.5 0 000-.7l-4.5-4.5a.5.5 0 00-.7 0z"
                />
            </svg>
        </fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">
            Breadcrumb Item 3
            <svg
                slot="separator"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5.65 3.15a.5.5 0 000 .7L9.79 8l-4.14 4.15a.5.5 0 00.7.7l4.5-4.5a.5.5 0 000-.7l-4.5-4.5a.5.5 0 00-.7 0z"
                />
            </svg>
        </fast-breadcrumb-item>
    `,
};

export const BreadcrumbWithAnchors: Story<FASTBreadcrumb> = Breadcrumb.bind({});
BreadcrumbWithAnchors.args = {
    storyContent: html`
        <a href="#">Anchor 1</a>
        <a href="#">Anchor 2</a>
        <a href="#">Anchor 3</a>
    `,
};
