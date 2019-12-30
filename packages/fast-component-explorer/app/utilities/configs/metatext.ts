import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    Metatext,
    MetatextProps,
    metatextSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/metatext/guidance";
import API from "../api";

const metatextConfig: ComponentViewConfig<MetatextProps> = {
    api: API(React.lazy(() => import("../../.tmp/metatext/api"))),
    schema: metatextSchema,
    component: Metatext,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: "Metatext",
            },
        },
    ],
};

export default metatextConfig;
