import {
    CallToAction,
    CallToActionProps,
    callToActionSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/call-to-action/guidance";
import { ComponentViewConfig } from "./data.props";

const callToActionConfig: ComponentViewConfig<CallToActionProps> = {
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
