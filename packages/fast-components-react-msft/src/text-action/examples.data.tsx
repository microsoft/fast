import * as React from "react";
import { TextAction, TextActionProps } from "./index";
import schema from "./text-action.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

export default {
    name: "Text action",
    component: TextAction,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "foo",
    },
    data: [
        {
            children: "Text action",
            "data-sketch-symbol": "Text action",
        } as any, // TODO https://github.com/Microsoft/TypeScript/issues/6579
    ],
} as ComponentFactoryExample<TextActionProps>;
