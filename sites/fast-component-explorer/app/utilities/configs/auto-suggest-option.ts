import {
    AutoSuggestOption,
    autoSuggestOptionSchema2,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/auto-suggest-option/guidance";
import { ComponentViewConfig } from "./data.props";

const autoSuggestOptionConfig: ComponentViewConfig = {
    schema: autoSuggestOptionSchema2,
    component: AutoSuggestOption,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: autoSuggestOptionSchema2.id,
                        data: {
                            value: "Value",
                            id: uniqueId(),
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
                        schemaId: autoSuggestOptionSchema2.id,
                        data: {
                            value: "Value",
                            disabled: true,
                            id: uniqueId(),
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default autoSuggestOptionConfig;
