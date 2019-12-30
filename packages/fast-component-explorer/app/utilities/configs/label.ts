import { ComponentViewConfig } from "./data.props";
import { Label, LabelProps, labelSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/label/guidance";
import API from "../../.tmp/label/api";

const checkboxConfig: ComponentViewConfig<LabelProps> = {
    api: API,
    schema: labelSchema,
    component: Label,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: "Label",
            },
        },
    ],
};

export default checkboxConfig;
