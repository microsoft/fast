import { html, ref } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTDialog } from "../dialog.js";

type DialogStoryArgs = Args & FASTDialog;
type DialogStoryMeta = Meta<DialogStoryArgs>;

const componentTemplate = html<DialogStoryArgs>`
    <fast-dialog ?modal="${x => x.modal}" ?no-focus-trap="${x => x.noFocusTrap}">
        ${x => x.content}
    </fast-dialog>
`;

export default {
    title: "Dialog",
    args: {
        content: html`
            <fast-button>Button A</fast-button>
            <button>Button B</button>
            <fast-checkbox>A checkbox</fast-checkbox>
            <fast-toolbar>
                <fast-button>One</fast-button>
                <fast-button>Three</fast-button>
            </fast-toolbar>
        `,
    },
    argTypes: {
        content: {
            table: { disable: true },
        },
    },
    // docs are disabled since the modals would all load at once on the docs page
    parameters: {
        docs: { disable: true },
    },
} as DialogStoryMeta;

export const Dialog = (args: DialogStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const DialogModal = Dialog.bind({});
DialogModal.args = {
    modal: true,
    content: "A modal dialog element",
};

export const DialogDismiss = (args: DialogStoryArgs) => {
    const componentTemplate = html<DialogStoryArgs>`
        <div>
            <fast-button @click="${(x, c) => (x.dialogRef.hidden = false)}">
                toggle dialog
            </fast-button>
            <fast-dialog
                ?modal="${x => x.modal}"
                ?no-focus-trap="${x => x.noFocusTrap}"
                hidden
                @dismiss="${(x, { event }) =>
                    ((event.target as HTMLElement).hidden = true)}"
                ${ref("dialogRef")}
            >
                ${x => x.content}
            </fast-dialog>
        </div>
    `;

    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
DialogDismiss.args = {
    modal: true,
    content: html`
        <p>press Escape to close</p>
    `,
};
