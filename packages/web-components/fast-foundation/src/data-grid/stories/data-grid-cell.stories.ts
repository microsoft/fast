import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTDataGridCell } from "../data-grid-cell.js";
import { DataGridCellTypes } from "../data-grid-cell.js";

const storyTemplate = html<StoryArgs<FASTDataGridCell>>`
    <fast-data-grid-cell
        :columnDefinition="${x => x.columnDefinition}"
        :rowData="${x => x.rowData}"
        cell-type="${x => x.cellType}"
        grid-column="${x => x.gridColumn}"
    >
        ${x => x.storyContent}
    </fast-data-grid-cell>
`;

export default {
    title: "Data Grid/Data Grid Cell",
    argTypes: {
        cellType: { control: "select", options: Object.values(DataGridCellTypes) },
        columnDefinition: { control: "object" },
        gridColumn: { control: "text" },
        rowData: { control: "object" },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTDataGridCell>;

export const DataGridCell: Story<FASTDataGridCell> = renderComponent(storyTemplate).bind(
    {}
);
DataGridCell.args = {
    columnDefinition: { columnDataKey: "item1" },
    rowData: {
        item1: "data grid cell value 1",
        item2: "data grid cell value 2",
        item3: "data grid cell value 3",
        item4: "data grid cell value 4",
    },
};
