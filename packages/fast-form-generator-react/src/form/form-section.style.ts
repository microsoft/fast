import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyCleanListStyle,
    applyControl,
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
        ...applyControl(),
        marginBottom: "12px",
    },
    formSection_selectSpan: {
        ...applySelectSpanStyles(),
        marginTop: "8px",
    },
    formSection_selectInput: {
        ...applySelectInputStyles(),
    },
    formSection_selectLabel: {
        ...applyLabelStyle(),
        marginTop: "7px",
    },
};

export default styles;
