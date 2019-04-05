import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { height } from "../utilities/density";
import { inputFieldStyles } from "../patterns/input-field";

const styles: ComponentStyles<TextFieldClassNameContract, DesignSystem> = {
    textField: {
        ...inputFieldStyles(),
        height: height(),
    },
};

export default styles;
