import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { height } from "../utilities/density";
import { filledInputFieldStyles, inputFieldStyles } from "../patterns/input-field";

const styles: ComponentStyles<TextFieldClassNameContract, DesignSystem> = {
    textField: {
        ...inputFieldStyles(),
        height: height(),
    },
    textField__filled: {
        ...filledInputFieldStyles(),
    },
};

export default styles;
