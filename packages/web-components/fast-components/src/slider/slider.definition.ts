import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { Orientation } from "@microsoft/fast-web-utilities";

export const fastSliderDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-slider",
            title: "Slider",
            description: "The FAST slider element",
            attributes: [
                {
                    name: "value",
                    title: "Value",
                    description: "The slider value",
                    default: undefined,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "max",
                    title: "Max",
                    description: "The maximum value",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "min",
                    title: "Min",
                    description: "The minimum value",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "step",
                    title: "Step",
                    description: "Amount to increment or decrement the value by",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "orientation",
                    title: "Orientation",
                    description: "The orientation of the slider",
                    default: Orientation.horizontal,
                    values: [
                        { name: Orientation.horizontal },
                        { name: Orientation.vertical },
                    ],
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
                    description: "Sets the disabled state of the slider",
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
                        "Default slotted content of the slider represents its visual labels",
                },
                {
                    name: "track",
                    title: "Track slot",
                    description: "Slot to replace the slider track",
                },
                {
                    name: "thumb",
                    title: "Thumb slot",
                    description: "Slot to replace the slider thumb",
                },
            ],
        },
    ],
};
