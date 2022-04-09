import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Button } from "../index-rollup.js";
import { renderComponent } from "../storybook-helpers.js";
import type { Dialog } from "./index.js";

const componentTemplate = html<Dialog & Args>`
    <fast-button>Show Dialog</fast-button>
    <fast-dialog
        hidden
        id="${x => x.id}"
        aria-label="${x => x.ariaLabel}"
        modal="${x => x.modal}"
        trap-focus="${x => x.trapFocus}"
    >
        ${x => x.content}
    </fast-dialog>
`;

export default {
    title: "Dialog",
    decorators: [
        Story => {
            const renderedStory = Story() as DocumentFragment;

            const dialog = renderedStory.querySelector("fast-dialog") as Dialog;
            dialog.addEventListener("dismiss", () => {
                dialog.hidden = true;
            });

            const showDialogButton = renderedStory.querySelector<Button>("fast-button");
            showDialogButton?.addEventListener("click", () => {
                dialog.hidden = false;
            });

            return renderedStory;
        },
    ],
} as Meta<Dialog>;

export const Primary = renderComponent(componentTemplate).bind({});

export const WithFocusableContent = renderComponent(componentTemplate).bind({});
WithFocusableContent.args = {
    content: html`
        <fast-button>Button A</fast-button>
        <button>Button B</button>
        <fast-checkbox>A checkbox</fast-checkbox>
        <fast-toolbar>
            <fast-button>One</fast-button>
            <fast-button>Three</fast-button>
        </fast-toolbar>
        (Press the Escape key to close)
    `,
};
