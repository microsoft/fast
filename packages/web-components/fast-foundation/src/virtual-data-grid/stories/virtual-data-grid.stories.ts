import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTVirtualDataGrid } from "../virtual-data-grid.js";
import { GenerateHeaderOptions } from "../../data-grid/index.js";

// create a sample data set
function newDataSet(rowCount: number, prefix: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            item1: `value 1-${i}`,
            item2: `value 2-${i}`,
            item3: `value 3-${i}`,
            item4: `value 4-${i}`,
            item5: `value 5-${i}`,
        });
    }
    return newData;
}

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
        itemSize: 30,
        noTabbing: false,
        rowsData: newDataSet(500, 1),
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
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
