import { defaultFontStyle, inputStyle } from "../../style";
const styles = {
    numberFieldControl: Object.assign(Object.assign({}, inputStyle), {
        width: "100%",
        "&$numberFieldControl__default": Object.assign({}, defaultFontStyle),
    }),
    numberFieldControl__disabled: {},
    numberFieldControl__default: {},
};
export default styles;
