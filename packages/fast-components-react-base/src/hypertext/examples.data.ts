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
            href: "https://247sports.com",
            children: "Sports!",
            ariaLabel: "Testing aria label here",
            id: "test id"
        }
    ]
} as IGenericExample<IHypertextProps & IManagedClasses<IHypertextClassNameContract>>;
