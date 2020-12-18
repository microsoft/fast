import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastNumberFieldDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-number-field",
            description: "The FAST number-field element",
            attributes: [
                {
                    name: "value",
                    description: "The value attribute",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                },
                {
                    name: "appearance",
                    description: "The appearance attribute",
                    default: "outline",
                    values: [{ name: "outline" }, { name: "filled" }],
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "autofocus",
                    description: "The autofocus attribute",
                    required: false,
                    type: DataType.boolean,
                    default: false,
                },
                {
                    name: "placeholder",
                    description: "The placeholder attribute",
                    required: false,
                    type: DataType.string,
                    default: undefined,
                },
                {
                    name: "list",
                    description: "The list attribute",
                    required: false,
                    type: DataType.string,
                    default: "",
                },
                {
                    name: "maxlength",
                    description: "The maxlength attribute",
                    required: false,
                    type: DataType.number,
                    default: undefined,
                },
                {
                    name: "minlength",
                    description: "The minlength attribute",
                    required: false,
                    type: DataType.number,
                    default: undefined,
                },
                {
                    name: "size",
                    description: "The size attribute",
                    required: false,
                    type: DataType.number,
                    default: undefined,
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
                {
                    name: "max",
                    description: "The maximum value",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "min",
                    description: "The minimum value",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "step",
                    description: "The step interval",
                    type: DataType.string,
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
