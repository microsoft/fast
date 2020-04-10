import {
    Progress,
    ProgressProps,
    progressSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/progress/guidance";
import { ComponentViewConfig } from "./data.props";

const progressConfig: ComponentViewConfig<ProgressProps> = {
    schema: progressSchema,
    component: Progress,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Indeterminate",
            data: {},
        },
        {
            displayName: "Min, max and value",
            data: {
                minValue: 0,
                maxValue: 100,
                value: 72,
            },
        },
        {
            displayName: "Indeterminate circular",
            data: {
                circular: true,
            },
        },
        {
            displayName: "Min, max and value circular",
            data: {
                circular: true,
                minValue: 0,
                maxValue: 100,
                value: 72,
            },
        },
    ],
};

export default progressConfig;
