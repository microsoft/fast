import {
    AutoSuggest,
    AutoSuggestOptionProps,
    autoSuggestOptionSchema2,
    autoSuggestSchema2,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/auto-suggest/guidance";
import { ComponentViewConfig } from "./data.props";

function autoSuggestOptionPropFactory(value: string): AutoSuggestOptionProps {
    return {
        id: uniqueId(),
        value,
        role: "option",
    };
}

const autoSuggestConfig: ComponentViewConfig = {
    schema: autoSuggestSchema2,
    component: AutoSuggest,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: autoSuggestSchema2.id,
                        data: {
                            placeholder: "Favorite animal",
                            listboxId: uniqueId(),
                            label: "Select your favorite animal",
                            initialValue: "Cat",
                            children: [
                                {
                                    id: "children0",
                                },
                                {
                                    id: "children1",
                                },
                                {
                                    id: "children2",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: autoSuggestOptionSchema2.id,
                        data: {
                            ...autoSuggestOptionPropFactory("Cat"),
                            selected: true,
                        },
                    },
                    children1: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: autoSuggestOptionSchema2.id,
                        data: {
                            ...autoSuggestOptionPropFactory("Dog"),
                        },
                    },
                    children2: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: autoSuggestOptionSchema2.id,
                        data: {
                            ...autoSuggestOptionPropFactory("Turtle"),
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default autoSuggestConfig;
