import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTSwitch } from "../switch.js";

const storyTemplate = html<StoryArgs<FASTSwitch>>`
    <fast-switch
        ?readonly="${x => x.readOnly}"
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        ?required="${x => x.required}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-switch>
`;

export default {
    title: "Switch",
    args: {
        checked: false,
        disabled: false,
        readOnly: false,
        required: false,
    },
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        storyContent: { table: { disable: true } },
        value: { control: "text" },
    },
} as Meta<FASTSwitch>;

export const Switch = renderComponent(storyTemplate).bind({});

export const SwitchInForm: Story<FASTSwitch> = renderComponent(
    html<StoryArgs<FASTSwitch>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <br />
            <fast-button type="submit">Submit</fast-button>
        </form>
    `
).bind({});
SwitchInForm.args = {
    required: true,
    storyContent: html`
        Sign up for our newsletter?
    `,
};
