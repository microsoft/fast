import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { TextAreaResize } from "@microsoft/fast-foundation/dist/esm/text-area/text-area.options";

export const fastTextAreaDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-text-area",
            title: "Text area",
            description: "The FAST text-area element",
            attributes: [
                {
                    name: "appearance",
                    title: "Appearance",
                    description: "The text area's visual treatment",
                    default: "outline",
                    required: false,
                    type: DataType.string,
                    values: [{ name: "outline" }, { name: "filled" }],
                },
                {
                    name: "resize",
                    title: "Resize",
                    description: "The resize mode of the element",
                    required: false,
                    type: DataType.string,
                    values: [
                        { name: TextAreaResize.none },
                        { name: TextAreaResize.both },
                        { name: TextAreaResize.horizontal },
                        { name: TextAreaResize.vertical },
                    ],
                    default: TextAreaResize.none,
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
                    name: "cols",
                    title: "Columns",
                    description:
                        "Sizes the element vertically by a number of character columns",
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
                    name: "placeholder",
                    title: "Placeholder",
                    description:
                        "Sets the placeholder value of the element, generally used to provide a hint to the user",
                    required: false,
                    type: DataType.string,
                    default: undefined,
                },
                {
                    name: "rows",
                    title: "Rows",
                    description:
                        "Sizes the element vertically by a number of character rows",
                    required: false,
                    type: DataType.number,
                    default: undefined,
                },
                {
                    name: "spellcheck",
                    title: "Spellcheck",
                    description:
                        "Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used",
                    required: false,
                    type: DataType.boolean,
                    default: undefined,
                },
                {
                    name: "value",
                    title: "Value",
                    description: "The HTML value attribute of the text area",
                    default: undefined,
                    required: false,
                    type: DataType.string,
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
                    description: "Sets the disabled state of the text area",
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
                    description:
                        "The content of the text area represents its visual label",
                },
            ],
        },
    ],
};
