import { ComponentViewConfig } from "./data.props";
import {
    Hypertext,
    HypertextProps,
    hypertextSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/hypertext/guidance";
import API from "../../.tmp/hypertext/api";

const hypertextConfig: ComponentViewConfig<HypertextProps> = {
    api: API,
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
