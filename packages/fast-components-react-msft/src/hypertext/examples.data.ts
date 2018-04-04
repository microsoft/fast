import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-jss-manager-react";
import Hypertext from "./index";
import {IHypertextProps} from "@microsoft/fast-components-react-base";

export default {
    name: "hypertext",
    component: Hypertext,
    data: [
        {
            href: "https://msdn.microsoft.com",
            children: "Hyper text"
        }
    ]
} as IGenericExample<IHypertextProps>;
