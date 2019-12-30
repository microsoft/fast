import { ComponentViewConfig } from "./data.props";
import {
    AutoSuggest,
    AutoSuggestOptionProps,
    autoSuggestOptionSchema,
    AutoSuggestProps,
    autoSuggestSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/auto-suggest/guidance";
import API from "../../.tmp/auto-suggest/api";

function autoSuggestOptionPropFactory(value: string): AutoSuggestOptionProps {
    return {
        id: uniqueId(),
        value,
        role: "option",
    };
}

const autoSuggestConfig: ComponentViewConfig<AutoSuggestProps> = {
    api: API,
    schema: autoSuggestSchema,
    component: AutoSuggest,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                placeholder: "Favorite animal",
                listboxId: uniqueId(),
                label: "Select your favorite animal",
                initialValue: "Cat",
                children: [
                    {
                        id: autoSuggestOptionSchema.id,
                        props: {
                            ...autoSuggestOptionPropFactory("Cat"),
                            selected: true,
                        },
                    },
                    {
                        id: autoSuggestOptionSchema.id,
                        props: {
                            ...autoSuggestOptionPropFactory("Dog"),
                        },
                    },
                    {
                        id: autoSuggestOptionSchema.id,
                        props: {
                            ...autoSuggestOptionPropFactory("Turtle"),
                        },
                    },
                ],
            },
        },
    ],
};

export default autoSuggestConfig;
