import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { FormOneOfAnyOfClassNameContract } from "./form-one-of-any-of.props";
import {
    controlStyle,
    controlWrapperStyle,
    labelStyle,
    selectInputStyle,
    selectSpanStyle,
} from "../style";

const styles: ComponentStyles<FormOneOfAnyOfClassNameContract, {}> = {
    formOneOfAnyOf: {
        ...controlStyle,
        ...controlWrapperStyle,
    },
    formOneOfAnyOf_selectSpan: {
        ...selectSpanStyle,
    },
    formOneOfAnyOf_select: {
        ...selectInputStyle,
    },
    formOneOfAnyOf_label: {
        ...labelStyle,
    },
};

export default styles;
