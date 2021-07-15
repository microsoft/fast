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
const style = {
    singleLineControlTemplate: {},
    singleLineControlTemplate_control: Object.assign(
        Object.assign({}, controlSingleLineWrapperStyle),
        { position: "relative" }
    ),
    singleLineControlTemplate__disabled: Object.assign({}, formControlDisabledStyle),
    singleLineControlTemplate_badge: Object.assign({}, formControlIndicatorStyle),
    singleLineControlTemplate_defaultValueIndicator: Object.assign(
        {},
        interactiveFormControlIndicatorStyle
    ),
    singleLineControlTemplate_label: Object.assign(Object.assign({}, labelStyle), {
        "margin-left": "8px",
    }),
    singleLineControlTemplate_invalidMessage: Object.assign({}, invalidMessageStyle),
    singleLineControlTemplate_softRemove: Object.assign({}, softRemoveStyle),
    singleLineControlTemplate_softRemoveInput: Object.assign({}, softRemoveInputStyle),
};
export default style;
