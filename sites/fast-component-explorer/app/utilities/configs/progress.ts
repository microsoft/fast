import { Progress, progressSchema2 } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/progress/guidance";
import { ComponentViewConfig } from "./data.props";

const progressConfig: ComponentViewConfig = {
    schema: progressSchema2,
    component: Progress,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Indeterminate",
            dataDictionary: [
                {
                    root: {
                        schemaId: progressSchema2.id,
                        data: {},
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Min, max and value",
            dataDictionary: [
                {
                    root: {
                        schemaId: progressSchema2.id,
                        data: {
                            minValue: 0,
                            maxValue: 100,
                            value: 72,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Indeterminate circular",
            dataDictionary: [
                {
                    root: {
                        schemaId: progressSchema2.id,
                        data: {
                            circular: true,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Min, max and value circular",
            dataDictionary: [
                {
                    root: {
                        schemaId: progressSchema2.id,
                        data: {
                            circular: true,
                            minValue: 0,
                            maxValue: 100,
                            value: 72,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default progressConfig;
