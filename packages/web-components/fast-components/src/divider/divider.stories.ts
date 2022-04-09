import { html } from "@microsoft/fast-element";
import { Divider, DividerRole } from "@microsoft/fast-foundation";
import { Orientation } from "@microsoft/fast-web-utilities";
import { Args, Meta } from "@storybook/html";
import { renderComponent } from "../storybook-helpers.js";

const componentTemplate = html<Divider & Args>`
    <fast-divider
        role="${x => x.role}"
        orientation="${x => x.orientation}"
    ></fast-divider>
`;

export default {
    title: "Divider",
    args: {
        role: "presentation",
    },
    argTypes: {
        orientation: {
            control: "radio",
            options: Object.values(Orientation),
        },
        role: {
            control: "radio",
            options: Object.values(DividerRole),
        },
    },
} as Meta<Divider>;

export const Primary = renderComponent(componentTemplate).bind({});

const verticalDividerTemplate = html<Divider & Args>`
    <fast-toolbar>
        <fast-button>➡️</fast-button>
        <fast-divider orientation="vertical"></fast-divider>
        <fast-button>⬅️</fast-button>
    </fast-toolbar>
`;

export const WithVerticalOrientation = renderComponent(verticalDividerTemplate).bind({});
WithVerticalOrientation.args = {
    orientation: "vertical",
    role: "separator",
};
