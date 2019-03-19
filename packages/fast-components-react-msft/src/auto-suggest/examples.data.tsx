import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./auto-suggest.schema.json";
import { AutoSuggest, AutoSuggestProps } from "./index";
import { AutoSuggestOptionProps } from "../auto-suggest-option";
import Documentation from "./.tmp/documentation";

function autoSuggestOptionPropFactory(id: string): AutoSuggestOptionProps {
    return {
        id,
        value: "Option-" + id,
        role: "option",
    };
}

const examples: ComponentFactoryExample<AutoSuggestProps> = {
    name: "Auto suggest",
    component: AutoSuggest,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        placeholder: "placeholder",
        listboxId: "listboxId",
        children: [
            {
                id: "@microsoft/fast-components-react-msft/auto-suggest-option",
                props: {
                    ...autoSuggestOptionPropFactory("a"),
                },
            },
            {
                id: "@microsoft/fast-components-react-msft/auto-suggest-option",
                props: {
                    ...autoSuggestOptionPropFactory("b"),
                },
            },
            {
                id: "@microsoft/fast-components-react-msft/auto-suggest-option",
                props: {
                    ...autoSuggestOptionPropFactory("c"),
                },
            },
        ],
    },
    data: [
        {
            placeholder: "placeholder",
            listboxId: "listboxId",
            children: [
                {
                    id: "@microsoft/fast-components-react-msft/auto-suggest-option",
                    props: {
                        ...autoSuggestOptionPropFactory("value 1"),
                        selected: true,
                    },
                },
                {
                    id: "@microsoft/fast-components-react-msft/auto-suggest-option",
                    props: {
                        ...autoSuggestOptionPropFactory("value 2"),
                    },
                },
                {
                    id: "@microsoft/fast-components-react-msft/auto-suggest-option",
                    props: {
                        ...autoSuggestOptionPropFactory("value 3"),
                    },
                },
            ],
        },
    ],
};

export default examples;
