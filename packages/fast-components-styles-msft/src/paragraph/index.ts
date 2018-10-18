import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { ParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<ParagraphClassNameContract, DesignSystem> = {
    paragraph: {},
    paragraph__1: {
        fontWeight: `${fontWeight.semilight}`,
    },
    paragraph__2: {
        fontWeight: `${fontWeight.normal}`,
    },
    paragraph__3: {
        fontWeight: `${fontWeight.normal}`,
    },
};

export default styles;
