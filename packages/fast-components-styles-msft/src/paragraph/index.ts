import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

const styles: ComponentStyles<IParagraphClassNameContract, IDesignSystem> = {
    paragraph: {},
    paragraph_1: {
        fontWeight: `${fontWeight.semilight}`
    },
    paragraph_2: {
        fontWeight: `${fontWeight.normal}`
    },
    paragraph_3: {
        fontWeight: `${fontWeight.normal}`
    }
};

export default styles;
