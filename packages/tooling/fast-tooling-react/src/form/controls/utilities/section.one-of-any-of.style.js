import {
    controlStyle,
    controlWrapperStyle,
    labelStyle,
    selectInputStyle,
    selectSpanStyle,
} from "../../../style";
const styles = {
    sectionOneOfAnyOf: Object.assign(
        Object.assign({}, controlStyle),
        controlWrapperStyle
    ),
    sectionOneOfAnyOf_selectSpan: Object.assign({}, selectSpanStyle),
    sectionOneOfAnyOf_select: Object.assign({}, selectInputStyle),
    sectionOneOfAnyOf_label: Object.assign({}, labelStyle),
};
export default styles;
