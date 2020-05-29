import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastButtonDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-button",
            description: "The FAST button element",
            attributes: [
                {
                    name: "appearance",
                    description: "The appearance attribute",
                    type: DataType.string,
                    enum: ["accent", "lightweight", "neutral", "outline", "stealth"],
                    default: "neutral",
                    required: false,
                },
                {
                    name: "autofocus",
                    description: "The autofocus attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "disabled",
                    description: "The disabled attribute",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
                {
                    name: "form",
                    description: "The form attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formaction",
                    description: "The formaction attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formenctype",
                    description: "The formenctype attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formmethod",
                    description: "The formmethod attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formnovalidate",
                    description: "The formnovalidate attribute",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formtarget",
                    description: "The formtarget attribute",
                    type: DataType.string,
                    default: undefined,
                    enum: ["_self", "_blank", "_parent", "_top"],
                    required: false,
                },
                {
                    name: "name",
                    description: "The name attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "type",
                    description: "The type attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "value",
                    description: "The value attribute",
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
