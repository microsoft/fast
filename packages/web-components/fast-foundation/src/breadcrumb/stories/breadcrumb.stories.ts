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
        <fast-breadcrumb-item href="#">Breadcrumb Item 1</fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">Breadcrumb Item 2</fast-breadcrumb-item>
        <fast-breadcrumb-item>Breadcrumb Item 3</fast-breadcrumb-item>
    `,
};

export const BreadcrumbWithIcons: Story<FASTBreadcrumb> = Breadcrumb.bind({});
BreadcrumbWithIcons.args = {
    storyContent: html`
        <svg width="20" height="20" slot="start"><use href="#test-icon" /></svg>
        <fast-breadcrumb-item href="#">Breadcrumb Item 1</fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">Breadcrumb Item 2</fast-breadcrumb-item>
        <fast-breadcrumb-item>Breadcrumb Item 3</fast-breadcrumb-item>
        <svg width="20" height="20" slot="end"><use href="#test-icon-2" /></svg>
    `,
};

export const BreadcrumbWithSlottedSeparators: Story<FASTBreadcrumb> = Breadcrumb.bind({});
BreadcrumbWithSlottedSeparators.args = {
    storyContent: html`
        <fast-breadcrumb-item href="#">
            Breadcrumb Item 1
            <span slot="separator">/</span>
        </fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">
            Breadcrumb Item 2
            <span slot="separator">/</span>
        </fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">
            Breadcrumb Item 3
            <span slot="separator">/</span>
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
