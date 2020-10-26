import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { DataGridRowTypes } from "@microsoft/fast-foundation";

export const fastDataGridRowDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-data-grid-row",
            description: "The FAST data grid row element",
            attributes: [
                {
                    name: "grid-template-columns",
                    description:
                        "String that gets applied to the the css gridTemplateColumns attribute of child rows",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "row-type",
                    description: "The type of row - default or header.",
                    type: DataType.string,
                    values: [
                        { name: DataGridRowTypes.default },
                        { name: DataGridRowTypes.header },
                    ],
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
