import React from "react";
import {
    AutoSuggestOption,
    AutoSuggestOptionProps,
    autoSuggestOptionSchema,
} from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Documentation from "./.tmp/documentation";

export default {
    name: "Auto suggest option",
    component: AutoSuggestOption,
    schema: autoSuggestOptionSchema as any,
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
