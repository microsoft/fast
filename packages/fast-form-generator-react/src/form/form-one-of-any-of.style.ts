import {
    applyControl,
    applyControlWrapper,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
} from "./form.utilities.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormOneOfAnyOfClassNameContract } from "./form-one-of-any-of.props";

const styles: ComponentStyles<FormOneOfAnyOfClassNameContract, {}> = {
    formOneOfAnyOf: {
        ...applyControl(),
        ...applyControlWrapper(),
    },
    formOneOfAnyOf_selectSpan: {
        ...applySelectSpanStyles(),
    },
    formOneOfAnyOf_select: {
        ...applySelectInputStyles(),
    },
    formOneOfAnyOf_label: {
        ...applyLabelStyle(),
    },
};

export default styles;
