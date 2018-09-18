import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<IParagraphClassNameContract, IDesignSystem> = {
    paragraph: {},
    paragraph__1: {
        fontWeight: `${fontWeight.semilight}`
    },
    paragraph__2: {
        fontWeight: `${fontWeight.normal}`
    },
    paragraph__3: {
        fontWeight: `${fontWeight.normal}`
    }
};

export default styles;
