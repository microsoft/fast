import React from "react";
import {
    CallToAction,
    CallToActionAppearance,
    CallToActionProps,
    callToActionSchema,
} from "./index";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const testString: string = "Call to action";
const testDestination: string = "https://www.microsoft.com/en-us/";

export default {
    name: "Call to action",
    component: CallToAction,
    schema: callToActionSchema as any,
    documentation: <Documentation />,
    detailData: {
        children: testString,
        appearance: CallToActionAppearance.primary,
        href: testDestination,
    },
    data: [
        {
            children: "Default call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - default",
        } as any, // TODO https://github.com/Microsoft/TypeScript/issues/6579
        {
            appearance: CallToActionAppearance.justified,
            children: "Justified call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - justified",
        },
        {
            appearance: CallToActionAppearance.lightweight,
            children: "Lightweight call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - lightweight",
        },
        {
            appearance: CallToActionAppearance.outline,
            children: "Outline call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - outline",
        },
        {
            appearance: CallToActionAppearance.primary,
            children: "Primary call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - primary",
        },
        {
            appearance: CallToActionAppearance.stealth,
            children: "Stealth call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - stealth",
        },
    ],
} as ComponentFactoryExample<CallToActionProps>;
