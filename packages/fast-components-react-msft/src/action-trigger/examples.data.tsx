import * as React from "react";
import { ActionTrigger, ActionTriggerAppearance, ActionTriggerProps } from "./index";
import schema from "./action-trigger.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const testString: string = "Action trigger";
const testDestination: string = "https://www.microsoft.com/en-us/";

export default {
    name: "Action trigger",
    component: ActionTrigger,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: testString,
        appearance: ActionTriggerAppearance.primary,
        href: testDestination,
    },
    data: [
        {
            appearance: ActionTriggerAppearance.primary,
            children: "Primary call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - primary",
        } as any, // TODO https://github.com/Microsoft/TypeScript/issues/6579
        {
            appearance: ActionTriggerAppearance.lightweight,
            children: "Lightweight call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - lightweight",
        },
        {
            appearance: ActionTriggerAppearance.justified,
            children: "Justified call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - justified",
        },
    ],
} as ComponentFactoryExample<ActionTriggerProps>;
