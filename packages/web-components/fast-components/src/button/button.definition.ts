import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastButtonDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-button",
            title: "Button",
            description: "The FAST button element",
            attributes: [
                {
                    name: "appearance",
                    title: "Appearance",
                    description: "The anchor's visual treatment",
                    type: DataType.string,
                    values: [
                        {
                            name: "accent",
                        },
                        {
                            name: "lightweight",
                        },
                        {
                            name: "neutral",
                        },
                        {
                            name: "outline",
                        },
                        {
                            name: "stealth",
                        },
                    ],
                    default: "neutral",
                    required: false,
                },
                {
                    name: "autofocus",
                    title: "Autofocus",
                    description:
                        "Determines if the element should receive document focus on page load",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "disabled",
                    title: "Disabled",
                    description: "Sets the disabled state of the button",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
                {
                    name: "form",
                    title: "Form",
                    description: "The id of a form to associate the element to",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formaction",
                    title: "Formaction",
                    description: "The HTML formaction attribute of the button",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formenctype",
                    title: "Formenctype",
                    description: "The HTML formenctype attribute of the button",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formmethod",
                    title: "Formmethod",
                    description: "The HTML formmethod attribute of the button",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formnovalidate",
                    title: "Formnovalidate",
                    description: "The HTML formnovalidate attribute of the button",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
                {
                    name: "formtarget",
                    title: "Formtarget",
                    description: "The HTML formtarget attribute of the button",
                    type: DataType.string,
                    default: undefined,
                    values: [
                        {
                            name: "_self",
                        },
                        {
                            name: "_blank",
                        },
                        {
                            name: "_parent",
                        },
                        {
                            name: "_top",
                        },
                    ],
                    required: false,
                },
                {
                    name: "name",
                    title: "Name",
                    description: "The HTML name attribute of the button",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "type",
                    title: "Type",
                    description: "The HTML type attribute of the button",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "value",
                    title: "Value",
                    description: "The HTML value attribute of the button",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the anchor",
                },
                {
                    name: "start",
                    title: "Start slot",
                    description:
                        "Contents of the start slot are positioned before the button content",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the button content",
                },
            ],
        },
    ],
};
