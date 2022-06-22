import { html } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { Args, Meta } from "@storybook/html";
import type { Toolbar as FoundationToolbar } from "../toolbar.js";

type ToolbarStoryArgs = Args & FoundationToolbar;
type ToolbarStoryMeta = Meta<ToolbarStoryArgs>;

const componentTemplate = html<ToolbarStoryArgs>`
    <fast-toolbar orientation="${x => x.orientation}">
        ${x => x.content}
    </fast-toolbar>
`;

export default {
    title: "Toolbar",
    argTypes: {
        content: { control: { type: "string" } },
        orientation: { options: Object.values(Orientation), control: { type: "radio" } },
    },
} as ToolbarStoryMeta;

export const Toolbar = (args: ToolbarStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

Toolbar.argTypes = {
    content: { table: { disable: true } },
};

Toolbar.args = {
    content: html`
        <button>Button</button>
        <button slot="end">End Slot Button</button>
        <button slot="start">Start Slot Button</button>
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
