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
const style = {
    standardControlTemplate: Object.assign({}, controlWrapperStyle),
    standardControlTemplate_invalidMessage: Object.assign({}, invalidMessageStyle),
    standardControlTemplate__disabled: Object.assign({}, formControlDisabledStyle),
    standardControlTemplate_badge: Object.assign({}, formControlIndicatorStyle),
    standardControlTemplate_control: Object.assign({}, controlStyle),
    standardControlTemplate_controlRegion: Object.assign({}, controlRegionStyle),
    standardControlTemplate_controlLabel: Object.assign({}, labelStyle),
    standardControlTemplate_controlLabelRegion: Object.assign({}, labelRegionStyle),
    standardControlTemplate_constValueIndicator: Object.assign(
        {},
        interactiveFormControlIndicatorStyle
    ),
    standardControlTemplate_defaultValueIndicator: Object.assign(
        {},
        interactiveFormControlIndicatorStyle
    ),
    standardControlTemplate_softRemove: Object.assign({}, softRemoveStyle),
    standardControlTemplate_softRemoveInput: Object.assign({}, softRemoveInputStyle),
};
export default style;
