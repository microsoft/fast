import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Button as FoundationButton } from "../button.js";

type ButtonStoryArgs = Args & FoundationButton;
type ButtonStoryMeta = Meta<ButtonStoryArgs>;

export const storyTemplate = html<ButtonStoryArgs>`
    <fast-button
        hreflang="${x => x.hreflang}"
        download="${x => x.download}"
        autofocus="${x => x.autofocus}"
        formId="${x => x.formId}"
        formaction="${x => x.formaction}"
        formenctype="${x => x.formenctype}"
        formmethod="${x => x.formmethod}"
        formnovalidate="${x => x.formnovalidate}"
        formtarget="${x => x.formtarget}"
        formType="${x => x.formType}"
        type="${x => x.type}"
    >
        ${x => x?.content}
    </fast-button>
`;

export default {
    title: "Button",
    includeStories: ["Button"],
    args: {
        content: "Button",
        href: "#",
    },
    argTypes: {
        autofocus: { control: { type: "boolean" } },
        formId: { control: { type: "text" } },
        formaction: { control: { type: "text" } },
        formenctype: { control: { type: "text" } },
        formmethod: { control: { type: "text" } },
        formnovalidate: { control: { type: "boolean" } },
        formtarget: { control: { type: "text" } },
        formType: {
            options: ["_self", "_blank", "_parent", "_top"],
            control: { type: "select" },
        },
        type: {
            options: ["submit", "reset", "button"],
            control: { type: "select" },
        },
    },
} as ButtonStoryMeta;

export const Button = (args: ButtonStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
