import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTAnchor } from "../anchor.js";
import { AnchorTarget } from "../anchor.options.js";

const storyTemplate = html<StoryArgs<FASTAnchor>>`
    <fast-anchor
        download="${x => x.download}"
        href="${x => x.href}"
        hreflang="${x => x.hreflang}"
        ping="${x => x.ping}"
        referrerpolicy="${x => x.referrerpolicy}"
        rel="${x => x.rel}"
        target="${x => x.target}"
        type="${x => x.type}"
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
    </fast-anchor>
`;

export default {
    title: "Anchor",
    argTypes: {
        download: { control: "text" },
        href: { control: "text" },
        hreflang: { control: "text" },
        ping: { control: "text" },
        referrerpolicy: { control: "text" },
        rel: { control: "text" },
        target: { control: "select", options: Object.values(AnchorTarget) },
        type: { control: "text" },
        ariaAtomic: { control: "boolean" },
        ariaBusy: { control: "boolean" },
        ariaCurrent: { control: "text" },
        ariaControls: { control: "text" },
        ariaDescribedby: { control: "text" },
        ariaDisabled: { control: "text" },
        ariaDetails: { control: "text" },
        ariaErrormessage: { control: "text" },
        ariaExpanded: { control: "text" },
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
} as Meta<FASTAnchor>;

export const Anchor: Story<FASTAnchor> = renderComponent(storyTemplate).bind({});
Anchor.args = {
    href: "https://www.fast.design/",
    storyContent: "Anchor",
};

export const AnchorWithIcons: Story<FASTAnchor> = Anchor.bind({});
AnchorWithIcons.args = {
    href: "https://www.fast.design/",
    storyContent: html`
        <svg width="20" height="20" slot="start"><use href="#test-icon" /></svg>
        Anchor
        <svg width="20" height="20" slot="end"><use href="#test-icon-2" /></svg>
    `,
};

export const AnchorWithIconOnly: Story<FASTAnchor> = Anchor.bind({});
AnchorWithIconOnly.args = {
    href: "https://www.fast.design/",
    storyContent: html`
        <svg width="20" height="20"><use href="#test-icon" /></svg>
    `,
};
