import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Hypertext, {IHypertextClassNameContract, IHypertextProps} from "./Hypertext";

export default {
    name: "hypertext",
    component: Hypertext,
    data: [
        {
            managedClasses: {
                hypertext: "hypertext"
            },
            href: "https://msdn.microsoft.com/en-us/",
            children: "MSDN"
        }
    ]
} as IGenericExample<IHypertextProps & IManagedClasses<IHypertextClassNameContract>>;
