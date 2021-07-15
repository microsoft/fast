import {
    defaultFontStyle,
    FloatingCSSProperty,
    selectInputStyle,
    selectSpanStyle,
} from "../../style";
const styles = {
    selectControl: Object.assign(Object.assign({}, selectSpanStyle), {
        "&$selectControl__default $selectControl_input": Object.assign(
            {},
            defaultFontStyle
        ),
    }),
    selectControl__disabled: {},
    selectControl_input: Object.assign(Object.assign({}, selectInputStyle), {
        "& option": {
            background: FloatingCSSProperty,
        },
    }),
    selectControl__default: {},
};
export default styles;
