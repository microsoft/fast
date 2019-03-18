import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { ParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

function applyParagraphStyles(): CSSRules<DesignSystem> {
    return {
        fontWeight: `${fontWeight.normal}`,
    };
}

const styles: ComponentStyles<ParagraphClassNameContract, DesignSystem> = {
    paragraph: {
        "&$paragraph__1": {
            ...applyParagraphStyles(),
        },
        "&$paragraph__2": {
            ...applyParagraphStyles(),
        },
        "&$paragraph__3": {
            ...applyParagraphStyles(),
        },
    },
    paragraph__1: {},
    paragraph__2: {},
    paragraph__3: {},
};

export default styles;
