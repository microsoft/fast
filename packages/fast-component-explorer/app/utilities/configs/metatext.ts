import { ComponentViewConfig } from "./data.props";
import {
    Metatext,
    MetatextProps,
    metatextSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/metatext/guidance";

const metatextConfig: ComponentViewConfig<MetatextProps> = {
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
