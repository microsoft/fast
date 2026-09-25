import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTToolbar } from "../toolbar.js";
import { ToolbarOrientation } from "../toolbar.options.js";

const storyTemplate = html<StoryArgs<FASTToolbar>>`
    <fast-toolbar
        orientation="${x => x.orientation}"
        :ariaLabel="${x => x.ariaLabel}"
        :ariaLabelledby="${x => x.ariaLabelledby}"
    >
        ${x => x.storyContent}
    </fast-toolbar>
`;

export default {
    title: "Toolbar",
    argTypes: {
        orientation: { control: "radio", options: Object.values(ToolbarOrientation) },
        ariaLabel: { control: "text" },
        ariaLabelledby: { control: "text" },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTToolbar>;

export const Toolbar: Story<FASTToolbar> = renderComponent(storyTemplate).bind({});
Toolbar.args = {
    storyContent: html`
        <button>Button</button>
        <select>
            <option>Option 1</option>
            <option>Second option</option>
            <option>Option 3</option>
        </select>
        <label for="check-1">
            <input type="checkbox" name="checkbox" id="check-1" />
            Checkbox 1
        </label>
        <label for="check-2">
            <input type="checkbox" name="checkbox" id="check-2" />
            Checkbox 2
        </label>
        <label for="check-3">
            <input type="checkbox" name="checkbox" id="check-3" />
            Checkbox 3
        </label>
        <input type="text" name="text" id="text-input" />
    `,
};

export const ToolbarWithSlottedStartEnd: Story<FASTToolbar> = Toolbar.bind({});
ToolbarWithSlottedStartEnd.args = {
    storyContent: html`
        <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
        <button>Button</button>
        <select>
            <option>Option 1</option>
            <option>Second option</option>
            <option>Option 3</option>
        </select>
        <label for="check-1">
            <input type="checkbox" name="checkbox" id="check-1" />
            Checkbox 1
        </label>
        <label for="check-2">
            <input type="checkbox" name="checkbox" id="check-2" />
            Checkbox 2
        </label>
        <label for="check-3">
            <input type="checkbox" name="checkbox" id="check-3" />
            Checkbox 3
        </label>
        <input type="text" name="text" id="text-input" />
        <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
    `,
};

export const ToolbarButtonFocusTest: Story<FASTToolbar> = Toolbar.bind({});
ToolbarButtonFocusTest.args = {
    storyContent: html`
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
        <button>Button 4</button>
        <button>Button 5</button>
        <button slot="start">Start Slot Button</button>
        <button slot="end">End Slot Button</button>
    `,
};
