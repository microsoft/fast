import { ComponentViewConfig } from "./data.props";
import {
    ActionToggleProps,
    actionToggleSchema,
    ActionToggleAppearance,
    ActionToggle,
} from "@microsoft/fast-components-react-msft";

const actionToggleConfig: ComponentViewConfig<ActionToggleProps> = {
    schema: actionToggleSchema,
    component: ActionToggle,
    scenarios: [
        {
            displayName: "Default",
            data: {
                appearance: ActionToggleAppearance.primary,
                unselectedLabel: "Pause",
                selectedLabel: "Play",
                selectedContent: "Pause",
                unselectedContent: "Play",
            },
        },
        {
            displayName: "Foo",
            data: {
                unselectedLabel: "Pause",
                selectedLabel: "Play",
                selectedContent: "Foo",
                unselectedContent: "Bar",
            },
        },
    ],
};

export default actionToggleConfig;
