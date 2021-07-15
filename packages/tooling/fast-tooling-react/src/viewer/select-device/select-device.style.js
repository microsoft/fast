import { ellipsis } from "@microsoft/fast-jss-utilities";
import { selectInputStyle, selectSpanStyle } from "../../style";
const styles = () => {
    return {
        selectDevice: {
            display: "inline-block",
            verticalAlign: "text-bottom",
        },
        selectDevice_label: Object.assign(
            { lineHeight: "16px", fontSize: "14px", marginRight: "16px" },
            ellipsis()
        ),
        selectDevice_contentRegion: Object.assign({}, selectSpanStyle),
        selectDevice_select: Object.assign(Object.assign({}, selectInputStyle), {
            paddingRight: "15px",
        }),
    };
};
export default styles;
