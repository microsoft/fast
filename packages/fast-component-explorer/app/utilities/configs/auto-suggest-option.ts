import { ComponentViewConfig } from "./data.props";
import {
    AutoSuggestOption,
    AutoSuggestOptionProps,
    autoSuggestOptionSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/auto-suggest-option/guidance";

const autoSuggestOptionConfig: ComponentViewConfig<AutoSuggestOptionProps> = {
    schema: autoSuggestOptionSchema,
    component: AutoSuggestOption,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                value: "Value",
                id: uniqueId(),
            },
        },
        {
            displayName: "Disabled",
            data: {
                value: "Value",
                disabled: true,
                id: uniqueId(),
            },
        },
    ],
};

export default autoSuggestOptionConfig;
