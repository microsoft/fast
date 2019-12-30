import { ComponentViewConfig } from "./data.props";
import {
    CallToAction,
    CallToActionAppearance,
    CallToActionProps,
    callToActionSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/call-to-action/guidance";
import API from "../../.tmp/call-to-action/api";

const callToActionConfig: ComponentViewConfig<CallToActionProps> = {
    api: API,
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
