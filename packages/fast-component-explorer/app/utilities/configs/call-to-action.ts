import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    CallToAction,
    CallToActionAppearance,
    CallToActionProps,
    callToActionSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/call-to-action/guidance";
import API from "../api";

const callToActionConfig: ComponentViewConfig<CallToActionProps> = {
    api: API(React.lazy(() => import("../../.tmp/call-to-action/api"))),
    schema: callToActionSchema,
    component: CallToAction,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Neutral",
            data: {
                children: "Buy Now",
            },
        },
    ],
};

export default callToActionConfig;
