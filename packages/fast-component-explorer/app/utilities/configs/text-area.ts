import { ComponentViewConfig } from "./data.props";
import {
    TextArea,
    TextAreaProps,
    textAreaSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/text-area/guidance";
import API from "../../.tmp/text-area/api";

const textAreaConfig: ComponentViewConfig<TextAreaProps> = {
    api: API,
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
