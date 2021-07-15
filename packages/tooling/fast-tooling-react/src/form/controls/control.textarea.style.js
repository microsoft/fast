import { defaultFontStyle, inputStyle } from "../../style";
const styles = {
    textareaControl: Object.assign(Object.assign({}, inputStyle), {
        width: "100%",
        resize: "none",
        fontFamily: "inherit",
        "&$textareaControl__default": Object.assign({}, defaultFontStyle),
    }),
    textareaControl__disabled: {},
    textareaControl__default: {},
};
export default styles;
