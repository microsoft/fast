import { Scenario } from "./data.props";
import { ActionToggleProps } from "@microsoft/fast-components-react-msft";

const scenarios: Scenario<ActionToggleProps>[] = [
    {
        displayName: "Default",
        data: {
            unselectedLabel: "Unselected",
            selectedLabel: "Selected",
        },
    },
];

export default scenarios;
