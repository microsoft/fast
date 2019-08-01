import { ComponentViewConfig } from "./data.props";
import {
    Hypertext,
    HypertextProps,
    hypertextSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/hypertext/guidance";

const hypertextConfig: ComponentViewConfig<HypertextProps> = {
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
