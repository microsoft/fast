import { html, repeat, when } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { Args, Meta } from "@storybook/html";
import type { RadioGroup as FoundationRadioGroup } from "../radio-group.js";

type RadioGroupStoryArgs = Args & FoundationRadioGroup;
type RadioGroupStoryMeta = Meta<RadioGroupStoryArgs>;

const storyTemplate = html<RadioGroupStoryArgs>`
    <fast-radio-group name="${x => x.name}" orientation="${x => x.orientation}">
        ${when(
            x => x.label,
            html`
                <label slot="label">
                    ${x => x.label}
                </label>
            `
        )}
        ${repeat(
            x => x.items,
            html`
                <fast-radio value="${x => x.value}">
                    ${x => x.label}
                </fast-radio>
            `
        )}
    </fast-radio>
`;

export default {
    title: "Radio/Radio Group",
    args: {
        label: "Fruits",
        name: "fruits",
        items: [
            { value: "apples", label: "Apples" },
            { value: "bananas", label: "Bananas" },
            { value: "blueberries", label: "Blueberries" },
            { value: "grapefruit", label: "Grapefruit" },
            { value: "kiwi", label: "Kiwi" },
            { value: "mango", label: "Mango" },
            { value: "oranges", label: "Oranges" },
            { value: "pineapple", label: "Pineapple" },
            { value: "strawberries", label: "Strawberries" },
        ],
    },
    argTypes: {
        orientation: {
            options: Object.values(Orientation),
            control: {
                type: "select",
            },
        },
    },
} as RadioGroupStoryMeta;

export const RadioGroup = (args: RadioGroupStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const RadioGroupVertical = RadioGroup.bind({});
RadioGroupVertical.args = {
    orientation: Orientation.vertical,
};
