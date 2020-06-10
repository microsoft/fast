import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const svgDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "svg",
            description: "The svg element",
            attributes: [
                {
                    name: "width",
                    description: "The svg width",
                    default: "",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "height",
                    description: "The svg height",
                    default: "",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "viewBox",
                    description: "The svg viewBox",
                    default: "",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "fill",
                    description: "The svg fill",
                    default: "",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "xmls",
                    description: "The svg xmls",
                    default: "http://www.w3.org/2000/svg",
                    type: DataType.string,
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
