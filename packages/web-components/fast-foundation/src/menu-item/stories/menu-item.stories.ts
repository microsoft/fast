import { css, html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTMenuItem } from "../menu-item.js";
import { MenuItemRole } from "../menu-item.options.js";

type MenuItemStoryArgs = Args & FASTMenuItem;
type MenuItemStoryMeta = Meta<MenuItemStoryArgs>;

const componentTemplate = html<MenuItemStoryArgs>`
    <fast-menu-item
        ?expanded="${x => x.expanded}"
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        role="${x => x.role}"
    >
        ${x => x.content}
    </fast-menu-item>
`;

export default {
    title: "Menu/Menu Item",
    args: {
        content: "Menu Item",
    },
    argTypes: {
        checked: { control: { type: "boolean" } },
        disabled: { control: { type: "boolean" } },
        expanded: { control: { type: "boolean" } },
        role: { options: Object.values(MenuItemRole), control: { type: "select" } },
    },
} as MenuItemStoryMeta;

export const MenuItem = (args: MenuItemStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const WithSlottedStart = MenuItem.bind({});
WithSlottedStart.args = {
    content: html`
        Menu item with slotted start icon
        <svg slot="start"><use href="#test-icon"></svg>
    `,
};

export const WithSlottedEnd = MenuItem.bind({});
WithSlottedEnd.args = {
    content: html`
        Menu item with slotted end icon
        <svg slot="end"><use href="#test-icon"></svg>
    `,
};

export const MenuItemCheckbox = (args: MenuItemStoryArgs) => {
    const menuItemCheckboxTemplate = html<MenuItemStoryArgs>`
        <div>${repeat(x => x.items, componentTemplate)}</div>
    `;
    const storyFragment = new DocumentFragment();
    menuItemCheckboxTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
MenuItemCheckbox.args = {
    items: [
        {
            content: "Menu item checkbox (unchecked)",
            role: MenuItemRole.menuitemcheckbox,
        },
        {
            content: "Menu item checkbox (checked)",
            role: MenuItemRole.menuitemcheckbox,
            checked: true,
        },
        {
            content: "Menu item checkbox (unchecked, disabled)",
            role: MenuItemRole.menuitemcheckbox,
            checked: false,
            disabled: true,
        },
        {
            content: "Menu item checkbox (checked, disabled)",
            role: MenuItemRole.menuitemcheckbox,
            disabled: true,
            checked: true,
        },
    ],
};

export const MenuItemRadio = (args: MenuItemStoryArgs) => {
    const MenuItemRadioTemplate = html<MenuItemStoryArgs>`
        ${repeat(x => x.items, componentTemplate)}
    `;
    const storyFragment = new DocumentFragment();
    MenuItemRadioTemplate.render(args, storyFragment);
    return storyFragment;
};
MenuItemRadio.args = {
    items: [
        {
            content: "Menu item radio (unchecked)",
            role: MenuItemRole.menuitemradio,
        },
        {
            content: "Menu item radio (checked)",
            role: MenuItemRole.menuitemradio,
            checked: true,
        },
        {
            content: "Menu item radio (unchecked, disabled)",
            role: MenuItemRole.menuitemradio,
            checked: false,
            disabled: true,
        },
        {
            content: "Menu item radio (checked, disabled)",
            role: MenuItemRole.menuitemradio,
            disabled: true,
            checked: true,
        },
    ],
};

export const MenuItemExpanded: MenuItemStoryMeta = MenuItem.bind({});
MenuItemExpanded.args = {
    content: html`
        Expanded
        <div slot="submenu" role="menu">submenu slot</div>
    `,
    expanded: true,
};
MenuItemExpanded.decorators = [
    Story => {
        const renderedStory = Story() as FASTMenuItem;
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
        return renderedStory;
    },
];
