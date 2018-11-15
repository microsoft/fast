import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<TextActionClassNameContract, DesignSystem> = {
    textAction: {
        display: "block",
    },
};

export default styles;
