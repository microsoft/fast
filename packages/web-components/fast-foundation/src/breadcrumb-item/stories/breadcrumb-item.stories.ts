import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTBreadcrumbItem } from "../breadcrumb-item.js";

const storyTemplate = html<StoryArgs<FASTBreadcrumbItem>>`
    <fast-breadcrumb-item
        download="${x => x.download}"
        href="${x => x.href}"
        hreflang="${x => x.hreflang}"
        ping="${x => x.ping}"
        referrerpolicy="${x => x.referrerpolicy}"
        rel="${x => x.rel}"
        target="${x => x.target}"
        type="${x => x.type}"
        :separator="${x => x.separator}"
        :ariaAtomic="${x => x.ariaAtomic}"
        :ariaBusy="${x => x.ariaBusy}"
        :ariaControls="${x => x.ariaControls}"
        :ariaCurrent="${x => x.ariaCurrent}"
        :ariaDescribedby="${x => x.ariaDescribedby}"
        :ariaDetails="${x => x.ariaDetails}"
        :ariaDisabled="${x => x.ariaDisabled}"
        :ariaErrormessage="${x => x.ariaErrormessage}"
        :ariaExpanded="${x => x.ariaExpanded}"
        :ariaFlowto="${x => x.ariaFlowto}"
        :ariaHaspopup="${x => x.ariaHaspopup}"
        :ariaHidden="${x => x.ariaHidden}"
        :ariaInvalid="${x => x.ariaInvalid}"
        :ariaKeyshortcuts="${x => x.ariaKeyshortcuts}"
        :ariaLabel="${x => x.ariaLabel}"
        :ariaLabelledby="${x => x.ariaLabelledby}"
        :ariaLive="${x => x.ariaLive}"
        :ariaOwns="${x => x.ariaOwns}"
        :ariaRelevant="${x => x.ariaRelevant}"
        :ariaRoledescription="${x => x.ariaRoledescription}"
    >
        ${x => x.storyContent}
    </fast-breadcrumb-item>
`;

export default {
    title: "Breadcrumb Item",
    argTypes: {
        download: { control: "text" },
        href: { control: "text" },
        hreflang: { control: "text" },
        ping: { control: "text" },
        referrerpolicy: { control: "text" },
        rel: { control: "text" },
        separator: { control: "boolean" },
        target: { control: "text" },
        type: { control: "text" },
        ariaAtomic: { control: "boolean" },
        ariaBusy: { control: "boolean" },
        ariaControls: { control: "text" },
        ariaCurrent: { control: "text" },
        ariaDescribedby: { control: "text" },
        ariaDetails: { control: "text" },
        ariaDisabled: { control: "boolean" },
        ariaErrormessage: { control: "text" },
        ariaExpanded: { control: "boolean" },
        ariaFlowto: { control: "text" },
        ariaHaspopup: { control: "boolean" },
        ariaHidden: { control: "boolean" },
        ariaInvalid: { control: "text" },
        ariaKeyshortcuts: { control: "text" },
        ariaLabel: { control: "text" },
        ariaLabelledby: { control: "text" },
        ariaLive: { control: "text" },
        ariaOwns: { control: "text" },
        ariaRelevant: { control: "text" },
        ariaRoledescription: { control: "text" },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTBreadcrumbItem>;

export const BreadcrumbItem: Story<FASTBreadcrumbItem> = renderComponent(
    storyTemplate
).bind({});
BreadcrumbItem.args = {
    storyContent: "Breadcrumb Item",
};

export const BreadcrumbItemWithHref: Story<FASTBreadcrumbItem> = BreadcrumbItem.bind({});
BreadcrumbItemWithHref.args = {
    storyContent: "Breadcrumb item with href attribute",
    href: "https://www.fast.design/",
};

export const BreadcrumbItemWithSlottedStart: Story<FASTBreadcrumbItem> = BreadcrumbItem.bind(
    {}
);
BreadcrumbItemWithSlottedStart.args = {
    storyContent: html`
        Breadcrumb Item with slotted start icon
        <svg width="20" height="20" slot="start"><use href="#test-icon" /></svg>
    `,
};

export const BreadcrumbItemWithSlottedEnd: Story<FASTBreadcrumbItem> = BreadcrumbItem.bind(
    {}
);
BreadcrumbItemWithSlottedEnd.args = {
    storyContent: html`
        Breadcrumb item with slotted end icon
        <svg width="20" height="20" slot="end"><use href="#test-icon-2" /></svg>
    `,
};
