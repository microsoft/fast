import { defaultFontStyle, inputStyle } from "../../style";
const styles = {
    buttonControl: Object.assign(Object.assign({}, inputStyle), {
        width: "100%",
        textAlign: "start",
        "&$buttonControl__default": Object.assign({}, defaultFontStyle),
    }),
    buttonControl__disabled: {},
    buttonControl__default: {},
};
export default styles;
