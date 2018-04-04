import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-jss-manager-react";
import Toggle from "./index";
import {IToggleProps} from "@microsoft/fast-components-react-base";

export default {
    name: "toggle",
    component: Toggle,
    data: [
        {
            children: "Toggle label",
            disabled: false,
            id: "toggle01",
            labelId: "label01",
            selected: true,
            selectedString: "On",
            spanId: "span01",
            unselectedString: "Off"
        }
    ]
} as IGenericExample<IToggleProps>;
