import { ComponentViewConfig } from "./data.props";
import {
    Caption,
    CaptionProps,
    captionSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/caption/guidance";

const captionConfig: ComponentViewConfig<CaptionProps> = {
    schema: captionSchema,
    component: Caption,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: "Default caption",
            },
        },
    ],
};

export default captionConfig;
