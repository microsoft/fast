import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { SubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

function applySubheadingStyles(): CSSRules<DesignSystem> {
    return {
        fontWeight: `${fontWeight.normal}`,
    };
}

const styles: ComponentStyles<SubheadingClassNameContract, DesignSystem> = {
    subheading: {
        "&$subheading__1": {
            ...applySubheadingStyles(),
        },
        "&$subheading__2": {
            ...applySubheadingStyles(),
        },
        "&$subheading__3": {
            ...applySubheadingStyles(),
        },
        "&$subheading__4": {
            ...applySubheadingStyles(),
        },
        "&$subheading__5": {
            ...applySubheadingStyles(),
        },
        "&$subheading__6": {
            ...applySubheadingStyles(),
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
