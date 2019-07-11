import { ComponentViewConfig } from "./data.props";
import {
    CallToAction,
    CallToActionAppearance,
    CallToActionProps,
    callToActionSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/call-to-action/guidance";

const callToActionConfig: ComponentViewConfig<CallToActionProps> = {
    schema: callToActionSchema,
    component: CallToAction,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Buy Now",
            },
        },
    ],
};

export default callToActionConfig;
