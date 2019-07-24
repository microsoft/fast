import { ComponentViewConfig } from "./data.props";
import {
    TextField,
    TextFieldProps,
    textFieldSchema,
    TextFieldType,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/text-field/guidance";

const textFieldConfig: ComponentViewConfig<TextFieldProps> = {
    schema: textFieldSchema,
    component: TextField,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {},
        },
        {
            displayName: "Placeholder",
            data: {
                placeholder: "Placeholder",
            },
        },
        {
            displayName: "Email",
            data: {
                placeholder: "Email",
                type: TextFieldType.email,
            },
        },
        {
            displayName: "Number",
            data: {
                placeholder: "Number",
                type: TextFieldType.number,
            },
        },
        {
            displayName: "Passsword",
            data: {
                placeholder: "Passsword",
                type: TextFieldType.password,
            },
        },
        {
            displayName: "Search",
            data: {
                placeholder: "Search",
                type: TextFieldType.search,
            },
        },
        {
            displayName: "Telephone",
            data: {
                placeholder: "Telephone",
                type: TextFieldType.tel,
            },
        },
        {
            displayName: "Url",
            data: {
                placeholder: "Url",
                type: TextFieldType.url,
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                placeholder: "Placeholder",
            },
        },
    ],
};

export default textFieldConfig;
