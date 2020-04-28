import {
    TextField,
    textFieldSchema,
    TextFieldType,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/text-field/guidance";
import { ComponentViewConfig } from "./data.props";

const textFieldConfig: ComponentViewConfig = {
    schema: textFieldSchema,
    component: TextField,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {},
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Placeholder",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {
                            placeholder: "Placeholder",
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Email",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {
                            placeholder: "Email",
                            type: TextFieldType.email,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Number",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {
                            placeholder: "Number",
                            type: TextFieldType.number,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Passsword",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {
                            placeholder: "Passsword",
                            type: TextFieldType.password,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Search",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {
                            placeholder: "Search",
                            type: TextFieldType.search,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Telephone",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {
                            placeholder: "Telephone",
                            type: TextFieldType.tel,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Url",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {
                            placeholder: "Url",
                            type: TextFieldType.url,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Disabled",
            dataDictionary: [
                {
                    root: {
                        schemaId: textFieldSchema.id,
                        data: {
                            disabled: true,
                            placeholder: "Placeholder",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default textFieldConfig;
