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
                    name: "value",
                    description: "The value attribute",
                    default: undefined,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "min",
                    description: "The min attribute",
                    default: 0,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "max",
                    description: "The max attribute",
                    default: 100,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "step",
                    description: "The step attribute",
                    default: 1,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "orientation",
                    description: "The orientation attribute",
                    default: Orientation.horizontal,
                    enum: [Orientation.horizontal, Orientation.vertical],
                    required: false,
                    type: DataType.string,
                },
                {
                    name: "name",
                    description: "The name attribute",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "required",
                    description: "The required attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "disabled",
                    description: "The disabled attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "readonly",
                    description: "The readonly attribute",
                    type: DataType.boolean,
                    default: false,
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
