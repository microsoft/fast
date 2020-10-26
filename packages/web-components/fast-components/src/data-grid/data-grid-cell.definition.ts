import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { DataGridCellTypes } from "@microsoft/fast-foundation";

export const fastDataGridCellDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-data-grid-cell",
            description: "The FAST data grid cell element",
            attributes: [
                {
                    name: "cell-type",
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
                    description: "Positions the cell in the column layout.",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
    ],
};
