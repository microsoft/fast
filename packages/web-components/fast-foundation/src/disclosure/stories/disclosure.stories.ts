import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTDisclosure } from "../disclosure.js";

const storyTemplate = html<StoryArgs<FASTDisclosure>>`
    <fast-disclosure summary="${x => x.summary}" ?expanded="${x => x.expanded}">
        ${x => x.storyContent}
    </fast-disclosure>
`;

export default {
    title: "Disclosure",
    args: {
        expanded: false,
    },
    argTypes: {
        expanded: { control: "boolean" },
        storyContent: { table: { disable: true } },
        summary: { control: "text" },
    },
} as Meta<FASTDisclosure>;

export const Disclosure: Story<FASTDisclosure> = renderComponent(storyTemplate).bind({});
Disclosure.args = {
    storyContent: html`
        <span slot="end">⚡️</span>
        <div style="color: var(--neutral-foreground-rest)">
            Created by writer Gardner Fox and artist Harry Lampert, the original Flash
            first appeared in Flash Comics #1 (cover date January 1940/release month
            November 1939). Nicknamed the "Scarlet Speedster", all incarnations of the
            Flash possess "super speed", which includes the ability to run, move, and
            think extremely fast, use superhuman reflexes, and seemingly violate certain
            laws of physics.
        </div>
    `,
    summary: "More about Flash",
};

export const DisclosureWithSlottedStartEnd: Story<FASTDisclosure> = Disclosure.bind({});
DisclosureWithSlottedStartEnd.args = {
    storyContent: html`
        <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
        Disclosure content
        <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
    `,
    summary: "Summary",
};
