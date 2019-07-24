import { ComponentViewConfig } from "./data.props";
import { Label, LabelProps, labelSchema } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/label/guidance";

const checkboxConfig: ComponentViewConfig<LabelProps> = {
    schema: labelSchema,
    component: Label,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Default label",
            },
        },
    ],
};

export default checkboxConfig;
