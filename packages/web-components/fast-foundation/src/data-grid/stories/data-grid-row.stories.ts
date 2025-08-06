import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTDataGridRow } from "../data-grid-row.js";
import { DataGridRowTypes } from "../data-grid.options.js";

const storyTemplate = html<StoryArgs<FASTDataGridRow>>`
    <fast-data-grid-row
        :columnDefinitions="${x => x.columnDefinitions}"
        :rowData="${x => x.rowData}"
        grid-template-columns="${x => x.gridTemplateColumns}"
        row-type="${x => x.rowType}"
    >
        ${x => x.storyContent}
    </fast-data-grid-row>
`;

export default {
    title: "Data Grid/Data Grid Row",
    args: {
        columnDefinitions: [{ columnDataKey: "name" }, { columnDataKey: "value1" }],
        rowData: { name: "row 1", value1: "Value 1" },
    },
    argTypes: {
        columnDefinitions: { control: "object" },
        gridTemplateColumns: { control: "text" },
        rowType: { control: "select", options: Object.values(DataGridRowTypes) },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTDataGridRow>;

export const DataGridRow: Story<FASTDataGridRow> = renderComponent(storyTemplate).bind(
    {}
);
