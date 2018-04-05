import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Checkbox, {ICheckboxClassNameContract, ICheckboxItem, ICheckboxProps} from "./checkbox";

export default {
    name: "checkbox",
    component: Checkbox,
    data: [
        {
            managedClasses: {
                checkbox: "checkbox"
            },
            items: [
                {
                    text: "Sign up"
                }
            ]
        }
    ]
} as IGenericExample<ICheckboxProps & IManagedClasses<ICheckboxClassNameContract>>;
