import { defaultFontStyle, inputStyle } from "../../style";
const styles = {
    displayControl: Object.assign(Object.assign({}, inputStyle), {
        width: "100%",
        "&$displayControl__default": Object.assign({}, defaultFontStyle),
    }),
    displayControl__disabled: {},
    displayControl__default: {},
};
export default styles;
