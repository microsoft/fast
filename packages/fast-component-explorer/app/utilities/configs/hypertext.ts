import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    Hypertext,
    HypertextProps,
    hypertextSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/hypertext/guidance";
import API from "../api";

const hypertextConfig: ComponentViewConfig<HypertextProps> = {
    api: API(React.lazy(() => import("../../.tmp/hypertext/api"))),
    schema: hypertextSchema,
    component: Hypertext,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                href: "#",
                children: "Hypertext",
            },
        },
    ],
};

export default hypertextConfig;
