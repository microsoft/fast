import { GenerateHeaderOptions } from "@microsoft/fast-foundation/dist/esm/data-grid/data-grid.options";
import { DataType } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";

export const fastDataGridDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-data-grid",
            title: "Data grid",
            description: "The FAST data grid element",
            attributes: [
                {
                    name: "generate-header",
                    title: "Generate header",
                    description: "Whether the grid should auto generate a header row",
                    type: DataType.boolean,
                    default: true,
                    required: false,
                },
                {
                    name: "grid-template-columns",
                    title: "Grid template columns",
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
                    title: "Default slot",
                    description: "The content as data grid rows",
                },
            ],
        },
    ],
};
