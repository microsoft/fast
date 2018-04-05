import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-jss-manager-react";
import Checkbox from "./index";
import {ICheckboxProps} from "@microsoft/fast-components-react-base";

export default {
    name: "checkbox",
    component: Checkbox,
    data: [
        {
            items: [
                {
                    text: "Sign up"
                }
            ]
        }
    ]
} as IGenericExample<ICheckboxProps>;
