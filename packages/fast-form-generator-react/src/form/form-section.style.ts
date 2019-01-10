import {
    applyControl,
    applyControlWrapper,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    colors,
} from "../utilities/";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormSectionClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormSectionClassNameContract, {}> = {
    formSection: {
        display: "block",
        "& h3": {
            borderBottom: `1px solid ${colors.background800}`,
            paddingBottom: "12px",
            marginBottom: "0",
        },
    },
    formSection_selectWrapper: {
        ...applyControl(),
        ...applyControlWrapper(),
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
