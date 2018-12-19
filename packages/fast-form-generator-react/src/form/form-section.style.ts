import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyCleanListStyle,
    applyHeaderStyle,
    applyLabelStyle,
    applyListItemStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applyWrapperStyle,
    colors,
    rightArrow,
} from "../utilities/form-input.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormSectionClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormSectionClassNameContract, {}> = {
    formSection: {
        display: "block",
        "& h3": {
            borderBottom: `${toPx(1)} solid ${colors.border}`,
            paddingBottom: toPx(12),
            marginBottom: "0",
        },
    },
    formSection_selectWrapper: {
        ...applyWrapperStyle(),
        borderBottom: `${toPx(1)} solid ${colors.border}`,
        paddingBottom: toPx(12),
        marginBottom: toPx(4),
    },
    formSection_selectSpan: {
        ...applySelectSpanStyles(),
    },
    formSection_selectInput: {
        ...applySelectInputStyles(),
    },
    formSection_selectLabel: {
        ...applyLabelStyle(),
    },
};

export default styles;
