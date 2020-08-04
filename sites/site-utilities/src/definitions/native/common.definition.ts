import { WebComponentAttribute } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const commonHTMLAttributes: WebComponentAttribute[] = [
    {
        name: "style",
        type: DataType.string,
        description: "The inline CSS style",
        default: "",
        required: false,
    },
];
