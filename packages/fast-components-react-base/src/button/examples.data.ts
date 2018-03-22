import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import { IInjectedProps } from "@microsoft/fast-jss-manager-react";
import Button, {IButtonProps, IButtonManagedClasses} from "./Button";

export default {
    name: "button",
    component: Button,
    data: [
        {
            managedClasses: {
                button: "button"
            },
            children: "Button text"
        }
    ]
} as IGenericExample<IButtonProps & IInjectedProps<IButtonManagedClasses>>;
