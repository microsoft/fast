import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTFlipper } from "../flipper.js";
import { FlipperDirection } from "../flipper.options.js";

const storyTemplate = html<StoryArgs<FASTFlipper>>`
    <fast-flipper
        ?disabled="${x => x.disabled}"
        :hiddenFromAT="${x => x.hiddenFromAT}"
        direction="${x => x.direction}"
    ></fast-flipper>
`;

export default {
    title: "Flipper",
    args: {
        disabled: false,
        hiddenFromAT: true,
    },
    argTypes: {
        direction: { control: "radio", options: Object.values(FlipperDirection) },
        disabled: { control: "boolean" },
        hiddenFromAT: { control: "boolean" },
    },
} as Meta<FASTFlipper>;

export const Flipper: Story<FASTFlipper> = renderComponent(storyTemplate).bind({});
