import * as React from "react";
import { AutoSuggestOption, AutoSuggestOptionProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./auto-suggest-option.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Auto suggest option",
    component: AutoSuggestOption,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        value: "Test value",
        id: "TestID",
    },
    data: [
        {
            value: "Test value",
            id: "TestID",
        },
        {
            value: "Test value",
            id: "TestID",
            disabled: true,
        },
    ],
} as ComponentFactoryExample<AutoSuggestOptionProps>;
