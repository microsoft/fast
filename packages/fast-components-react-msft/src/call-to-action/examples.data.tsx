import * as React from "react";
import CallToAction from "./index";
import {
    CallToActionProps,
    ICallToActionHandledProps,
    ICallToActionManagedClasses,
    ICallToActionUnhandledProps
} from "./call-to-action.props";
import { ButtonAppearance } from "../button/button.props";
import schema from "./call-to-action.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const testString: string = "Call to action";
const testDestination: string = "https://www.microsoft.com/en-us/";

export default {
    name: "Call to action",
    component: CallToAction,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: testString,
        appearance: ButtonAppearance.primary,
        href: testDestination
    },
    data: [
        {
            appearance: ButtonAppearance.primary,
            children: "Primary call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - primary"
        },
        {
            appearance: ButtonAppearance.lightweight,
            children: "Lightweight call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - lightweight"
        },
        {
            appearance: ButtonAppearance.justified,
            children: "Secondary call to action",
            href: testDestination,
            "data-sketch-symbol": "Call to action - justified"
        }
    ]
} as IComponentFactoryExample<ICallToActionHandledProps>;
