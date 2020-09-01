import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlStyle,
    controlWrapperStyle,
    labelStyle,
    selectInputStyle,
    selectSpanStyle,
} from "../../../style";
import { SectionOneOfAnyOfClassNameContract } from "./section.one-of-any-of.props";

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
