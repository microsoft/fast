import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTDisclosure } from "../disclosure.js";

type DisclosureStoryArgs = Args & FASTDisclosure;
type DisclosureStoryMeta = Meta<DisclosureStoryArgs>;

const storyTemplate = html<DisclosureStoryArgs>`
    <fast-disclosure summary="${x => x.summary}" ?expanded="${x => x.expanded}">
        ${x => x.detail}
    </fast-disclosure>
`;

export default {
    title: "Disclosure",
    args: {
        summary: "More about Flash",
        detail: html`
            <span slot="end">⚡️</span>
            <div style="color: var(--neutral-foreground-rest)">
                Created by writer Gardner Fox and artist Harry Lampert, the original Flash
                first appeared in Flash Comics #1 (cover date January 1940/release month
                November 1939). Nicknamed the "Scarlet Speedster", all incarnations of the
                Flash possess "super speed", which includes the ability to run, move, and
                think extremely fast, use superhuman reflexes, and seemingly violate
                certain laws of physics.
            </div>
        `,
    },
    argTypes: {
        expanded: { control: { type: "boolean" } },
    },
} as DisclosureStoryMeta;

export const Disclosure = (args: DisclosureStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
