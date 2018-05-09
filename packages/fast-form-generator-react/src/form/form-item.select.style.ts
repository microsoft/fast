import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.style";
import { IFormItemSelectClassNameContract } from "../class-name-contracts/";

function applypaddingStyle(): ICSSRules<{}> {
    return {
        padding: localizeSpacing(Direction.ltr)(`${toPx(8)} ${toPx(24)} ${toPx(8)} ${toPx(8)}`)
    };
}

const styles: ComponentStyles<IFormItemSelectClassNameContract, {}> = {
    formItemSelect: {
        ...applyWrapperStyle()
    },
    formItemSelect_label: {
        ...applyLabelStyle()
    },
    formItemSelect_span: {
        position: "relative",
        display: "flex",
        flexGrow: "1",
        "&:before, &:after": {
            content: "''",
            position: "absolute",
            top: toPx(12),
            zIndex: 1,
            borderRadius: toPx(2),
            width: toPx(1),
            height: toPx(10),
            background: "black"
        },
        "&:before": {
            right: toPx(15),
            transform: "rotate(45deg)"
        },
        "&:after": {
            right: toPx(22),
            transform: "rotate(-45deg)"
        }
    },
    formItemSelect_input: {
        flexGrow: "1",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: toPx(2),
        boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.08)",
        appearance: "none",
        ...applypaddingStyle(),
        border: "none",
        outline: "none",
        "&:-ms-expand": {
            display: "none"
        }
    },
    formItemSelect_option: {
        ...applypaddingStyle()
    }
};

export default styles;
