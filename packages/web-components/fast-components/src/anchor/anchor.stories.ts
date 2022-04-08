import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import { renderComponent } from "../storybook-helpers.js";
import type { Anchor } from "./index.js";

const componentTemplate = html<Anchor & Args>`
    <fast-anchor
        appearance="${x => x.appearance || null}"
        href="${x => x.href || null}"
        target="${x => x.target || null}"
        hreflang="${x => x.hreflang || null}"
    >
        ${x => x.content}
    </fast-anchor>
`;

export default {
    title: "Anchor",
    args: {
        content: "Anchor",
        href: "#",
    },
    argTypes: {
        download: {
            control: "text",
        },
        hreflang: {
            control: "text",
        },
        ping: {
            control: "text",
        },
        referrerpolicy: {
            control: "text",
        },
        rel: {
            control: "text",
        },
        type: {
            control: "text",
        },
        target: {
            description: "anchor target",
            control: "select",
            options: ["_self", "_blank", "_parent", "_top"],
        },
        appearance: {
            control: "select",
            options: [
                "neutral",
                "accent",
                "hypertext",
                "lightweight",
                "outline",
                "stealth",
            ],
        },
    },
} as Meta<Anchor>;

export const Primary = renderComponent(componentTemplate).bind({});

export const WithTarget = renderComponent(componentTemplate).bind({});
WithTarget.args = {
    target: "_blank",
    content: "Open in a new window",
};

export const NeutralAppearance = renderComponent(componentTemplate).bind({});
NeutralAppearance.args = {
    appearance: "neutral",
    content: "Neutral Appearance",
};

export const AccentAppearance = renderComponent(componentTemplate).bind({});
AccentAppearance.args = {
    appearance: "accent",
    content: "Accent Appearance",
};

export const HypertextAppearance = renderComponent(componentTemplate).bind({});
HypertextAppearance.args = {
    appearance: "hypertext",
    content: "Hypertext Appearance",
};

export const LightweightAppearance = renderComponent(componentTemplate).bind({});
LightweightAppearance.args = {
    appearance: "lightweight",
    content: "Lightweight Appearance",
};

export const OutlineAppearance = renderComponent(componentTemplate).bind({});
OutlineAppearance.args = {
    appearance: "outline",
    content: "Outline Appearance",
};

export const StealthAppearance = renderComponent(componentTemplate).bind({});
StealthAppearance.args = {
    appearance: "stealth",
    content: "Stealth Appearance",
};

export const NoHref = renderComponent(componentTemplate).bind({});
NoHref.args = {
    appearance: "hypertext",
    href: null,
};
