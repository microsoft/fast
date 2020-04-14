import { Label, LabelProps, labelSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/label/guidance";
import { ComponentViewConfig } from "./data.props";

const checkboxConfig: ComponentViewConfig<LabelProps> = {
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
