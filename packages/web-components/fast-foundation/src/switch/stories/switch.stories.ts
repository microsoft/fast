import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTSwitch } from "../switch.js";

type SwitchStoryArgs = Args & FASTSwitch;
type SwitchStoryMeta = Meta<SwitchStoryArgs>;

const storyTemplate = html<SwitchStoryArgs>`
    <fast-switch
        ?readOnly="${x => x.readOnly}"
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        ?required="${x => x.required}"
    >
        ${x => x.label}
        <span slot="checked-message">Dark</span>
        <span slot="unchecked-message">Light</span>
    </fast-switch>
`;

export default {
    title: "Switch",
    args: {
        label: "Theme",
        checked: true,
        readOnly: false,
        disabled: false,
        required: false,
    },
    argTypes: {
        checked: { control: { type: "boolean" } },
        readOnly: { control: { type: "boolean" } },
        disabled: { control: { type: "boolean" } },
        required: { control: { type: "boolean" } },
    },
} as SwitchStoryMeta;

export const Switch = (args: SwitchStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const DisabledSwitch: SwitchStoryMeta = (args: SwitchStoryArgs) => {
    const disabledStoryTemplate = html<SwitchStoryArgs>`
        ${repeat(x => x.items, storyTemplate)}
    `;

    const storyFragment = new DocumentFragment();
    disabledStoryTemplate.render(args, storyFragment);
    return storyFragment;
};
DisabledSwitch.args = {
    items: [
        { label: "Disabled (unchecked)", checked: false, disabled: true },
        { label: "Disabled (checked)", checked: true, disabled: true },
    ],
};
DisabledSwitch.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;
        const styles = document.createElement("style");
        styles.innerHTML = /* css */ `
            fast-switch {
                display: flex;
            }
        `;
        renderedStory.append(styles);
        return renderedStory;
    },
];

export const Required: SwitchStoryMeta = (args: SwitchStoryArgs) => {
    const requiredStoryTemplate = html<SwitchStoryArgs>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <fast-button type="submit">Submit</fast-button>
        </form>
    `;

    const storyFragment = new DocumentFragment();
    requiredStoryTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
Required.args = {
    required: true,
};
