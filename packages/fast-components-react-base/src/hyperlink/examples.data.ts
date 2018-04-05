import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Hyperlink, {IHyperlinkClassNameContract, IHyperlinkProps} from "./Hyperlink";

export default {
    name: "hyperlink",
    component: Hyperlink,
    data: [
        {
            managedClasses: {
                hyperlink: "hyperlink"
            },
            href: "https://247sports.com",
            children: "Sports!"
        }
    ]
} as IGenericExample<IHyperlinkProps & IManagedClasses<IHyperlinkClassNameContract>>;
