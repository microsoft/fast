import { ComponentViewConfig } from "./data.props";
import {
    ActionToggleProps,
    actionToggleSchema,
} from "@microsoft/fast-components-react-msft";

const actionToggleConfig: ComponentViewConfig<ActionToggleProps> = {
    schema: actionToggleSchema,
    scenarios: [
        {
            displayName: "Default",
            data: {
                unselectedLabel: "Unselected",
                selectedLabel: "Selected",
                selectedContent: "Pause",
                unselectedContent: "Play",
            },
        },
    ],
};

export default actionToggleConfig;
