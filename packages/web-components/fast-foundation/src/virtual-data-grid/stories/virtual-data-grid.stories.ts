import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTVirtualDataGrid } from "../virtual-data-grid.js";

type VirtualDataGridArgs = Args & FASTVirtualDataGrid;
type VirtualDataGridMeta = Meta<VirtualDataGridArgs>;

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

const storyTemplate = html<VirtualDataGridArgs>`
    <fast-virtual-data-grid
        style="height: 600px;"
        virtualization-disabled="true"
        :rowsData="${x => x.rowsData}"
        no-tabbing="${x => x.noTabbing}"
        generate-header="${x => x.generateHeader}"
        grid-template-columns="${x => x.gridTemplateColumns}"
    ></fast-virtual-data-grid>
`;

export default {
    title: "Virtual Data Grid",
    args: {
        rowsData: newDataSet(20),
        generateHeader: "none",
    },
    argTypes: {
        noTabbing: {
            control: { type: "boolean" },
        },
        generateHeader: {
            options: ["none", "default", "sticky"],
            control: { type: "select" },
        },
        gridTemplateColumns: {
            control: { type: "text" },
        },
    },
} as VirtualDataGridMeta;

export const VirtualDataGrid = (args: VirtualDataGridArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
