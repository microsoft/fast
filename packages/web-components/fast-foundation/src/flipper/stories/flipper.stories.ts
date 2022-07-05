import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTFlipper } from "../flipper.js";
import { FlipperDirection } from "../flipper.options.js";

type FlipperStoryArgs = Args & FASTFlipper;
type FlipperStoryMeta = Meta<FlipperStoryArgs>;

const componentTemplate = html<FlipperStoryArgs>`
    <fast-flipper
        direction="${x => x.direction}"
        ?disabled="${x => x.disabled}"
    ></fast-flipper>
`;

export default {
    title: "Flipper",
    argTypes: {
        direction: {
            options: Object.values(FlipperDirection),
            control: { type: "select" },
        },
        disabled: {
            control: { type: "boolean" },
        },
    },
} as FlipperStoryMeta;

export const Flipper = (args: FlipperStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const FlipperPrevious = Flipper.bind({});
FlipperPrevious.storyName = "Previous Flipper";
FlipperPrevious.args = {
    direction: FlipperDirection.previous,
};

export const FlipperDisabled = (args: FlipperStoryArgs) => {
    const storyFragment = new DocumentFragment();

    html<FlipperStoryArgs>`
        ${repeat(x => x.items, componentTemplate)}
    `.render(args, storyFragment);

    return storyFragment;
};
FlipperDisabled.storyName = "Disabled Flippers";
FlipperDisabled.args = {
    items: [
        { direction: FlipperDirection.previous, disabled: true },
        { direction: FlipperDirection.next, disabled: true },
    ],
    direction: FlipperDirection.previous,
};
FlipperDisabled.argTypes = {
    items: { table: { disable: true } },
};
