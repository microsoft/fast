import * as React from "react";
import { ActionTrigger, ActionTriggerAppearance, ActionTriggerProps } from "./index";
import schema from "./action-trigger.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import ReactSVGElementSchema from "../../app/components/react-svg-element.schema.json";

const testDestination: string = "https://www.microsoft.com/en-us/";

const glyphExample: any = {
    id: ReactSVGElementSchema.id,
    props: {},
};

export default {
    name: "Action trigger",
    component: ActionTrigger,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Action Trigger",
        appearance: ActionTriggerAppearance.primary,
        href: testDestination,
        glyph: glyphExample,
    },
    data: [
        {
            appearance: ActionTriggerAppearance.primary,
            children: "Primary action trigger",
            href: testDestination,
            glyph: glyphExample,
            "data-sketch-symbol": "Action trigger - primary",
        } as any, // TODO https://github.com/Microsoft/TypeScript/issues/6579
        {
            appearance: ActionTriggerAppearance.lightweight,
            children: "Lightweight action trigger",
            href: testDestination,
            glyph: glyphExample,
            "data-sketch-symbol": "Action trigger - lightweight",
        },
        {
            appearance: ActionTriggerAppearance.justified,
            children: "Justified action trigger",
            href: testDestination,
            glyph: glyphExample,
            "data-sketch-symbol": "Action trigger - justified",
        },
        {
            appearance: ActionTriggerAppearance.outline,
            children: "Outlined action trigger",
            href: testDestination,
            glyph: glyphExample,
            "data-sketch-symbol": "Action trigger - outlined",
        },
    ],
} as ComponentFactoryExample<ActionTriggerProps>;
