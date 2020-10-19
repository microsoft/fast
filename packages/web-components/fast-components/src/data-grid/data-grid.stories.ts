import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import DataGridTemplate from "./fixtures/base.html";
import { html } from "@microsoft/fast-element";
import {
    Button,
    DataGrid,
    DataGridCell,
    DataGridColumn,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
} from "@microsoft/fast-foundation";
import { FASTDataGrid } from "./";

// Prevent tree-shaking
FASTDataGrid;
FASTDesignSystemProvider;

let defaultGridElement: DataGrid | null = null;
let defaultRowData: object = newDataRow("default");

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("data-grid")) {
        defaultGridElement = document.getElementById("defaultGrid") as DataGrid;
        reset();

        const defaultGridRow: DataGridRow | null = document.getElementById(
            "defaultGridRow"
        ) as DataGridRow;
        if (defaultGridRow !== null) {
            defaultGridRow.rowData = defaultRowData;
        }

        const defaultRow: DataGridRow | null = document.getElementById(
            "defaultRow"
        ) as DataGridRow;
        if (defaultRow !== null) {
            defaultRow.columnsData = baseColumns;
            defaultRow.rowData = defaultRow;
        }

        const defaultHeader: DataGridHeader | null = document.getElementById(
            "defaultHeader"
        ) as DataGridHeader;
        if (defaultHeader !== null) {
            defaultHeader.columnsData = baseColumns;
        }

        const rowWithCellTemplate: DataGridRow | null = document.getElementById(
            "cellTemplateRow"
        ) as DataGridRow;
        if (rowWithCellTemplate !== null) {
            rowWithCellTemplate.columnsData = templateColumns;
            rowWithCellTemplate.rowData = defaultRow;
        }

        const headerWithCellTemplate: DataGridHeader | null = document.getElementById(
            "headerTemplateRow"
        ) as DataGridHeader;
        if (headerWithCellTemplate !== null) {
            headerWithCellTemplate.columnsData = templateColumns;
        }

        const defaultCell: DataGridCell | null = document.getElementById(
            "defaultCell"
        ) as DataGridCell;
        if (rowWithCellTemplate !== null) {
            defaultCell.columnData = { columnDataKey: "name", columnWidth: "1fr" };
            defaultCell.rowData = defaultRow;
        }

        const headerCell: DataGridHeaderCell | null = document.getElementById(
            "headerCell"
        ) as DataGridHeaderCell;
        if (rowWithCellTemplate !== null) {
            headerCell.columnData = {
                columnDataKey: "name",
                columnWidth: "1fr",
                title: "Name",
            };
        }

        const resetButton: Button | null = document.getElementById("btnreset") as Button;
        if (resetButton !== null) {
            resetButton.onclick = reset;
        }

        const defaultColsButton: Button | null = document.getElementById(
            "btndefaultcols"
        ) as Button;
        if (defaultColsButton !== null) {
            defaultColsButton.onclick = setDefaultCols;
        }

        const templateColsButton: Button | null = document.getElementById(
            "btntemplatecols"
        ) as Button;
        if (templateColsButton !== null) {
            templateColsButton.onclick = setTemplateCols;
        }
    }
});

const buttonCellTemplate = html<DataGridCell>`
    <template>
        <fast-button @click="${x => toggleWidth()}">
            ${x =>
                x.rowData === null ||
                x.columnData === null ||
                x.columnData.columnDataKey === null
                    ? null
                    : x.rowData[x.columnData.columnDataKey]}
        </fast-button>
    </template>
`;

const buttonHeaderCellTemplate = html<DataGridHeaderCell>`
    <template>
        <fast-button @click="${x => toggleWidth()}">
            ${x =>
                x.columnData === null
                    ? null
                    : x.columnData.title === undefined
                    ? x.columnData.columnDataKey
                    : x.columnData.title}
        </fast-button>
    </template>
`;

function reset(): void {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.columnsData = baseColumns;
    defaultGridElement.rowsData = newDataSet(10);
}

function setDefaultCols(): void {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.columnsData = baseColumns;
}

function setTemplateCols(): void {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.columnsData = templateColumns;
}

function toggleWidth(): void {
    if (
        defaultGridElement === null ||
        defaultGridElement.columnsData === null ||
        defaultGridElement.columnsData.length < 1 ||
        defaultGridElement.columnsData[0].columnWidth === null
    ) {
        return;
    }
    if (defaultGridElement.columnsData[0].columnWidth === "200px") {
        defaultGridElement.columnsData[0].columnWidth = "100px";
    } else {
        defaultGridElement.columnsData[0].columnWidth = "200px";
    }
}

function newDataSet(rowCount: number): object[] {
    const newRows: object[] = [];
    for (let i = 0; i <= rowCount; i++) {
        newRows.push(newDataRow(`${i + 1}`));
    }
    return newRows;
}

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

const baseColumns: DataGridColumn[] = [
    { columnDataKey: "rowId", columnWidth: "200px" },
    { columnDataKey: "item1", columnWidth: "1fr" },
    { columnDataKey: "item2", columnWidth: "1fr" },
    { columnDataKey: "item3", columnWidth: "1fr" },
];

const templateColumns: DataGridColumn[] = [
    {
        title: "RowID",
        columnDataKey: "rowId",
        columnWidth: "200px",
        cellTemplate: buttonCellTemplate,
        cellFocusTargetCallback: getFocusTarget,
        headerCellTemplate: buttonHeaderCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
    { columnDataKey: "item1", columnWidth: "1fr", title: "Column 1" },
    { columnDataKey: "item2", columnWidth: "1fr", title: "Column 2" },
    { columnDataKey: "item3", columnWidth: "1fr", title: "Column 3" },
];

function incrementAge(): void {
    // const newRow = Object.assign({}, editRow);
    // newRow["age"] = newRow["age"] + 1;
    // editRow = newRow;
    // const rowWithCellTemplate: DataGridRow | null = document.getElementById(
    //     "cellTemplateRow"
    // ) as DataGridRow;
    // if (rowWithCellTemplate !== null) {
    //     rowWithCellTemplate.rowData = newRow;
    // }
    // dataRows.shift();
    // dataRows.unshift(newRow);
    // dataRows.push(newRow);
    // dataRows.splice(0,1, newRow);
    // const defaultGrid: DataGrid | null = document.getElementById(
    //     "defaultGrid"
    // ) as DataGrid;
    // if (defaultGrid !== null) {
    //     defaultGrid.rowsData = dataRows;
    // }
    // const newRow: object = { ...dataGridRow1 };
    // newRow["age"] = newRow["age"] + 1;
    // const rowWithCellTemplate: DataGridRow | null = document.getElementById(
    //     "cellTemplateRow"
    // ) as DataGridRow;
    // if (rowWithCellTemplate !== null) {
    //     rowWithCellTemplate.rowData = newRow;
    // }
    // dataGridRow1 = newRow;
}

// function setColumnWidth(columnIndex: number, width: string): void {
//     templateColumns[columnIndex].columnWidth = width;
// }

function getFocusTarget(cell: DataGridCell | DataGridHeaderCell): HTMLElement {
    return cell.querySelector("fast-button") as HTMLElement;
}

export default {
    title: "Data grid",
};

export const base = () => DataGridTemplate;
