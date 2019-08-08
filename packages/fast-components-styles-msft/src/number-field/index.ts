import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    Direction,
    directionSwitch,
    format,
    localizeSpacing,
    toPx,
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
        "@media (-ms-high-contrast:active)": {
            borderColor: "ButtonText",
        },
    },
};

export default styles;
