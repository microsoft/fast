import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyCleanListStyle,
    applyLabelStyle,
    applyListItemStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applyWrapperStyle,
    colors
} from "../utilities/form-input.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormSectionClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormSectionClassNameContract, {}> = {
    formSection: {
        display: "block"
    },
    formSection_menu: {
        ...applyCleanListStyle(),
        ...applyListItemStyle()
    },
    formSection_toggleWrapper: {
        display: "flex",
        alignItems: "baseline",
        "& label": {
            flexGrow: "1",
            padding: toPx(12)
        }
    },
    formSection_toggle: {
        borderRadius: toPx(20),
        width: toPx(44),
        height: toPx(20),
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: colors.grayBackground,
        border: `${toPx(1)} solid ${colors.gray}`,
        position: "relative",
        float: "right",
        marginLeft: toPx(8),
        "& > span": {
            position: "absolute",
            backgroundColor: colors.black,
            borderRadius: toPx(10),
            content: "''",
            height: toPx(10),
            left: toPx(5),
            pointerEvents: "none",
            top: toPx(4),
            transition: "all .1s ease",
            width: toPx(10)
        },
        "&[aria-pressed='true']": {
            backgroundColor: colors.pink,
            "& > span": {
                left: toPx(28),
                backgroundColor: colors.white
            }
        },
        "&:focus": {
            outline: "none"
        },
        "& + span": {
            float: "right"
        }
    },
    formSection_selectWrapper: {
        ...applyWrapperStyle(),
        borderBottom: `${toPx(1)} solid ${colors.border}`,
        paddingBottom: toPx(12),
        marginBottom: toPx(4)
    },
    formSection_selectSpan: {
        ...applySelectSpanStyles()
    },
    formSection_selectInput: {
        ...applySelectInputStyles()
    },
    formSection_selectLabel: {
        ...applyLabelStyle()
    }
};

export default styles;
