import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    Caption,
    CaptionProps,
    captionSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/caption/guidance";
import API from "../api";

const captionConfig: ComponentViewConfig<CaptionProps> = {
    api: API(React.lazy(() => import("../../.tmp/caption/api"))),
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
