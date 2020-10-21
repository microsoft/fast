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
    DataGridRow,
} from "@microsoft/fast-foundation";
import { FASTDataGrid } from "./";

// Prevent tree-shaking
FASTDataGrid;
FASTDesignSystemProvider;

let defaultGridElement: DataGrid | null = null;
let defaultRowData: object = newDataRow("default");

let columnWidths: string[] = ["1fr", "1fr", "1fr", "1fr"];

let gridTemplateColumnsDefault = "1fr 1fr 1fr 1fr";

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
            defaultRow.rowData = defaultRowData;
        }

        const defaultHeader: DataGridRow | null = document.getElementById(
            "defaultHeader"
        ) as DataGridRow;
        if (defaultHeader !== null) {
            defaultHeader.columnsData = baseColumns;
        }

        const rowWithCellTemplate: DataGridRow | null = document.getElementById(
            "cellTemplateRow"
        ) as DataGridRow;
        if (rowWithCellTemplate !== null) {
            rowWithCellTemplate.columnsData = templateColumns;
            rowWithCellTemplate.rowData = defaultRowData;
        }

        const headerWithCellTemplate: DataGridRow | null = document.getElementById(
            "headerTemplateRow"
        ) as DataGridRow;
        if (headerWithCellTemplate !== null) {
            headerWithCellTemplate.columnsData = templateColumns;
        }

        const defaultCell: DataGridCell | null = document.getElementById(
            "defaultCell"
        ) as DataGridCell;
        if (rowWithCellTemplate !== null) {
            defaultCell.columnData = { columnDataKey: "rowId" };
            defaultCell.rowData = defaultRowData;
        }

        const headerCell: DataGridCell | null = document.getElementById(
            "headerCell"
        ) as DataGridCell;
        if (rowWithCellTemplate !== null) {
            headerCell.columnData = {
                columnDataKey: "name",
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

        const addRowButton: Button | null = document.getElementById(
            "btnaddrow"
        ) as Button;
        if (addRowButton !== null) {
            addRowButton.onclick = addRow;
        }

        const removeRowButton: Button | null = document.getElementById(
            "btnremoverow"
        ) as Button;
        if (removeRowButton !== null) {
            removeRowButton.onclick = removeRow;
        }
    }
});

const buttonCellTemplate = html<DataGridCell>`
    <template>
        <fast-button @click="${x => cellTemplateButtonClick(x)}">
            ${x =>
                x.rowData === null ||
                x.columnData === null ||
                x.columnData.columnDataKey === null
                    ? null
                    : x.rowData[x.columnData.columnDataKey]}
        </fast-button>
    </template>
`;

const buttonHeaderCellTemplate = html<DataGridCell>`
    <template>
        <fast-button @click="${x => headerTemplateButtonClick(x)}">
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
    columnWidths = ["1fr", "1fr", "1fr", "1fr"];
    defaultGridElement.gridTemplateColumns = `${columnWidths[0]} ${columnWidths[1]} ${columnWidths[2]} ${columnWidths[3]}`;
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

function addRow(): void {
    if (defaultGridElement === null || defaultGridElement.rowsData === null) {
        return;
    }
    defaultGridElement.rowsData.push(
        newDataRow(`${defaultGridElement.rowsData.length + 1}`)
    );
}

function removeRow(): void {
    if (
        defaultGridElement === null ||
        defaultGridElement.rowsData === null ||
        defaultGridElement.rowsData.length === 0
    ) {
        return;
    }
    defaultGridElement.rowsData.pop();
}

function headerTemplateButtonClick(cell: DataGridCell): void {
    if (
        cell.columnData === null ||
        defaultGridElement === null ||
        defaultGridElement.columnsData === null
    ) {
        return;
    }

    const index: number = defaultGridElement.columnsData.indexOf(cell.columnData);

    if (columnWidths[index] === "1fr") {
        columnWidths.splice(index, 1, "2fr");
    } else {
        columnWidths.splice(index, 1, "1fr");
    }

    defaultGridElement.gridTemplateColumns = `${columnWidths[0]} ${columnWidths[1]} ${columnWidths[2]} ${columnWidths[3]}`;
}

function cellTemplateButtonClick(cell: DataGridCell): void {
    if (
        cell.columnData === null ||
        cell.rowData === null ||
        defaultGridElement === null
    ) {
        return;
    }
    const newRowData: object = { ...cell.rowData };
    newRowData[cell.columnData.columnDataKey] = "clicked";

    const rowIndex: number = defaultGridElement.rowsData.indexOf(cell.rowData);

    if (rowIndex > -1) {
        defaultGridElement.rowsData.splice(rowIndex, 1, newRowData);
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
    { columnDataKey: "rowId" },
    { columnDataKey: "item1" },
    { columnDataKey: "item2" },
    { columnDataKey: "item3" },
];

const templateColumns: DataGridColumn[] = [
    {
        title: "RowID",
        columnDataKey: "rowId",
        cellTemplate: buttonCellTemplate,
        cellFocusTargetCallback: getFocusTarget,
        headerCellTemplate: buttonHeaderCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
    {
        title: "Column 1",
        columnDataKey: "item1",
        cellTemplate: buttonCellTemplate,
        cellFocusTargetCallback: getFocusTarget,
        headerCellTemplate: buttonHeaderCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
    {
        title: "Column 2",
        columnDataKey: "item2",
        cellTemplate: buttonCellTemplate,
        cellFocusTargetCallback: getFocusTarget,
        headerCellTemplate: buttonHeaderCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
    {
        title: "Column 3",
        columnDataKey: "item3",
        cellTemplate: buttonCellTemplate,
        cellFocusTargetCallback: getFocusTarget,
        headerCellTemplate: buttonHeaderCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
];

function getFocusTarget(cell: DataGridCell): HTMLElement {
    return cell.querySelector("fast-button") as HTMLElement;
}

export default {
    title: "Data grid",
};

export const base = () => DataGridTemplate;
