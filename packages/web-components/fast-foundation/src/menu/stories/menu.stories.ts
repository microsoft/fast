import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Menu as FoundationMenu } from "../menu.js";

type MenuStoryArgs = Args & FoundationMenu;
type MenuStoryMeta = Meta<MenuStoryArgs>;

const storyTemplate = html<MenuStoryArgs>`
    <fast-menu>${x => x.content}</fast-menu>
`;

export default {
    title: "Menu",
    args: {
        content: html`
            <fast-menu-item>Menu item 1</fast-menu-item>
            <fast-menu-item>Menu item 2</fast-menu-item>
            <fast-menu-item>Menu item 3</fast-menu-item>
        `,
    },
    argTypes: {
        content: { table: { disable: true } },
    },
} as MenuStoryMeta;

export const Menu = (args: MenuStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const MenuWithDivider = Menu.bind({});
MenuWithDivider.args = {
    content: html`
        <fast-menu-item>Menu item 1</fast-menu-item>
        <fast-menu-item>Menu item 2</fast-menu-item>
        <fast-divider></fast-divider>
        <fast-menu-item>Menu item 3</fast-menu-item>
        <fast-menu-item>Menu item 4</fast-menu-item>
    `,
};

export const MenuWithFormControls = Menu.bind({});
MenuWithFormControls.args = {
    content: html`
        <fast-menu-item>Menu item 1</fast-menu-item>
        <fast-menu-item>Menu item 2</fast-menu-item>
        <fast-divider></fast-divider>
        <fast-menu-item role="menuitemcheckbox">Checkbox 1</fast-menu-item>
        <fast-menu-item role="menuitemcheckbox">Checkbox 2</fast-menu-item>
        <fast-divider></fast-divider>
        <fast-menu-item role="menuitemradio">Radio 1.1</fast-menu-item>
        <fast-menu-item role="menuitemradio">Radio 1.2</fast-menu-item>
        <fast-divider></fast-divider>
        <fast-menu-item role="menuitemradio">Radio 2.1</fast-menu-item>
        <fast-menu-item role="menuitemradio">Radio 2.2</fast-menu-item>
    `,
};

export const MenuWithNestedItems = Menu.bind({});
MenuWithNestedItems.args = {
    content: html`
        <fast-menu-item>
            Menu item 1
            <fast-menu slot="submenu">
                <fast-menu-item>Menu item 1.1</fast-menu-item>
                <fast-menu-item>Menu item 1.2</fast-menu-item>
                <fast-menu-item>Menu item 1.3</fast-menu-item>
            </fast-menu>
        </fast-menu-item>
        <fast-menu-item>
            Menu item 2
            <fast-menu slot="submenu">
                <fast-menu-item>Menu item 2.1</fast-menu-item>
                <fast-menu-item>Menu item 2.2</fast-menu-item>
                <fast-menu-item>Menu item 2.3</fast-menu-item>
            </fast-menu>
        </fast-menu-item>
        <fast-menu-item>
            Menu item 3
            <fast-menu slot="submenu">
                <fast-menu-item>Menu item 3.1</fast-menu-item>
                <fast-menu-item>Menu item 3.2</fast-menu-item>
                <fast-menu-item>Menu item 3.3</fast-menu-item>
            </fast-menu>
        </fast-menu-item>
    `,
};

export const WithIcons = Menu.bind({});
WithIcons.args = {
    content: html`
        <fast-menu-item>
            <svg slot="start"><use href="#test-icon"></svg>
            <svg slot="end"><use href="#test-icon"></svg>
            Menu item 1
        </fast-menu-item>
        <fast-menu-item>
            <svg slot="start"><use href="#test-icon"></svg>
            <svg slot="end"><use href="#test-icon"></svg>
            Menu item 2
        </fast-menu-item>
        <fast-menu-item>
            <svg slot="start"><use href="#test-icon"></svg>
            <svg slot="end"><use href="#test-icon"></svg>
            Menu item 3
        </fast-menu-item>
    `,
};
