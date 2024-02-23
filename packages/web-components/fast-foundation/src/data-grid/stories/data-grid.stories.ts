import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import { defaultCellFocusTargetCallback } from "../data-grid-cell.js";
import {
    DataGridSelectionBehavior,
    DataGridSelectionMode,
    FASTDataGrid,
    GenerateHeaderOptions,
} from "../data-grid.js";

const storyTemplate = html<StoryArgs<FASTDataGrid>>`
    <fast-data-grid
        style="${x => x.style}"
        :columnDefinitions="${x => (x.columnDefinitions ? x.columnDefinitions : null)}"
        :rowsData="${x => x.rowsData}"
        no-tabbing="${x => x.noTabbing}"
        generate-header="${x => x.generateHeader}"
        grid-template-columns="${x => x.gridTemplateColumns}"
        page-size="${x => x.pageSize}"
        disable-click-select="${x => x.disableClickSelect}"
        selection-mode="${x => x.selectionMode}"
        initial-row-selection="${x => x.initialRowSelection}"
        selection-behavior="${x => x.selectionBehavior}"
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
            control: "text",
        },
        content: { table: { disable: true } },
        noTabbing: {
            control: "boolean",
        },
        generateHeader: {
            options: Object.values(GenerateHeaderOptions),
            control: "select",
        },
        pageSize: {
            control: "number",
        },
        gridTemplateColumns: {
            control: "text",
        },
        columnDefinitions: {
            control: { type: "object" },
        },
        storyContent: {
            table: { disable: true },
        },
        selectionMode: {
            options: Object.values(DataGridSelectionMode),
            control: "select",
        },
        selectionBehavior: {
            options: Object.values(DataGridSelectionBehavior),
            control: "select",
        },
        disableClickSelect: {
            control: "boolean",
        },
        initialRowSelection: {
            control: "text",
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

const editCellTemplate = html`
    <template>
        <fast-text-field
            tabIndex="-1"
            value="${x => x.rowData[x.columnDefinition.columnDataKey]}"
        ></fast-text-field>
    </template>
`;

const checkboxCellTemplate = html`
    <template>
        <fast-checkbox>${x => x.rowData[x.columnDefinition.columnDataKey]}</fast-checkbox>
    </template>
`;

const complexCellTemplate = html`
  <template>
    <complex-cell
        tabIndex="-1"
    ></complexCell>
  </template>
`;

export const DataGridEditBoxes: Story<FASTDataGrid> = renderComponent(storyTemplate).bind(
    {}
);
DataGridEditBoxes.args = {
    columnDefinitions: [
        { columnDataKey: "rowId" },
        {
            columnDataKey: "item1",
            cellTemplate: checkboxCellTemplate,
            cellFocusTargetCallback: defaultCellFocusTargetCallback,
        },
        {
            columnDataKey: "item2",
            cellInternalFocusQueue: true,
            cellTemplate: editCellTemplate,
            cellFocusTargetCallback: defaultCellFocusTargetCallback,
        },
        {
            columnDataKey: "item3",
            cellInternalFocusQueue: true,
            cellTemplate: complexCellTemplate,
            cellFocusTargetCallback: defaultCellFocusTargetCallback,
        },
    ],
};
