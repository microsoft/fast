import {
    TextArea,
    TextAreaProps,
    textAreaSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/text-area/guidance";
import { ComponentViewConfig } from "./data.props";

const textAreaConfig: ComponentViewConfig<TextAreaProps> = {
    schema: textAreaSchema,
    component: TextArea,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {},
        },
        {
            displayName: "Placeholder",
            data: {
                placeholder: "Placeholder",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                placeholder: "Placeholder",
            },
        },
    ],
};

export default textAreaConfig;
