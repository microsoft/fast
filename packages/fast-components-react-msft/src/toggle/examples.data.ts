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
            children: "Toggle label (default on)",
            disabled: false,
            id: "toggle01",
            labelId: "label01",
            selected: true,
            selectedString: "On",
            spanId: "span01",
            unselectedString: "Off"
        },
        {
            children: "Toggle label (default off)",
            disabled: false,
            id: "toggle01",
            labelId: "label01",
            selected: false,
            selectedString: "On",
            spanId: "span01",
            unselectedString: "Off"
        },
        {
            children: "Toggle label (disabled on)",
            disabled: true,
            id: "toggle02",
            labelId: "label02",
            selected: true,
            selectedString: "On",
            spanId: "span02",
            unselectedString: "Off"
        },
        {
            children: "Toggle label (disabled off)",
            disabled: true,
            id: "toggle02",
            labelId: "label02",
            selected: false,
            selectedString: "On",
            spanId: "span02",
            unselectedString: "Off"
        }
    ]
} as IGenericExample<IToggleProps>;
