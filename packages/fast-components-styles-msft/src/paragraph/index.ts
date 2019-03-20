import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { ParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<ParagraphClassNameContract, DesignSystem> = {
    paragraph: {
        fontWeight: `${fontWeight.normal}`,
    },
    paragraph__1: {},
    paragraph__2: {},
    paragraph__3: {},
};

export default styles;
