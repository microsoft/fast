import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTButton } from "../button.js";
import { ButtonType } from "../button.options.js";

const storyTemplate = html<StoryArgs<FASTButton>>`
    <fast-button
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        ?formnovalidate="${x => x.formnovalidate}"
        form="${x => x.formId}"
        formaction="${x => x.formaction}"
        formenctype="${x => x.formenctype}"
        formmethod="${x => x.formmethod}"
        formtarget="${x => x.formtarget}"
        name="${x => x.name}"
        type="${x => x.type}"
        value="${x => x.value}"
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
        :ariaPressed="${x => x.ariaPressed}"
        :ariaRelevant="${x => x.ariaRelevant}"
        :ariaRoledescription="${x => x.ariaRoledescription}"
    >
        ${x => x.storyContent}
    </fast-button>
`;

export default {
    title: "Button",
    args: {
        autofocus: false,
        disabled: false,
        formnovalidate: false,
        storyContent: "Button",
    },
    argTypes: {
        autofocus: { control: "boolean" },
        disabled: { control: "boolean" },
        formaction: { control: "text" },
        formenctype: { control: "text" },
        formId: { control: "text" },
        formmethod: { control: "text" },
        formnovalidate: { control: "boolean" },
        formtarget: { control: "text" },
        inputValue: { table: { disable: true } },
        name: { control: "text" },
        type: { control: "select", options: Object.values(ButtonType) },
        value: { control: "text" },
        ariaAtomic: { control: "text" },
        ariaBusy: { control: "text" },
        ariaControls: { control: "text" },
        ariaCurrent: { control: "text" },
        ariaDescribedby: { control: "text" },
        ariaDetails: { control: "text" },
        ariaDisabled: { control: "text" },
        ariaErrormessage: { control: "text" },
        ariaExpanded: { control: "text" },
        ariaFlowto: { control: "text" },
        ariaHaspopup: { control: "text" },
        ariaHidden: { control: "text" },
        ariaInvalid: { control: "text" },
        ariaKeyshortcuts: { control: "text" },
        ariaLabel: { control: "text" },
        ariaLabelledby: { control: "text" },
        ariaLive: { control: "text" },
        ariaOwns: { control: "text" },
        ariaPressed: { control: "text" },
        ariaRelevant: { control: "text" },
        ariaRoledescription: { control: "text" },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTButton>;

export const Button: Story<FASTButton> = renderComponent(storyTemplate).bind({});

export const ButtonInForm: Story<FASTButton> = renderComponent(
    html<StoryArgs<FASTButton>>`
        <form @submit="${() => false}">
            <fast-text-field value="${x => x.inputValue}"></fast-text-field>
            ${storyTemplate}
        </form>
    `
).bind({});

export const ButtonWithSubmitType: Story<FASTButton> = ButtonInForm.bind({});
ButtonWithSubmitType.args = {
    inputValue: "Hello world",
    storyContent: "Submit",
    type: "submit",
};

export const ButtonWithResetType: Story<FASTButton> = ButtonInForm.bind({});
ButtonWithResetType.args = {
    storyContent: "Reset",
    type: "reset",
};

export const ButtonWithSlottedStartEnd: Story<FASTButton> = Button.bind({});
ButtonWithSlottedStartEnd.args = {
    storyContent: html`
        <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
        Button
        <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
    `,
};

export const ButtonWithSlottedIconContent: Story<FASTButton> = Button.bind({});
ButtonWithSlottedIconContent.args = {
    storyContent: html`
        <svg width="20" height="20"><use href="#test-icon" /></svg>
    `,
};
