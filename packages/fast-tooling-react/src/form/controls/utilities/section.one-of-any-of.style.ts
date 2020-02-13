import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { SectionOneOfAnyOfClassNameContract } from "./section.one-of-any-of.props";
import {
    controlStyle,
    controlWrapperStyle,
    labelStyle,
    selectInputStyle,
    selectSpanStyle,
} from "../../../style";

const styles: ComponentStyles<SectionOneOfAnyOfClassNameContract, {}> = {
    sectionOneOfAnyOf: {
        ...controlStyle,
        ...controlWrapperStyle,
    },
    sectionOneOfAnyOf_selectSpan: {
        ...selectSpanStyle,
    },
    sectionOneOfAnyOf_select: {
        ...selectInputStyle,
    },
    sectionOneOfAnyOf_label: {
        ...labelStyle,
    },
};

export default styles;
