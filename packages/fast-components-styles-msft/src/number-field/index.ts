import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    Direction,
    directionSwitch,
    format,
    localizeSpacing,
} from "@microsoft/fast-jss-utilities";
import { height, horizontalSpacing } from "../utilities/density";
import { inputFieldStyles } from "../patterns/input-field";

const styles: ComponentStyles<NumberFieldClassNameContract, DesignSystem> = {
    numberField: {
        ...inputFieldStyles(),
        height: height(),
        padding: directionSwitch(
            format("0 6px 0 {0}", horizontalSpacing()),
            format("0 {0} 0 6px", horizontalSpacing())
        ),
    },
};

export default styles;
