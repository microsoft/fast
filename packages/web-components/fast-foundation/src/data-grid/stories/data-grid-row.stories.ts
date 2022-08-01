import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTDataGridRow } from "../data-grid-row.js";

type DataGridRowArgs = Args & FASTDataGridRow;
type DataGridRowMeta = Meta<DataGridRowArgs>;

const storyTemplate = html<DataGridRowArgs>`
    <fast-data-grid-row
        grid-template-columns="${x => x.gridTemplateColumns}"
        :rowData="${x => x.rowData}"
        row-type="${x => x.rowType}"
        :columnDefinitions="${x => x.columnDefinitions}"
    ></fast-data-grid-row>
`;

export default {
    title: "Data Grid/Data Grid Row",
    includeStories: ["DataGridRow"],
    args: {
        rowData: { name: "row 1", value1: "Value 1" },
        gridTemplateColumns: "1fr 1fr",
        columnDefinitions: [{ columnDataKey: "name" }, { columnDataKey: "value1" }],
    },
    argTypes: {
        rowType: {
            options: ["default", "header", "sticky-header"],
            control: { type: "select" },
        },
    },
} as DataGridRowMeta;

export const DataGridRow = (args: DataGridRowArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
