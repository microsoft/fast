import { css, html, repeat, Updates } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTMenuItem } from "../menu-item.js";
import { MenuItemRole } from "../menu-item.options.js";

export const storyTemplate = html<StoryArgs<FASTMenuItem>>`
    <fast-menu-item
        ?expanded="${x => x.expanded}"
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        id="${x => x.id}"
        role="${x => x.role}"
    >
        ${x => x.storyContent}
    </fast-menu-item>
`;

export default {
    title: "Menu Item",
    excludeStories: ["storyTemplate"],
    args: {
        checked: false,
        disabled: false,
        expanded: false,
    },
    argTypes: {
        checked: { control: "boolean", if: { arg: "role", neq: MenuItemRole.menuitem } },
        disabled: { control: "boolean" },
        expanded: { control: "boolean" },
        role: { control: "select", options: Object.values(MenuItemRole) },
    },
} as Meta<FASTMenuItem>;

export const MenuItem: Story<FASTMenuItem> = renderComponent(storyTemplate).bind({});
MenuItem.args = {
    storyContent: "Menu Item",
};

export const MenuItemWithSlottedStart: Story<FASTMenuItem> = MenuItem.bind({});
MenuItemWithSlottedStart.args = {
    storyContent: html`
        Menu item with slotted start icon
        <svg width="20" height="20" slot="start"><use href="#test-icon" /></svg>
    `,
};

export const MenuItemWithSlottedEnd: Story<FASTMenuItem> = MenuItem.bind({});
MenuItemWithSlottedEnd.args = {
    storyContent: html`
        Menu item with slotted end icon
        <svg width="20" height="20" slot="end"><use href="#test-icon-2" /></svg>
    `,
};

export const MenuItemCheckbox: Story<FASTMenuItem> = renderComponent(
    html<StoryArgs<FASTMenuItem>>`
        <div>${repeat(x => x.items, storyTemplate)}</div>
    `
).bind({});
MenuItemCheckbox.args = {
    items: [
        {
            role: MenuItemRole.menuitemcheckbox,
            storyContent: "Menu item checkbox (unchecked)",
        },
        {
            checked: true,
            role: MenuItemRole.menuitemcheckbox,
            storyContent: "Menu item checkbox (checked)",
        },
        {
            checked: false,
            disabled: true,
            role: MenuItemRole.menuitemcheckbox,
            storyContent: "Menu item checkbox (unchecked, disabled)",
        },
        {
            checked: true,
            disabled: true,
            role: MenuItemRole.menuitemcheckbox,
            storyContent: "Menu item checkbox (checked, disabled)",
        },
    ],
};

export const MenuItemRadio: Story<FASTMenuItem> = renderComponent(
    html<StoryArgs<FASTMenuItem>>`
        ${repeat(x => x.items, storyTemplate)}
    `
).bind({});
MenuItemRadio.args = {
    items: [
        {
            role: MenuItemRole.menuitemradio,
            storyContent: "Menu item radio (unchecked)",
        },
        {
            checked: true,
            role: MenuItemRole.menuitemradio,
            storyContent: "Menu item radio (checked)",
        },
        {
            checked: false,
            disabled: true,
            role: MenuItemRole.menuitemradio,
            storyContent: "Menu item radio (unchecked, disabled)",
        },
        {
            checked: true,
            disabled: true,
            role: MenuItemRole.menuitemradio,
            storyContent: "Menu item radio (checked, disabled)",
        },
    ],
};

export const MenuItemExpanded: Story<FASTMenuItem> = MenuItem.bind({});
MenuItemExpanded.args = {
    storyContent: html`
        Expanded
        <div slot="submenu" role="menu">submenu slot</div>
    `,
    expanded: true,
};
MenuItemExpanded.decorators = [
    Story => {
        const renderedStory = Story() as FASTMenuItem;

        Updates.enqueue(() => {
            // Disable cursor interaction to prevent the state from changing
            renderedStory.$fastController.addStyles(css`
                :host {
                    width: 50%;
                    pointer-events: none;
                }

                ::slotted(div) {
                    padding: 10px;
                }
            `);
        });

        return renderedStory;
    },
];
