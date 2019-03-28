import React from "react";
import { ActionTrigger, ActionTriggerAppearance, ActionTriggerProps } from "./index";
import schema from "./action-trigger.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import svgSchema from "../../app/components/svg-svg-element.schema.json";

const testDestination: string = "https://www.microsoft.com/en-us/";

const examples: ComponentFactoryExample<ActionTriggerProps> = {
    name: "Action trigger",
    component: ActionTrigger,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Action Trigger",
        appearance: ActionTriggerAppearance.primary,
        href: testDestination,
        glyph: {
            id: svgSchema.id,
            props: {},
        } as any,
    },
    data: [
        {
            appearance: ActionTriggerAppearance.primary,
            children: "Primary action trigger",
            href: testDestination,
            glyph: {
                id: svgSchema.id,
                props: {},
            },
            "data-sketch-symbol": "Action trigger - primary",
        } as any,
        {
            appearance: ActionTriggerAppearance.lightweight,
            children: "Lightweight action trigger",
            href: testDestination,
            glyph: {
                id: svgSchema.id,
                props: {},
            },
            "data-sketch-symbol": "Action trigger - lightweight",
        },
        {
            appearance: ActionTriggerAppearance.justified,
            children: "Justified action trigger",
            href: testDestination,
            glyph: {
                id: svgSchema.id,
                props: {},
            },
            "data-sketch-symbol": "Action trigger - justified",
        },
        {
            appearance: ActionTriggerAppearance.outline,
            children: "Outlined action trigger",
            href: testDestination,
            glyph: {
                id: svgSchema.id,
                props: {},
            },
            "data-sketch-symbol": "Action trigger - outlined",
        },
    ],
};

export default examples;
