import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlSingleLineWrapperStyle,
    formControlDisabledStyle,
    formControlIndicatorStyle,
    interactiveFormControlIndicatorStyle,
    invalidMessageStyle,
    labelStyle,
    softRemoveInputStyle,
    softRemoveStyle,
} from "../../style";

export interface SingleLineControlTemplateClassNameContract {
    singleLineControlTemplate?: string;
    singleLineControlTemplate__disabled?: string;
    singleLineControlTemplate_badge?: string;
    singleLineControlTemplate_control?: string;
    singleLineControlTemplate_defaultValueIndicator?: string;
    singleLineControlTemplate_label?: string;
    singleLineControlTemplate_invalidMessage?: string;
    singleLineControlTemplate_softRemove?: string;
    singleLineControlTemplate_softRemoveInput?: string;
}

const style: ComponentStyles<SingleLineControlTemplateClassNameContract, {}> = {
    singleLineControlTemplate: {},
    singleLineControlTemplate_control: {
        ...controlSingleLineWrapperStyle,
        position: "relative",
    },
    singleLineControlTemplate__disabled: {
        ...formControlDisabledStyle,
    },
    singleLineControlTemplate_badge: {
        ...formControlIndicatorStyle,
    },
    singleLineControlTemplate_defaultValueIndicator: {
        ...interactiveFormControlIndicatorStyle,
    },
    singleLineControlTemplate_label: {
        ...labelStyle,
        "margin-left": "8px",
    },
    singleLineControlTemplate_invalidMessage: {
        ...invalidMessageStyle,
    },
    singleLineControlTemplate_softRemove: {
        ...softRemoveStyle,
    },
    singleLineControlTemplate_softRemoveInput: {
        ...softRemoveInputStyle,
    },
};

export default style;
