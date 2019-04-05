import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextAreaClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { height } from "../utilities/density";
import { inputFieldStyles } from "../patterns/input-field";
import { toPx } from "@microsoft/fast-jss-utilities";
import { designUnit } from "../utilities/design-system";

const styles: ComponentStyles<TextAreaClassNameContract, DesignSystem> = {
    textArea: {
        ...inputFieldStyles(),
        height: height(2),
        paddingTop: toPx<DesignSystem>(designUnit(1.5)),
        paddingBottom: toPx<DesignSystem>(designUnit(1.5)),
        maxWidth: "100%",
    },
};

export default styles;
