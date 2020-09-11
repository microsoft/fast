import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import DataGridTemplate from "./fixtures/base.html";
import { html } from "@microsoft/fast-element";
import { DataGrid, DataGridCell, DataGridColumn, DataGridRow } from "@microsoft/fast-foundation";
import { FASTDataGrid } from "./";

// Prevent tree-shaking
FASTDataGrid;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("data-grid")) {
        const defaultGrid: DataGrid | null = document.getElementById("defaultGrid") as DataGrid;
        if (defaultGrid !== null){
            defaultGrid.columnsData = baseColumns;
            defaultGrid.rowsData = dataRows;
        }
    }

    const defaultGridRow: DataGridRow | null = document.getElementById("defaultGridRow") as DataGridRow;
    if (defaultGridRow !== null){
        defaultGridRow.columnsData = baseColumns;
        defaultGridRow.rowData = dataGridRow3;
    }

    const defaultRow: DataGridRow | null = document.getElementById("defaultRow") as DataGridRow;
    if (defaultRow !== null){
        defaultRow.columnsData = baseColumns;
        defaultRow.rowData = dataGridRow1;
    }

      const rowWithCellTemplate: DataGridRow | null = document.getElementById("cellTemplateRow") as DataGridRow;
      if (rowWithCellTemplate !== null){
          rowWithCellTemplate.columnsData = templateColumns;
          rowWithCellTemplate.rowData = dataGridRow1;
      }

      const defaultCell: DataGridCell | null = document.getElementById("defaultCell") as DataGridCell;
      if (rowWithCellTemplate !== null){
          defaultCell.columnData = {columnDataKey: "name", columnWidth:"1fr"};
          defaultCell.rowData = dataGridRow1;
      }

});

export default {
    title: "Data grid",
};

const dataGridButtonCellTemplate = html<DataGridCell>`
    <template>
        <button
            @click="${(x, c) => x.rowData?["age"] = x.rowData["age"] + 1}"
        >
            ${x => (x.rowData === null || x.columnData === null || x.columnData.columnDataKey === null) ? null : x.rowData[x.columnData.columnDataKey]}
        </button>
    </template>
`;

const baseColumns: DataGridColumn[] = [
    {columnDataKey: "name", columnWidth:"1fr"},
    {columnDataKey: "age", columnWidth:"1fr"}
];

const templateColumns: DataGridColumn[] = [
    {columnDataKey: "name", columnWidth:"1fr"},
    {columnDataKey: "age", columnWidth:"1fr", cellTemplate: dataGridButtonCellTemplate}
];

const dataGridRow1: object = {name: "bob", age: 21};
const dataGridRow2: object = {name: "rob", age: 22};
const dataGridRow3: object = {name: "bobby", age: 23};

const dataRows: object[] = [dataGridRow1, dataGridRow2];

export const base = () => DataGridTemplate;
