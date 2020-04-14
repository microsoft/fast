import { TextAreaClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { multiply, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { height } from "../utilities/density";
import { inputFieldStyles } from "../patterns/input-field";
import { designUnit } from "../utilities/design-system";

const styles: ComponentStyles<TextAreaClassNameContract, DesignSystem> = {
    textArea: {
        ...inputFieldStyles(),
        height: height(2),
        "padding-top": toPx(multiply(designUnit, 1.5)),
        "padding-bottom": toPx(multiply(designUnit, 1.5)),
        "max-width": "100%",
    },
};

export default styles;
