import { ComponentViewConfig } from "./data.props";
import {
    Toggle,
    ToggleHandledProps,
    ToggleProps,
    toggleSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/toggle/guidance";

const toggleProps: Pick<
    ToggleHandledProps,
    "selectedMessage" | "unselectedMessage" | "statusMessageId" | "inputId"
> = {
    selectedMessage: "selected",
    unselectedMessage: "unselected",
    statusMessageId: uniqueId(),
    inputId: uniqueId(),
};

const toggleConfig: ComponentViewConfig<ToggleProps> = {
    schema: toggleSchema,
    component: Toggle,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                ...toggleProps,
            },
        },
        {
            displayName: "Selected",
            data: {
                selected: true,
                ...toggleProps,
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                ...toggleProps,
            },
        },
    ],
};

export default toggleConfig;
