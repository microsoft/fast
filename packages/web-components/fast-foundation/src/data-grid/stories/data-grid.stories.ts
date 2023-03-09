import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTDataGrid } from "../data-grid.js";

const storyTemplate = html<StoryArgs<FASTDataGrid>>`
    <fast-data-grid
        style="${x => x.style}"
        :columnDefinitions="${x => (x.columnDefinitions ? x.columnDefinitions : null)}"
        :rowsData="${x => x.rowsData}"
        no-tabbing="${x => x.noTabbing}"
        generate-header="${x => x.generateHeader}"
        grid-template-columns="${x => x.gridTemplateColumns}"
        page-size="${x => x.pageSize}"
    >
        ${x => x.content}
    </fast-data-grid>
`;

function newDataRow(id: string): object {
    return {
        rowId: `rowid-${id}`,
        item1: `value 1-${id}`,
        item2: `value 2-${id}`,
        item3: `value 3-${id}`,
        item4: `value 4-${id}`,
        item5: `value 5-${id}`,
        item6: `value 6-${id}`,
    };
}

function newDataSet(rowCount: number): any[] {
    return Array.from({ length: rowCount }, (v, i) => newDataRow(`${i + 1}`));
}

export default {
    title: "Data Grid",
    args: {
        rowsData: newDataSet(20),
    },
    argTypes: {
        style: {
            control: { type: "text" },
        },
        content: { table: { disable: true } },
        noTabbing: {
            control: { type: "boolean" },
        },
        generateHeader: {
            options: ["none", "default", "sticky"],
            control: { type: "select" },
        },
        pageSize: {
            control: { type: "number" },
        },
        gridTemplateColumns: {
            control: { type: "text" },
        },
        columnDefinitions: {
            control: { type: "object" },
        },
    },
} as Meta<FASTDataGrid>;

export const DataGrid: Story<FASTDataGrid> = renderComponent(storyTemplate).bind({});

export const DataGridFixedHeight: Story<FASTDataGrid> = renderComponent(
    storyTemplate
).bind({});
DataGridFixedHeight.args = {
    style: "height: 200px; overflow-y: scroll;",
};

export const DataGridColumnDefinitions: Story<FASTDataGrid> = renderComponent(
    storyTemplate
).bind({});
DataGridColumnDefinitions.args = {
    style: "height: 200px; overflow-y: scroll;",
    columnDefinitions: [
        { columnDataKey: "rowId" },
        { columnDataKey: "item1" },
        { columnDataKey: "item2" },
    ],
};
