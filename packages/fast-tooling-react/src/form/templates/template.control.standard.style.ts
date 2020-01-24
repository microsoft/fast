import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlRegionStyle,
    controlStyle,
    controlWrapperStyle,
    formControlDisabledStyle,
    formControlIndicatorStyle,
    interactiveFormControlIndicatorStyle,
    invalidMessageStyle,
    labelRegionStyle,
    labelStyle,
    softRemoveInputStyle,
    softRemoveStyle,
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
        ...controlWrapperStyle,
    },
    standardControlTemplate_invalidMessage: {
        ...invalidMessageStyle,
    },
    standardControlTemplate__disabled: {
        ...formControlDisabledStyle,
    },
    standardControlTemplate_badge: {
        ...formControlIndicatorStyle,
    },
    standardControlTemplate_control: {
        ...controlStyle,
    },
    standardControlTemplate_controlRegion: {
        ...controlRegionStyle,
    },
    standardControlTemplate_controlLabel: {
        ...labelStyle,
    },
    standardControlTemplate_controlLabelRegion: {
        ...labelRegionStyle,
    },
    standardControlTemplate_constValueIndicator: {
        ...interactiveFormControlIndicatorStyle,
    },
    standardControlTemplate_defaultValueIndicator: {
        ...interactiveFormControlIndicatorStyle,
    },
    standardControlTemplate_softRemove: {
        ...softRemoveStyle,
    },
    standardControlTemplate_softRemoveInput: {
        ...softRemoveInputStyle,
    },
};

export default style;
