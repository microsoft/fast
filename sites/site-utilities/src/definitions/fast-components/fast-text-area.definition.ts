import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { TextAreaAppearance, TextAreaResize } from "@microsoft/fast-foundation";

export const fastTextAreaDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-text-area",
            description: "The FAST text-area element",
            attributes: [
                {
                    name: "appearance",
                    description: "The appearance attribute",
                    default: TextAreaAppearance.outline,
                    required: false,
                    type: DataType.string,
                    enum: [TextAreaAppearance.outline, TextAreaAppearance.filled],
                },
                {
                    name: "resize",
                    description: "The resize attribute",
                    required: false,
                    type: DataType.string,
                    enum: [
                        TextAreaResize.none,
                        TextAreaResize.both,
                        TextAreaResize.horizontal,
                        TextAreaResize.vertical,
                    ],
                    default: TextAreaResize.none,
                },
                {
                    name: "autofocus",
                    description: "The autofocus attribute",
                    required: false,
                    type: DataType.boolean,
                    default: false,
                },
                {
                    name: "cols",
                    description: "The cols attribute",
                    required: false,
                    type: DataType.number,
                    default: 20,
                },
                {
                    name: "form",
                    description: "The form attribute",
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
                    name: "placeholder",
                    description: "The placeholder attribute",
                    required: false,
                    type: DataType.string,
                    default: undefined,
                },
                {
                    name: "rows",
                    description: "The rows attribute",
                    required: false,
                    type: DataType.number,
                    default: undefined,
                },
                {
                    name: "spellcheck",
                    description: "The spellcheck attribute",
                    required: false,
                    type: DataType.boolean,
                    default: undefined,
                },
                {
                    name: "value",
                    description: "The value attribute",
                    default: undefined,
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
