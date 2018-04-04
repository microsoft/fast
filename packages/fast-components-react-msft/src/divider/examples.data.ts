import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-jss-manager-react";
import Divider from "./index";
import {IDividerHandledProps} from "@microsoft/fast-components-react-base";
import { DividerRole } from "../../../fast-components-react-base/dist/divider/divider.props";

export default {
    name: "divider",
    component: Divider,
    data: [
        {
            role: DividerRole.presentation
        }
    ]
} as IGenericExample<IDividerHandledProps>;
