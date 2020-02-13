import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { formControlDisabledStyle } from "../../style";

export interface BareControlTemplateClassNameContract {
    bareControlTemplate?: string;
    bareControlTemplate__disabled?: string;
}

const style: ComponentStyles<BareControlTemplateClassNameContract, {}> = {
    bareControlTemplate: {},
    bareControlTemplate__disabled: {
        ...formControlDisabledStyle,
    },
};

export default style;
