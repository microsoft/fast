import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTRadio } from "../radio.js";

export const storyTemplate = html<StoryArgs<FASTRadio>>`
    <fast-radio
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        ?required="${x => x.required}"
        name="${x => x.name}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-radio>
`;

export default {
    title: "Radio",
    excludeStories: ["storyTemplate"],
    args: {
        checked: false,
        disabled: false,
        required: false,
        storyContent: "Label",
    },
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        name: { control: "text" },
        required: { control: "boolean" },
        storyContent: { table: { disable: true } },
        value: { control: "text" },
    },
} as Meta<FASTRadio>;

export const Radio: Story<FASTRadio> = renderComponent(storyTemplate).bind({});

export const RadioInForm: Story<FASTRadio> = renderComponent(
    html<StoryArgs<FASTRadio>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <fast-button type="submit">Submit</fast-button>
        </form>
    `
).bind({});
