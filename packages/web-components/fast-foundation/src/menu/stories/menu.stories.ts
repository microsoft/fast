import { html, repeat } from "@microsoft/fast-element";
import { storyTemplate as dividerStoryTemplate } from "../../divider/stories/divider.stories.js";
import type { FASTMenuItem } from "../../menu-item/menu-item.js";
import { storyTemplate as menuItemStoryTemplate } from "../../menu-item/stories/menu-item.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTMenu } from "../menu.js";
import type {
    FancyMenu as MyFancyMenu,
    FancyMenuItem as MyFancyMenuItem,
} from "./menu.register.js";

const storyTemplate = html<StoryArgs<FASTMenu>>`
    <fast-menu slot="${x => x.slot}">${x => x.storyContent}</fast-menu>
`;

const storyContentTemplate = html`
    ${repeat(
        x => x.storyItems,
        html<StoryArgs<FASTMenuItem>>`
            ${x => x.template ?? menuItemStoryTemplate}
        `
    )}
`;

const fancyStoryTemplate = html<StoryArgs<FASTMenu>>`
    <fancy-menu slot="${x => x.slot}">${x => x.storyContent}</fancy-menu>
`;

const fancyMenuItemStoryTemplate = html<StoryArgs<FASTMenuItem>>`
    <fancy-menu-item
        ?expanded="${x => x.expanded}"
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        id="${x => x.id}"
        role="${x => x.role}"
    >
        ${x => x.storyContent}
    </fancy-menu-item>
`;

const fancyStoryContentTemplate = html`
    ${repeat(
        x => x.storyItems,
        html<StoryArgs<MyFancyMenuItem>>`
            ${x => x.template ?? fancyMenuItemStoryTemplate}
        `
    )}
`;

export default {
    title: "Menu",
    args: {
        storyContent: storyContentTemplate,
        storyItems: [
            { storyContent: "Menu Item 1" },
            { storyContent: "Menu Item 2" },
            { storyContent: "Menu Item 3" },
        ],
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTMenu>;

export const Menu: Story<FASTMenu> = renderComponent(storyTemplate).bind({});
Menu.args = {
    storyContent: html`
        ${repeat(
            x => x.storyItems,
            html<StoryArgs<FASTMenuItem>>`
                ${x => x.template ?? menuItemStoryTemplate}
            `
        )}
    `,
};

export const MenuWithDivider: Story<FASTMenu> = Menu.bind({});
MenuWithDivider.args = {
    storyItems: [
        { storyContent: "Menu Item 1" },
        { storyContent: "Menu Item 2" },
        { template: dividerStoryTemplate },
        { storyContent: "Menu Item 3" },
        { storyContent: "Menu Item 4" },
    ],
};

export const MenuWithCheckboxItems: Story<FASTMenu> = Menu.bind({});
MenuWithCheckboxItems.args = {
    storyItems: [
        { storyContent: "Menu Item 1", role: "menuitemcheckbox" },
        { storyContent: "Menu Item 2", role: "menuitemcheckbox" },
        { storyContent: "Menu Item 3", role: "menuitemcheckbox" },
    ],
};

export const MenuWithRadioItems: Story<FASTMenu> = Menu.bind({});
MenuWithRadioItems.args = {
    storyItems: [
        { storyContent: "Menu Item 1", role: "menuitemradio" },
        { storyContent: "Menu Item 2", role: "menuitemradio" },
        { storyContent: "Menu Item 3", role: "menuitemradio" },
    ],
};

export const MenuWithNestedItems: Story<FASTMenu> = Menu.bind({});
MenuWithNestedItems.args = {
    storyItems: [
        {
            storyContent: html`
                Menu Item 1 ${repeat(x => x.storyItems, storyTemplate)}
            `,
            storyItems: [
                {
                    slot: "submenu",
                    storyContent: storyContentTemplate,
                    storyItems: [
                        { storyContent: "Menu Item 1.1" },
                        { storyContent: "Menu Item 1.2" },
                        { storyContent: "Menu Item 1.3" },
                    ],
                },
            ],
        },
        {
            storyContent: html`
                Menu Item 2 ${repeat(x => x.storyItems, storyTemplate)}
            `,
            storyItems: [
                {
                    slot: "submenu",
                    storyContent: storyContentTemplate,
                    storyItems: [
                        {
                            storyContent: html`
                                Menu Item 2.1 ${repeat(x => x.storyItems, storyTemplate)}
                            `,
                            storyItems: [
                                {
                                    slot: "submenu",
                                    storyContent: storyContentTemplate,
                                    storyItems: [
                                        { storyContent: "Menu Item 2.1.1" },
                                        { storyContent: "Menu Item 2.1.2" },
                                        { storyContent: "Menu Item 2.1.3" },
                                    ],
                                },
                            ],
                        },
                        { storyContent: "Menu Item 2.2" },
                        { storyContent: "Menu Item 2.3" },
                    ],
                },
            ],
        },
        {
            storyContent: html`
                Menu Item 3 ${repeat(x => x.storyItems, storyTemplate)}
            `,
            storyItems: [
                {
                    slot: "submenu",
                    storyContent: storyContentTemplate,
                    storyItems: [
                        { storyContent: "Menu Item 3.1" },
                        { storyContent: "Menu Item 3.2" },
                        { storyContent: "Menu Item 3.3" },
                    ],
                },
            ],
        },
    ],
};

export const FancyMenu: Story<MyFancyMenu> = renderComponent(fancyStoryTemplate).bind({});
FancyMenu.args = {
    storyContent: html`
        ${repeat(
            x => x.storyItems,
            html<StoryArgs<FASTMenuItem>>`
                ${x => x.template ?? fancyMenuItemStoryTemplate}
            `
        )}
    `,
    storyItems: [
        { storyContent: "Fancy Menu Item 1" },
        { storyContent: "Fancy Menu Item 2" },
        { storyContent: "Fancy Menu Item 3" },
    ],
};

export const FancyMenuWithItemsWithIcons: Story<MyFancyMenu> = FancyMenu.bind({});
FancyMenuWithItemsWithIcons.args = {
    storyContent: html`
        ${repeat(
            x => x.storyItems,
            html<StoryArgs<FASTMenuItem>>`
                ${x => x.template ?? fancyMenuItemStoryTemplate}
            `
        )}
    `,
    storyItems: [
        {
            storyContent: html`
                <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
                Slotted start icon
            `,
        },
        {
            storyContent: html`
                Slotted end icon
                <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
            `,
        },
        {
            storyContent: html`
                <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
                Slotted start & end icons
                <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
            `,
        },
    ],
};

export const FancyMenuWithFormControls: Story<MyFancyMenu> = FancyMenu.bind({});
FancyMenuWithFormControls.args = {
    storyContent: html`
        ${repeat(
            x => x.storyItems,
            html<StoryArgs<FASTMenuItem>>`
                ${x => x.template ?? fancyMenuItemStoryTemplate}
            `
        )}
    `,
    storyItems: [
        { storyContent: "Fancy Menu Item 1" },
        { storyContent: "Fancy Menu Item 2" },
        { template: dividerStoryTemplate },
        { storyContent: "Fancy Checkbox 1", role: "menuitemcheckbox" },
        { storyContent: "Fancy Checkbox 2", role: "menuitemcheckbox" },
        { template: dividerStoryTemplate },
        { storyContent: "Fancy Radio 1.1", role: "menuitemradio" },
        { storyContent: "Fancy Radio 1.2", role: "menuitemradio" },
        { template: dividerStoryTemplate },
        { storyContent: "Fancy Radio 2.1", role: "menuitemradio" },
        { storyContent: "Fancy Radio 2.2", role: "menuitemradio" },
    ],
};
