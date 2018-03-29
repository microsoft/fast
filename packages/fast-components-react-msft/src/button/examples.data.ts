import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-jss-manager-react";
import Button from "./index";
import {IButtonProps} from "@microsoft/fast-components-react-base";

export default {
    name: "button",
    component: Button,
    data: [
        {
            children: "Button text"
        }
    ]
} as IGenericExample<IButtonProps>;
