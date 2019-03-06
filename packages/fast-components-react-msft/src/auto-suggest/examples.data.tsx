import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./auto-suggest.schema.json";
import autoSuggestOptionSchema from "../auto-suggest-option/auto-suggest-option.schema.json";
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
                id: autoSuggestOptionSchema.id,
                props: {
                    ...autoSuggestOptionPropFactory("a"),
                },
            },
            {
                id: autoSuggestOptionSchema.id,
                props: {
                    ...autoSuggestOptionPropFactory("b"),
                },
            },
            {
                id: autoSuggestOptionSchema.id,
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
                    id: autoSuggestOptionSchema.id,
                    props: {
                        ...autoSuggestOptionPropFactory("value 1"),
                        selected: true,
                    },
                },
                {
                    id: autoSuggestOptionSchema.id,
                    props: {
                        ...autoSuggestOptionPropFactory("value 2"),
                    },
                },
                {
                    id: autoSuggestOptionSchema.id,
                    props: {
                        ...autoSuggestOptionPropFactory("value 3"),
                    },
                },
            ],
        },
    ],
};

export default examples;
