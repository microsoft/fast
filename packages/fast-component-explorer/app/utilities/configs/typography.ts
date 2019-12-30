import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    Typography,
    TypographyProps,
    typographySchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/typography/guidance";
import API from "../api";

const typographyConfig: ComponentViewConfig<TypographyProps> = {
    api: API(React.lazy(() => import("../../.tmp/typography/api"))),
    schema: typographySchema,
    component: Typography,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: "Typography",
            },
        },
    ],
};

export default typographyConfig;
