import { ComponentViewConfig } from "./data.props";
import {
    Caption,
    CaptionProps,
    captionSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/caption/guidance";
import API from "../../.tmp/caption/api";

const captionConfig: ComponentViewConfig<CaptionProps> = {
    api: API,
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
