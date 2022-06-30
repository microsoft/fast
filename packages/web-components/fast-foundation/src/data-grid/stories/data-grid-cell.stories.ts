import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTDataGridCell } from "../data-grid-cell.js";

type DataGridCellArgs = Args & FASTDataGridCell;
type DataGridCellMeta = Meta<DataGridCellArgs>;

export const storyTemplate = html<DataGridCellArgs>`
    <fast-data-grid-cell
        grid-column="1"
        cell-type="${x => x.cellType}"
        :columnDefinition="${x => x.columnDefinition}"
        :rowData="${x => x.rowData}"
    ></fast-data-grid-cell>
`;

export default {
    title: "Data Grid/Data Grid Cell",
    includeStories: ["DataGridCell"],
    args: {
        rowData: { name: "row 1", value1: "Value 1" },
        columnDefinition: { columnDataKey: "value1" },
        gridColumn: "1",
    },
    argTypes: {
        cellType: {
            options: ["default", "columnheader", "rowheader"],
            control: { type: "select" },
        },
    },
} as DataGridCellMeta;

export const DataGridCell = (args: DataGridCellArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
