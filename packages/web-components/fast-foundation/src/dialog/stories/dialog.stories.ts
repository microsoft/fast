import { html, ref } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTDialog } from "../dialog.js";

const storyTemplate = html<StoryArgs<FASTDialog>>`
    <fast-dialog
        ?modal="${x => x.modal}"
        ?hidden="${x => x.hidden}"
        ?no-focus-trap="${x => x.noFocusTrap}"
        :ariaDescribedby="${x => x.ariaDescribedby}"
        :ariaLabelledby="${x => x.ariaLabelledby}"
        :ariaLabel="${x => x.ariaLabel}"
    >
        ${x => x.storyContent}
    </fast-dialog>
`;

export default {
    title: "Dialog",
    args: {
        hidden: false,
        modal: false,
        noFocusTrap: false,
    },
    argTypes: {
        hidden: { control: "boolean" },
        modal: { control: "boolean" },
        noFocusTrap: { control: "boolean" },
        ariaDescribedby: { control: "text" },
        ariaLabel: { control: "text" },
        ariaLabelledby: { control: "text" },
        storyContent: { table: { disable: true } },
    },
    // docs are disabled since the modals would all load at once on the docs page
    parameters: { docs: { disable: true } },
} as Meta<FASTDialog>;

export const Dialog: Story<FASTDialog> = renderComponent(storyTemplate).bind({});
Dialog.args = {
    storyContent: html`
        <fast-button>Button A</fast-button>
        <button>Button B</button>
        <fast-checkbox>A checkbox</fast-checkbox>
        <fast-toolbar>
            <fast-button>One</fast-button>
            <fast-button>Three</fast-button>
        </fast-toolbar>
    `,
};

export const DialogModal: Story<FASTDialog> = Dialog.bind({});
DialogModal.args = {
    modal: true,
    storyContent: "A modal dialog element",
};

export const DialogWithDismiss: Story<FASTDialog> = renderComponent(
    html<StoryArgs<FASTDialog>>`
        <div>
            <fast-button @click="${x => x.dialogRef.show()}" class="show-dialog">
                show dialog
            </fast-button>
            <fast-dialog
                ?modal="${x => x.modal}"
                ?no-focus-trap="${x => x.noFocusTrap}"
                @dismiss="${x => x.dialogRef.hide()}"
                ${ref("dialogRef")}
            >
                ${x => x.storyContent}
            </fast-dialog>
        </div>
    `
).bind({});
DialogWithDismiss.args = {
    modal: true,
    storyContent: html`
        <p>press Escape or click the button below to close</p>
        <fast-button @click="${x => x.dialogRef.hide()}" class="hide-dialog">
            dismiss dialog
        </fast-button>
    `,
};
