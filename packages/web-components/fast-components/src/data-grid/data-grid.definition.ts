import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { GenerateHeaderOptions } from "@microsoft/fast-foundation";

export const fastDataGridDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-data-grid",
            description: "The FAST data grid element",
            attributes: [
                {
                    name: "generate-header",
                    description: "Whether the grid should auto generate a header row",
                    type: DataType.boolean,
                    default: true,
                    required: false,
                },
                {
                    name: "grid-template-columns",
                    description:
                        "String that gets applied to the the css gridTemplateColumns attribute of child rows",
                    type: DataType.string,
                    values: [
                        { name: GenerateHeaderOptions.none },
                        { name: GenerateHeaderOptions.default },
                        { name: GenerateHeaderOptions.sticky },
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
