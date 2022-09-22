import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTVirtualDataGrid } from "../virtual-data-grid.js";
import { GenerateHeaderOptions } from "../../data-grid/index.js";

const storyTemplate = html<StoryArgs<FASTVirtualDataGrid>>`
    <fast-virtual-data-grid
        :rowsData="${x => x.rowsData}"
        ?no-tabbing="${x => x.noTabbing}"
        generate-header="${x => x.generateHeader}"
        grid-template-columns="${x => x.gridTemplateColumns}"
        :sizemap="${x => x.sizemap}"
        virtualization-disabled="${x => x.virtualizationDisabled}"
        viewport="${x => x.viewport}"
        item-size="${x => x.itemSize}"
        viewport-buffer="${x => x.viewportBuffer}"
        orientation="${x => x.orientation}"
        auto-update-mode="${x => x.autoUpdateMode}"
        recycle="${x => x.recycle}"
        auto-resize-items="${x => x.autoResizeItems}"
    >
        ${x => x.storyContent}
    </fast-virtual-data-grid>
`;

export default {
    title: "Virtual Data Grid",
    args: {
        itemSize: 100,
        itemLoadMode: "idle",
        noTabbing: false,
        rowsData: [
            {
                item1: `value 1-1`,
                item2: `value 2-1`,
                item3: `value 3-1`,
                item4: `value 4-1`,
                item5: `value 5-1`,
            },
            {
                item1: `value 1-2`,
                item2: `value 2-2`,
                item3: `value 3-2`,
                item4: `value 4-2`,
                item5: `value 5-2`,
            },
            {
                item1: `value 1-3`,
                item2: `value 2-3`,
                item3: `value 3-3`,
                item4: `value 4-3`,
                item5: `value 5-3`,
            },
            {
                item1: `value 1-4`,
                item2: `value 2-4`,
                item3: `value 3-4`,
                item4: `value 4-4`,
                item5: `value 5-4`,
            },
            {
                item1: `value 1-5`,
                item2: `value 2-5`,
                item3: `value 3-5`,
                item4: `value 4-5`,
                item5: `value 5-5`,
            },
        ],
    },
    argTypes: {
        generateHeader: {
            control: "select",
            options: Object.values(GenerateHeaderOptions),
        },
        gridTemplateColumns: { control: "text" },
        noTabbing: { control: "boolean" },
        rowsData: { control: "object" },
        storyContent: { table: { disable: true } },
        virtualizationDisabled: {
            control: { type: "boolean" },
        },
        viewport: {
            control: { type: "text" },
        },
        itemSize: {
            control: { type: "text" },
        },
        viewportBuffer: {
            control: { type: "text" },
        },
        orientation: {
            options: ["horizontal", "vertical"],
            control: { type: "select" },
        },
        autoUpdateMode: {
            options: ["manual", "viewport", "auto"],
            control: { type: "select" },
        },
        recycle: { control: { type: "boolean" } },
        autoResizeItems: { control: { type: "boolean" } },
        itemLoadMode: {
            options: ["idle", "immediate"],
            control: { type: "select" },
        },
        idleCallbackTimeout: {
            control: { type: "text" },
        },
    },
} as Meta<FASTVirtualDataGrid>;

export const VirtualDataGrid: Story<FASTVirtualDataGrid> = renderComponent(
    storyTemplate
).bind({});
