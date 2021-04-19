import { WebComponentDefinition } from "../../data-utilities/web-component";
import { DataType } from "../../data-utilities";

export const svgDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "svg",
            description: "The svg element",
            title: "svg",
            attributes: [
                {
                    name: "width",
                    description: "The svg width",
                    default: "",
                    title: "width",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "height",
                    description: "The svg height",
                    default: "",
                    title: "height",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "viewBox",
                    description: "The svg viewBox",
                    default: "",
                    title: "viewBox",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "fill",
                    description: "The svg fill",
                    default: "",
                    title: "fill",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "xmlns",
                    description: "The svg xmls",
                    default: "http://www.w3.org/2000/svg",
                    title: "xmlns",
                    type: DataType.string,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "Default slot",
                    description: "The default slot",
                    title: "Default slot",
                },
            ],
        },
    ],
};
