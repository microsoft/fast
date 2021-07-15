import { html } from "@microsoft/fast-element";
import { GenerateHeaderOptions } from "@microsoft/fast-foundation/dist/esm/data-grid/data-grid.options";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import DataGridTemplate from "./fixtures/base.html";
import "./index";
let defaultGridElement = null;
const defaultRowData = newDataRow("default");
const columnWidths = ["1fr", "1fr", "1fr", "1fr"];
const defaultRowItemTemplate = html`
    <fast-data-grid-row
        :rowData="${x => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
    ></fast-data-grid-row>
`;
const customRowItemTemplate = html`
    <fast-data-grid-row
        :rowData="${x => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
    ></fast-data-grid-row>
    <fast-divider style="margin-bottom: 6px; margin-top: 6px;"></fast-divider>
`;
const customCellItemTemplate = html`
    <fast-data-grid-cell
        style="background: brown"
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></fast-data-grid-cell>
`;
const customHeaderCellItemTemplate = html`
    <fast-data-grid-cell
        style="background: orange"
        cell-type="columnheader"
        grid-column="${(x, c) => c.index + 1}"
        :columnDefinition="${x => x}"
    ></fast-data-grid-header-cell>
`;
addons.getChannel().addListener(STORY_RENDERED, name => {
    if (name.toLowerCase().startsWith("data-grid")) {
        defaultGridElement = document.getElementById("defaultGrid");
        reset();
        const defaultGridRow = document.getElementById("defaultGridRow");
        if (defaultGridRow) {
            defaultGridRow.rowData = defaultRowData;
        }
        const defaultRow = document.getElementById("defaultRow");
        if (defaultRow) {
            defaultRow.columnDefinitions = baseColumns;
            defaultRow.rowData = defaultRowData;
        }
        const defaultHeader = document.getElementById("defaultHeader");
        if (defaultHeader) {
            defaultHeader.columnDefinitions = baseColumns;
        }
        const rowWithCellTemplate = document.getElementById("cellTemplateRow");
        if (rowWithCellTemplate) {
            rowWithCellTemplate.columnDefinitions = templateColumns;
            rowWithCellTemplate.rowData = defaultRowData;
        }
        const headerWithCellTemplate = document.getElementById("headerTemplateRow");
        if (headerWithCellTemplate) {
            headerWithCellTemplate.columnDefinitions = templateColumns;
        }
        const defaultCell = document.getElementById("defaultCell");
        if (defaultCell) {
            defaultCell.columnDefinition = { columnDataKey: "rowId" };
            defaultCell.rowData = defaultRowData;
        }
        const headerCell = document.getElementById("headerCell");
        if (headerCell) {
            headerCell.columnDefinition = {
                columnDataKey: "name",
                title: "Name",
            };
        }
        const resetButton = document.getElementById("btnreset");
        if (resetButton) {
            resetButton.onclick = reset;
        }
        const defaultColsButton = document.getElementById("btndefaultcols");
        if (defaultColsButton) {
            defaultColsButton.onclick = setDefaultCols;
        }
        const templateColsButton = document.getElementById("btntemplatecols");
        if (templateColsButton) {
            templateColsButton.onclick = setTemplateCols;
        }
        const addRowButton = document.getElementById("btnaddrow");
        if (addRowButton) {
            addRowButton.onclick = addRow;
        }
        const removeRowButton = document.getElementById("btnremoverow");
        if (removeRowButton) {
            removeRowButton.onclick = removeRow;
        }
        const noHeaderButton = document.getElementById("btnnoheader");
        if (noHeaderButton) {
            noHeaderButton.onclick = setNoHeader;
        }
        const defaultHeaderButton = document.getElementById("btndefaultheader");
        if (defaultHeaderButton) {
            defaultHeaderButton.onclick = setDefaultHeader;
        }
        const stickyHeaderButton = document.getElementById("btnstickyheader");
        if (stickyHeaderButton) {
            stickyHeaderButton.onclick = setStickyHeader;
        }
        const defaultRowTemplateButton = document.getElementById("btndefaultrowtemplate");
        if (defaultRowTemplateButton) {
            defaultRowTemplateButton.onclick = setDefaultRowItemTemplate;
        }
        const customRowTemplateButton = document.getElementById("btncustomrowtemplate");
        if (customRowTemplateButton) {
            customRowTemplateButton.onclick = setCustomRowItemTemplate;
        }
        const defaultCellTemplateButton = document.getElementById(
            "btndefaultcelltemplate"
        );
        if (defaultCellTemplateButton) {
            defaultCellTemplateButton.onclick = setDefaultCellItemTemplate;
        }
        const customCellTemplateButton = document.getElementById("btncustomcelltemplate");
        if (customCellTemplateButton) {
            customCellTemplateButton.onclick = setCustomCellItemTemplate;
        }
        const defaultHeaderCellTemplateButton = document.getElementById(
            "btndefaultheadercelltemplate"
        );
        if (defaultHeaderCellTemplateButton) {
            defaultHeaderCellTemplateButton.onclick = setDefaultHeaderCellItemTemplate;
        }
        const customHeaderCellTemplateButton = document.getElementById(
            "btncustomheadercelltemplate"
        );
        if (customHeaderCellTemplateButton) {
            customHeaderCellTemplateButton.onclick = setCustomHeaderCellItemTemplate;
        }
        // note: we use mouse enter because clicking to move focus seems to confuse focus-visible
        const focusLeftButton = document.getElementById("btnfocusleft");
        if (focusLeftButton) {
            focusLeftButton.onmouseenter = moveFocus;
        }
        const focusRightButton = document.getElementById("btnfocusright");
        if (focusRightButton) {
            focusRightButton.onmouseenter = moveFocus;
        }
        const focusUpButton = document.getElementById("btnfocusup");
        if (focusUpButton) {
            focusUpButton.onmouseenter = moveFocus;
        }
        const focusDownButton = document.getElementById("btnfocusdown");
        if (focusDownButton) {
            focusDownButton.onmouseenter = moveFocus;
        }
    }
});
const buttonCellTemplate = html`
    <template>
        <fast-button @click="${x => cellTemplateButtonClick(x)}" style="width: 100%;">
            ${x =>
                x.rowData === null ||
                x.columnDefinition === null ||
                x.columnDefinition.columnDataKey === null
                    ? null
                    : x.rowData[x.columnDefinition.columnDataKey]}
        </fast-button>
    </template>
`;
const buttonHeaderCellTemplate = html`
    <template>
        <fast-button
            @click="${x => headerTemplateButtonClick(x)}"
            style="width: 100%; background: green"
        >
            ${x =>
                x.columnDefinition === null
                    ? null
                    : x.columnDefinition.title === undefined
                    ? x.columnDefinition.columnDataKey
                    : x.columnDefinition.title}
        </fast-button>
    </template>
`;
function reset() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.columnDefinitions = null;
    defaultGridElement.rowsData = newDataSet(10);
}
function setDefaultCols() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.columnDefinitions = baseColumns;
}
function setTemplateCols() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.columnDefinitions = templateColumns;
}
function addRow() {
    if (defaultGridElement === null || defaultGridElement.rowsData === null) {
        return;
    }
    defaultGridElement.rowsData.push(
        newDataRow(`${defaultGridElement.rowsData.length + 1}`)
    );
}
function removeRow() {
    if (
        defaultGridElement === null ||
        defaultGridElement.rowsData === null ||
        defaultGridElement.rowsData.length === 0
    ) {
        return;
    }
    defaultGridElement.rowsData.pop();
}
function setNoHeader() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.generateHeader = GenerateHeaderOptions.none;
}
function setDefaultHeader() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.generateHeader = GenerateHeaderOptions.default;
}
function setDefaultRowItemTemplate() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.rowItemTemplate = defaultRowItemTemplate;
}
function setCustomRowItemTemplate() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.rowItemTemplate = customRowItemTemplate;
}
function setDefaultCellItemTemplate() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.cellItemTemplate = undefined;
}
function setCustomCellItemTemplate() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.cellItemTemplate = customCellItemTemplate;
}
function setDefaultHeaderCellItemTemplate() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.headerCellItemTemplate = undefined;
}
function setCustomHeaderCellItemTemplate() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.headerCellItemTemplate = customHeaderCellItemTemplate;
}
function moveFocus(e) {
    if (defaultGridElement === null) {
        return;
    }
    switch (e.target.id) {
        case "btnfocusleft":
            defaultGridElement.focusColumnIndex = defaultGridElement.focusColumnIndex - 1;
            break;
        case "btnfocusright":
            defaultGridElement.focusColumnIndex = defaultGridElement.focusColumnIndex + 1;
            break;
        case "btnfocusup":
            defaultGridElement.focusRowIndex = defaultGridElement.focusRowIndex - 1;
            break;
        case "btnfocusdown":
            defaultGridElement.focusRowIndex = defaultGridElement.focusRowIndex + 1;
            break;
    }
}
function headerTemplateButtonClick(cell) {
    if (
        cell.columnDefinition === null ||
        defaultGridElement === null ||
        defaultGridElement.columnDefinitions === null
    ) {
        return;
    }
    const index = defaultGridElement.columnDefinitions.indexOf(cell.columnDefinition);
    if (columnWidths[index] === "1fr") {
        columnWidths.splice(index, 1, "2fr");
    } else {
        columnWidths.splice(index, 1, "1fr");
    }
    defaultGridElement.gridTemplateColumns = `${columnWidths[0]} ${columnWidths[1]} ${columnWidths[2]} ${columnWidths[3]}`;
}
function cellTemplateButtonClick(cell) {
    if (
        cell.columnDefinition === null ||
        cell.rowData === null ||
        defaultGridElement === null
    ) {
        return;
    }
    const newRowData = Object.assign({}, cell.rowData);
    newRowData[cell.columnDefinition.columnDataKey] = "clicked";
    const rowIndex = defaultGridElement.rowsData.indexOf(cell.rowData);
    if (rowIndex > -1) {
        defaultGridElement.rowsData.splice(rowIndex, 1, newRowData);
    }
}
function setStickyHeader() {
    if (defaultGridElement === null) {
        return;
    }
    defaultGridElement.generateHeader = GenerateHeaderOptions.sticky;
}
function newDataSet(rowCount) {
    const newRows = [];
    for (let i = 0; i <= rowCount; i++) {
        newRows.push(newDataRow(`${i + 1}`));
    }
    return newRows;
}
function newDataRow(id) {
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
const baseColumns = [
    { columnDataKey: "rowId" },
    { columnDataKey: "item1" },
    { columnDataKey: "item2" },
    { columnDataKey: "item3" },
];
const templateColumns = [
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
function getFocusTarget(cell) {
    return cell.querySelector("fast-button");
}
export default {
    title: "Data Grid",
};
export const dataGrid = () => DataGridTemplate;
