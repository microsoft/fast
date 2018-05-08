import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.shared-style.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemChildrenClassNameContract } from "../class-name-contracts/";

function applyCleanListStyle(): ICSSRules<{}> {
    return {
        listStyle: "none",
        margin: "0",
        padding: "0"
    };
}

const styles: ComponentStyles<IFormItemChildrenClassNameContract, {}> = {
    formItemChildren: {
        display: "flex",
        flexDirection: "column"
    },
    formItemChildren_inputWrapper: {
        display: "flex",
        "& input": {
            ...applyInputStyle(),
            flex: "2",
            marginRight: toPx(8)
        },
        "& button": {
            fontSize: toPx(15),
            maxWidth: toPx(374),
            minWidth: toPx(120),
            flex: "1",
            display: "inline-block",
            padding: `${toPx(13)} ${toPx(12)} ${toPx(12)}`,
            border: `${toPx(2)} solid transparent`,
            borderRadius: toPx(2),
            cursor: "pointer",
            overflow: "hidden",
            lineHeight: "1",
            textAlign: "center",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
            transition: "all 0.2s ease-in-out",
            color: "white",
            background: "#0078D4",
            "&:hover": {
                background: "#0075CF"
            },
            "&:focus": {
                outline: "none",
                background: "#005EA6"
            },
            "&:disabled, &[aria-disabled]": {
                opacity: ".4",
                cursor: "not-allowed",
                "&:hover": {
                    background: "#D3E6F5"
                }
            }
        }
    }
};

export default styles;
