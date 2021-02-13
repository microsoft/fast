import { DataGridCellTypes } from "@microsoft/fast-foundation/dist/esm/data-grid/data-grid.options";
import { DataType } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";

export const fastDataGridCellDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-data-grid-cell",
            title: "Data grid cell",
            description: "The FAST data grid cell element",
            attributes: [
                {
                    name: "cell-type",
                    title: "Cell type",
                    description: "The type of cell - default or columnheader.",
                    type: DataType.string,
                    values: [
                        { name: DataGridCellTypes.default },
                        { name: DataGridCellTypes.columnHeader },
                    ],
                    default: undefined,
                    required: false,
                },
                {
                    name: "grid-column",
                    title: "Grid column",
                    description: "Positions the cell in the column layout.",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The cell content",
                },
            ],
        },
    ],
};
