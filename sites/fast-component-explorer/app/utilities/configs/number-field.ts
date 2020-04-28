import { NumberField, numberFieldSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/number-field/guidance";
import { ComponentViewConfig } from "./data.props";

const numberFieldConfig: ComponentViewConfig = {
    schema: numberFieldSchema,
    component: NumberField,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: numberFieldSchema.id,
                        data: {
                            name: "numberField",
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Min, max and step",
            dataDictionary: [
                {
                    root: {
                        schemaId: numberFieldSchema.id,
                        data: {
                            min: 0,
                            max: 100,
                            step: 10,
                            name: "numberField",
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
                        schemaId: numberFieldSchema.id,
                        data: {
                            disabled: true,
                            name: "numberField",
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default numberFieldConfig;
