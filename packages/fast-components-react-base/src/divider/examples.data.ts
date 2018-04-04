import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Divider, {IDividerClassNameContract, IDividerHandledProps} from "./divider";

export default {
    name: "divider",
    component: Divider,
    data: [
        {
            managedClasses: {
                divider: "divider"
            }
        }
    ]
} as IGenericExample<IDividerHandledProps & IManagedClasses<IDividerClassNameContract>>;
