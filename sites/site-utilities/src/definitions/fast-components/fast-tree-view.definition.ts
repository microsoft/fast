import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { Orientation } from "@microsoft/fast-web-utilities";

export const fastSliderDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-slider",
            description: "The FAST slider element",
            attributes: [
                {
                    name: "name",
                    description: "The name attribute",
                    type: DataType.string,
                    default: "",
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
