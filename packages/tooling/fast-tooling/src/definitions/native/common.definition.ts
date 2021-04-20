import { WebComponentAttribute } from "../../data-utilities/web-component";
import { DataType } from "../../data-utilities";

export const commonHTMLAttributes: WebComponentAttribute[] = [
    {
        name: "style",
        type: DataType.string,
        title: "CSS",
        description: "The inline CSS style",
        default: "",
        required: false,
    },
];
