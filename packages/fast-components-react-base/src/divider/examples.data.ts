import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Divider, {IDividerClassNameContract, IDividerProps} from "./divider";

export default {
    name: "divider",
    component: Divider,
    data: [
        {
            managedClasses: {
                divider: "divider"
            },
            children: "Divider"
        }
    ]
} as IGenericExample<IDividerProps & IManagedClasses<IDividerClassNameContract>>;
