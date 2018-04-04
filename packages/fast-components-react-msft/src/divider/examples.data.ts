import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-jss-manager-react";
import Divider from "./index";
import {DividerRole, IDividerHandledProps} from "@microsoft/fast-components-react-base";

export default {
    name: "divider",
    component: Divider,
    data: [
        {
        },
        {
            role: DividerRole.presentation
        },
        {
            role: DividerRole.separator
        }
    ]
} as IGenericExample<IDividerHandledProps>;
