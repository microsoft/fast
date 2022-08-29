import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import { FASTTextField, TextFieldType } from "../text-field.js";

const storyTemplate = html<StoryArgs<FASTTextField>>`
    <fast-text-field
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        ?readonly="${x => x.readOnly}"
        ?required="${x => x.required}"
        ?spellcheck="${x => x.spellcheck}"
        list="${x => x.list}"
        maxlength="${x => x.maxlength}"
        minlength="${x => x.minlength}"
        name="${x => x.name}"
        pattern="${x => x.pattern}"
        placeholder="${x => x.placeholder}"
        resize="${x => x.resize}"
        size="${x => x.size}"
        tabindex="${x => (x.disabled ? null : "0")}"
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
    </fast-text-field>
`;

export default {
    title: "Text Field",
    args: {
        autofocus: false,
        disabled: false,
        readOnly: false,
        required: false,
        spellcheck: false,
        storyContent: "Text Field",
    },
    argTypes: {
        autofocus: { control: "boolean" },
        disabled: { control: "boolean" },
        list: { control: "text" },
        maxlength: { control: "number" },
        minlength: { control: "number" },
        name: { control: "text" },
        pattern: { control: "text" },
        placeholder: { control: "text" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        size: { control: "number" },
        spellcheck: { control: "boolean" },
        type: { control: "select", options: Object.values(TextFieldType) },
        value: { control: "text" },
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
} as Meta<FASTTextField>;

export const TextField: Story<FASTTextField> = renderComponent(storyTemplate).bind({});

export const TextFieldWithIcons: Story<FASTTextField> = TextField.bind({});
TextFieldWithIcons.args = {
    storyContent: html`
        <svg width="20" height="20" slot="start"><use href="#test-icon" /></svg>
        Text Field
        <svg width="20" height="20" slot="end"><use href="#test-icon-2" /></svg>
    `,
};

export const TextFieldInForm: Story<FASTTextField> = renderComponent(
    html<StoryArgs<FASTTextField>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <fast-button type="submit">Submit</fast-button>
        </form>
    `
).bind({});
