import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControl,
    applyControlRegion,
    applyControlWrapper,
    applyFormControlDisabled,
    applyFormControlIndicator,
    applyInteractiveFormControlIndicator,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";

export interface StandardControlTemplateClassNameContract {
    standardControlTemplate?: string;
    standardControlTemplate__disabled?: string;
    standardControlTemplate_badge?: string;
    standardControlTemplate_control?: string;
    standardControlTemplate_controlRegion?: string;
    standardControlTemplate_controlLabel?: string;
    standardControlTemplate_controlLabelRegion?: string;
    standardControlTemplate_constValueIndicator?: string;
    standardControlTemplate_defaultValueIndicator?: string;
    standardControlTemplate_invalidMessage?: string;
    standardControlTemplate_softRemove?: string;
    standardControlTemplate_softRemoveInput?: string;
}

const style: ComponentStyles<StandardControlTemplateClassNameContract, {}> = {
    standardControlTemplate: {
        ...applyControlWrapper(),
    },
    standardControlTemplate_invalidMessage: {
        ...applyInvalidMessage(),
    },
    standardControlTemplate__disabled: {
        ...applyFormControlDisabled(),
    },
    standardControlTemplate_badge: {
        ...applyFormControlIndicator(),
    },
    standardControlTemplate_control: {
        ...applyControl(),
    },
    standardControlTemplate_controlRegion: {
        ...applyControlRegion(),
    },
    standardControlTemplate_controlLabel: {
        ...applyLabelStyle(),
    },
    standardControlTemplate_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    standardControlTemplate_constValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    standardControlTemplate_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    standardControlTemplate_softRemove: {
        ...applySoftRemove(),
    },
    standardControlTemplate_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default style;
