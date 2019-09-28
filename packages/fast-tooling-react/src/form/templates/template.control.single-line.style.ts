import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControlSingleLineWrapper,
    applyFormControlDisabled,
    applyFormControlIndicator,
    applyInteractiveFormControlIndicator,
    applyInvalidMessage,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
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
        ...applyControlSingleLineWrapper(),
        position: "relative",
    },
    singleLineControlTemplate__disabled: {
        ...applyFormControlDisabled(),
    },
    singleLineControlTemplate_badge: {
        ...applyFormControlIndicator(),
    },
    singleLineControlTemplate_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    singleLineControlTemplate_label: {
        ...applyLabelStyle(),
        marginLeft: "8px",
    },
    singleLineControlTemplate_invalidMessage: {
        ...applyInvalidMessage(),
    },
    singleLineControlTemplate_softRemove: {
        ...applySoftRemove(),
    },
    singleLineControlTemplate_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default style;
