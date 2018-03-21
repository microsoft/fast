import {ICategoryItemProps} from "@microsoft/fast-react-development-site";
import {IGenericExample} from "../examples";
import { IInjectedProps } from "@microsoft/fast-react-jss-manager";
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
