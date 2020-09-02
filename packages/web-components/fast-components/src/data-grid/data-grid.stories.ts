import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import DataGridTemplate from "./fixtures/base.html";
import { html } from "@microsoft/fast-element";
import { DataGridCell, DataGridColumn, DataGridRow } from "@microsoft/fast-foundation";
import { FASTDataGrid } from "./";

// Prevent tree-shaking
FASTDataGrid;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("data-grid")) {
      const rowWithCellTemplate: DataGridRow | null = document.getElementById("cellTemplateRow") as DataGridRow;
      if (rowWithCellTemplate !== null){
          rowWithCellTemplate.columnsData = templateColumns;
      }
    }
});

export default {
    title: "Data grid",
};

const dataGridButtonCellTemplate = html<DataGridCell>`
    <template>
        <button>${x => (x.rowData === null || x.columnData === null || x.columnData.columnDataKey === null) ? null : x.rowData[x.columnData.columnDataKey]}</button>
    </template>
`;

const templateColumns: DataGridColumn[] = [
    {columnDataKey: "name", columnWidth:"1fr"},
    {columnDataKey: "age", columnWidth:"1fr", cellTemplate: dataGridButtonCellTemplate}
];


export const DataGrid = () => DataGridTemplate;
