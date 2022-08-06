import { html, repeat } from "@microsoft/fast-element";
import { storyTemplate as dividerStoryTemplate } from "../../divider/stories/divider.stories.js";
import type { FASTMenuItem } from "../../menu-item/menu-item.js";
import { storyTemplate as menuItemStoryTemplate } from "../../menu-item/stories/menu-item.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTMenu } from "../menu.js";

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

export const MenuWithFormControls: Story<FASTMenu> = Menu.bind({});
MenuWithFormControls.args = {
    storyItems: [
        { storyContent: "Menu Item 1" },
        { storyContent: "Menu Item 2" },
        { template: dividerStoryTemplate },
        { storyContent: "Checkbox 1", role: "menuitemcheckbox" },
        { storyContent: "Checkbox 2", role: "menuitemcheckbox" },
        { template: dividerStoryTemplate },
        { storyContent: "Radio 1.1", role: "menuitemradio" },
        { storyContent: "Radio 1.2", role: "menuitemradio" },
        { template: dividerStoryTemplate },
        { storyContent: "Radio 2.1", role: "menuitemradio" },
        { storyContent: "Radio 2.2", role: "menuitemradio" },
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
                                        { storyContent: "Menu Item 2.1.4" },
                                        { storyContent: "Menu Item 2.1.5" },
                                        { storyContent: "Menu Item 2.1.6" },
                                    ],
                                },
                            ],
                        },
                        { storyContent: "Menu Item 2.2" },
                        { storyContent: "Menu Item 2.3" },
                        { storyContent: "Menu Item 2.4" },
                        { storyContent: "Menu Item 2.5" },
                        { storyContent: "Menu Item 2.6" },
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

export const MenuWithItemsWithIcons: Story<FASTMenu> = Menu.bind({});
MenuWithItemsWithIcons.args = {
    storyItems: [
        {
            storyContent: html`
                <svg slot="start"><use href="#test-icon" /></svg>
                Slotted start icon
            `,
        },
        {
            storyContent: html`
                <svg slot="end"><use href="#test-icon" /></svg>
                Slotted end icon
            `,
        },
        {
            storyContent: html`
                <svg slot="start"><use href="#test-icon" /></svg>
                <svg slot="end"><use href="#test-icon" /></svg>
                Slotted start and end icons
            `,
        },
    ],
};
