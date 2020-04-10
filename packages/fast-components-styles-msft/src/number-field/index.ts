import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { directionSwitch, format } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
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
        "-moz-appearance": "textfield",
        "&::-webkit-inner-spin-button": {
            appearance: "none",
            "-webkit-appearance": "none",
        },
    },
};

export default styles;
