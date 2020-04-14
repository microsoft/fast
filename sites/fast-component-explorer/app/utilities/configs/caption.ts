import {
    Caption,
    CaptionProps,
    captionSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/caption/guidance";
import { ComponentViewConfig } from "./data.props";

const captionConfig: ComponentViewConfig<CaptionProps> = {
    schema: captionSchema,
    component: Caption,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: "Caption",
            },
        },
    ],
};

export default captionConfig;
