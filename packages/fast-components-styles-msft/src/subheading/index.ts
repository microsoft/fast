import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { SubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

function applySubeadingStyles(): CSSRules<DesignSystem> {
    return {
        fontWeight: `${fontWeight.normal}`,
    };
}

const styles: ComponentStyles<SubheadingClassNameContract, DesignSystem> = {
    subheading: {
        "&$subheading__1": {
            ...applySubeadingStyles(),
        },
        "&$subheading__2": {
            ...applySubeadingStyles(),
        },
        "&$subheading__3": {
            ...applySubeadingStyles(),
        },
        "&$subheading__4": {
            ...applySubeadingStyles(),
        },
        "&$subheading__5": {
            ...applySubeadingStyles(),
        },
        "&$subheading__6": {
            ...applySubeadingStyles(),
        },
    },
    subheading__1: {},
    subheading__2: {},
    subheading__3: {},
    subheading__4: {},
    subheading__5: {},
    subheading__6: {},
};

export default styles;
