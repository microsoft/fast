import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import { renderComponent } from "../storybook-helpers.js";
import type { Button } from "./index.js";

const componentTemplate = html<Button & Args>`
    <fast-button
        aria-label="${x => x.ariaLabel}"
        ?disabled="${x => x.disabled}"
        appearance="${x => x.appearance}"
        href="${x => x.href}"
        target="${x => x.target}"
        hreflang="${x => x.hreflang}"
    >
        ${x => x.content}
    </fast-button>
`;

export default {
    title: "Button",
    args: {
        content: "Button",
    },
    argTypes: {
        autofocus: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        formId: {
            control: "text",
        },
        formaction: {
            control: "text",
        },
        formenctype: {
            control: "text",
        },
        formnovalidate: "boolean",
        formmethod: {
            control: "text",
        },
        formtarget: {
            control: "text",
            options: ["_self", "_blank", "_parent", "_top"],
        },
        type: {
            control: "select",
            options: ["submit", "reset", "button"],
        },
        appearance: {
            control: "select",
            options: ["accent", "lightweight", "neutral", "outline", "stealth"],
        },
    },
} as Meta<typeof Button>;

export const Primary = renderComponent(componentTemplate).bind({});

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

export const WithStartSlot = renderComponent(componentTemplate).bind({});
WithStartSlot.args = {
    content: html`
        Button
        <svg slot="start" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.5 7.7h-1v-1h1v1zm4.1 0h-1v-1h1v1zm4.1-1v2.1h-1v2.6l-.1.6-.3.5c-.1.1-.3.3-.5.3l-.6.1H10l-3.5 3v-3H3.9l-.6-.1-.5-.3c-.1-.1-.3-.3-.3-.5l-.1-.6V8.8h-1V6.7h1V5.2l.1-.6.3-.5c.1-.1.3-.3.5-.3l.6-.1h3.6V1.9a.8.8 0 01-.4-.4L7 1V.6l.2-.3.3-.2L8 0l.4.1.3.2.3.3V1l-.1.5-.4.4v1.7h3.6l.6.1.5.3c.1.1.3.3.3.5l.1.6v1.5h1.1zm-2.1-1.5l-.2-.4-.4-.2H3.9l-.4.2-.1.4v6.2l.2.4.4.2h3.6v1.8L9.7 12h2.5l.4-.2.2-.4V5.2zM5.8 8.9l1 .7 1.2.2a5 5 0 001.2-.2l1-.7.7.7c-.4.4-.8.7-1.4.9-.5.2-1 .3-1.6.3s-1.1-.1-1.6-.3A3 3 0 015 9.6l.8-.7z"
            />
        </svg>
    `,
};

export const WithEndSlot = renderComponent(componentTemplate).bind({});
WithEndSlot.args = {
    content: html`
        Button
        <svg slot="end" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.5 7.7h-1v-1h1v1zm4.1 0h-1v-1h1v1zm4.1-1v2.1h-1v2.6l-.1.6-.3.5c-.1.1-.3.3-.5.3l-.6.1H10l-3.5 3v-3H3.9l-.6-.1-.5-.3c-.1-.1-.3-.3-.3-.5l-.1-.6V8.8h-1V6.7h1V5.2l.1-.6.3-.5c.1-.1.3-.3.5-.3l.6-.1h3.6V1.9a.8.8 0 01-.4-.4L7 1V.6l.2-.3.3-.2L8 0l.4.1.3.2.3.3V1l-.1.5-.4.4v1.7h3.6l.6.1.5.3c.1.1.3.3.3.5l.1.6v1.5h1.1zm-2.1-1.5l-.2-.4-.4-.2H3.9l-.4.2-.1.4v6.2l.2.4.4.2h3.6v1.8L9.7 12h2.5l.4-.2.2-.4V5.2zM5.8 8.9l1 .7 1.2.2a5 5 0 001.2-.2l1-.7.7.7c-.4.4-.8.7-1.4.9-.5.2-1 .3-1.6.3s-1.1-.1-1.6-.3A3 3 0 015 9.6l.8-.7z"
            />
        </svg>
    `,
};

export const WithIconInDefaultSlot = renderComponent(componentTemplate).bind({});
WithIconInDefaultSlot.args = {
    content: html`
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.5 7.7h-1v-1h1v1zm4.1 0h-1v-1h1v1zm4.1-1v2.1h-1v2.6l-.1.6-.3.5c-.1.1-.3.3-.5.3l-.6.1H10l-3.5 3v-3H3.9l-.6-.1-.5-.3c-.1-.1-.3-.3-.3-.5l-.1-.6V8.8h-1V6.7h1V5.2l.1-.6.3-.5c.1-.1.3-.3.5-.3l.6-.1h3.6V1.9a.8.8 0 01-.4-.4L7 1V.6l.2-.3.3-.2L8 0l.4.1.3.2.3.3V1l-.1.5-.4.4v1.7h3.6l.6.1.5.3c.1.1.3.3.3.5l.1.6v1.5h1.1zm-2.1-1.5l-.2-.4-.4-.2H3.9l-.4.2-.1.4v6.2l.2.4.4.2h3.6v1.8L9.7 12h2.5l.4-.2.2-.4V5.2zM5.8 8.9l1 .7 1.2.2a5 5 0 001.2-.2l1-.7.7.7c-.4.4-.8.7-1.4.9-.5.2-1 .3-1.6.3s-1.1-.1-1.6-.3A3 3 0 015 9.6l.8-.7z"
            />
        </svg>
    `,
};

export const WithAriaLabel = renderComponent(componentTemplate).bind({});
WithAriaLabel.args = {
    ariaLabel: "Button with aria-label",
    content: "Button",
};

const formTemplate = html`
    <form>
        <input type="text" name="test" />
        <fast-button type="${x => x.type}">${x => x.content}</fast-button>
    </form>
`;

export const SubmitType = renderComponent(formTemplate).bind({});
SubmitType.args = {
    type: "submit",
    content: "Submit",
};

export const ResetType = renderComponent(formTemplate).bind({});
ResetType.args = {
    type: "reset",
    content: "Reset",
};
