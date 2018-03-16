import {ICategoryItemProps} from "@microsoft/fast-development-site";
import {IGenericExample} from "../examples";
import {IInjectedProps} from "@microsoft/fast-react-jss-manager";
import Button from "./index";
import {IButtonProps} from "@microsoft/fast-react-components-base";

export default {
    name: "button",
    component: Button,
    data: [
        {
            children: "Button text"
        }
    ]
} as IGenericExample<IButtonProps>;
