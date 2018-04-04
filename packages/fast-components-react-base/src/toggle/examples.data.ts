import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {IGenericExample} from "../examples";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Toggle, {IToggleClassNameContract, IToggleProps} from "./toggle";

export default {
    name: "toggle",
    component: Toggle,
    data: [
        {
            managedClasses: {
                toggle: "toggle"
            },
            children: 'Toggle label',
            disabled: false,
            id: 'toggle01',
            labelId: 'label01',
            selected: true,
            selectedString: 'On',
            spanId: 'span01',
            unselectedString: 'Off'
        }
    ]
} as IGenericExample<IToggleProps & IManagedClasses<IToggleClassNameContract>>;
