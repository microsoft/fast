import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTNumberField } from "../number-field.js";

const storyTemplate = html<StoryArgs<FASTNumberField>>`
    <fast-number-field
        ?readonly="${x => x.readOnly}"
        ?required="${x => x.required}"
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        ?hide-step="${x => x.hideStep}"
        :list="${x => x.list}"
        step="${x => x.step}"
        max="${x => x.max}"
        maxlength="${x => x.maxlength}"
        min="${x => x.min}"
        minlength="${x => x.minlength}"
        placeholder="${x => x.placeholder}"
        size="${x => x.size}"
        value="${x => x.value}"
        :ariaAtomic="${x => x.ariaAtomic}"
        :ariaBusy="${x => x.ariaBusy}"
        :ariaControls="${x => x.ariaControls}"
        :ariaCurrent="${x => x.ariaCurrent}"
        :ariaDescribedby="${x => x.ariaDescribedby}"
        :ariaDetails="${x => x.ariaDetails}"
        :ariaDisabled="${x => x.ariaDisabled}"
        :ariaErrormessage="${x => x.ariaErrormessage}"
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
    </fast-number-field>
`;

export default {
    title: "Number Field",
    args: {
        readOnly: false,
        required: false,
        autofocus: false,
        disabled: false,
        hideStep: false,
        storyContent: "Number Field",
    },
    argTypes: {
        autofocus: { control: "boolean" },
        disabled: { control: "boolean" },
        hideStep: { control: "boolean" },
        step: { control: "number" },
        list: { control: "text" },
        max: { control: "number" },
        maxlength: { control: "number" },
        min: { control: "number" },
        minlength: { control: "number" },
        placeholder: { control: "text" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        size: { control: "number" },
        value: { control: "number" },
        valueAsNumber: { control: "number" },
        ariaAtomic: { control: "text" },
        ariaBusy: { control: "text" },
        ariaControls: { control: "text" },
        ariaCurrent: { control: "text" },
        ariaDescribedby: { control: "text" },
        ariaDetails: { control: "text" },
        ariaDisabled: { control: "text" },
        ariaErrormessage: { control: "text" },
        ariaFlowto: { control: "text" },
        ariaHaspopup: { control: "text" },
        ariaHidden: { control: "text" },
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
} as Meta<FASTNumberField>;

export const NumberField: Story<FASTNumberField> = renderComponent(storyTemplate).bind(
    {}
);

export const NumberFieldWithIcons: Story<FASTNumberField> = NumberField.bind({});
NumberFieldWithIcons.args = {
    storyContent: html`
        <svg width="20" height="20" slot="start"><use href="#test-icon" /></svg>
        Number Field
        <svg width="20" height="20" slot="end"><use href="#test-icon-2" /></svg>
    `,
};

export const NumberFieldInForm: Story<FASTNumberField> = renderComponent(html`
    <form @submit="${() => false}">
        ${storyTemplate}
        <fast-button type="submit">Submit</fast-button>
    </form>
`).bind({});
