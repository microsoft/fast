import { ButtonBaseClassNameContract as JustifiedButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import lightweightButtonStyles from "../lightweight-button";

const styles: ComponentStyles<JustifiedButtonClassNameContract, DesignSystem> = {
    ...lightweightButtonStyles,
    button: {
        paddingLeft: "0",
        paddingRight: "0",
        borderWidth: "0",
        justifyContent: "flex-start",
    },
};

export default styles;
