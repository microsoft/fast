import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { TextFieldType } from "@microsoft/fast-foundation/dist/esm/text-field/text-field.options";

export const fastTextFieldDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-text-field",
            title: "Text field",
            description: "The FAST text-field element",
            attributes: [
                {
                    name: "value",
                    title: "Value",
                    description: "The HTML value attribute of the text field",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                },
                {
                    name: "appearance",
                    title: "Appearance",
                    description: "The text field's visual treatment",
                    default: "outline",
                    values: [{ name: "outline" }, { name: "filled" }],
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "autofocus",
                    title: "Autofocus",
                    description:
                        "Determines if the element should receive document focus on page load",
                    required: false,
                    type: DataType.boolean,
                    default: false,
                },
                {
                    name: "placeholder",
                    title: "Placeholder",
                    description:
                        "Sets the placeholder value of the element, generally used to provide a hint to the user",
                    required: false,
                    type: DataType.string,
                    default: undefined,
                },
                {
                    name: "type",
                    title: "Type",
                    description: "Specifies the type of text input for the field",
                    default: TextFieldType.text,
                    values: [
                        { name: TextFieldType.email },
                        { name: TextFieldType.password },
                        { name: TextFieldType.tel },
                        { name: TextFieldType.text },
                        { name: TextFieldType.url },
                    ],
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "list",
                    title: "List",
                    description: "Allows associating a datalist to the component",
                    required: false,
                    type: DataType.string,
                    default: "",
                },
                {
                    name: "maxlength",
                    title: "Maxlength",
                    description: "The maximum number of characters a user can enter",
                    required: false,
                    type: DataType.number,
                    default: undefined,
                },
                {
                    name: "minlength",
                    title: "Minlength",
                    description: "The minimum number of characters a user can enter",
                    required: false,
                    type: DataType.number,
                    default: undefined,
                },
                {
                    name: "pattern",
                    title: "Pattern",
                    description:
                        "A regular expression that the value must match to pass validation",
                    required: false,
                    type: DataType.string,
                    default: undefined,
                },
                {
                    name: "size",
                    title: "Size",
                    description:
                        "Sets the width of the element to a specified number of characters",
                    required: false,
                    type: DataType.number,
                    default: undefined,
                },
                {
                    name: "spellcheck",
                    description:
                        "Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used",
                    required: false,
                    type: DataType.boolean,
                    default: undefined,
                },
                {
                    name: "name",
                    title: "Name",
                    description:
                        "This element's value will be surfaced during form submission under the provided name",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "required",
                    title: "Required",
                    description:
                        "Require the field to be completed prior to form submission",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "disabled",
                    title: "Disabled",
                    description: "Sets the disabled state of the number field",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "readonly",
                    title: "Readonly",
                    description:
                        "When true, the control will be immutable by user interaction",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the radio represents its visual label",
                },
                {
                    name: "start",
                    title: "Start slot",
                    description:
                        "Contents of the start slot are positioned before the option content",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the option content",
                },
            ],
        },
    ],
};
