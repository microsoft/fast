import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { HeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { fontWeight } from "../utilities/fonts";

function applyHeadingStyles(): CSSRules<DesignSystem> {
    return {
        fontWeight: `${fontWeight.semibold}`,
    };
}

/**
 * TODO #306: Pull font weight styles when we have an API for font/variable font properties
 */
const styles: ComponentStyles<HeadingClassNameContract, DesignSystem> = {
    heading: {
        "&$heading__1": {
            ...applyHeadingStyles(),
        },
        "&$heading__2": {
            ...applyHeadingStyles(),
        },
        "&$heading__3": {
            ...applyHeadingStyles(),
        },
        "&$heading__4": {
            ...applyHeadingStyles(),
        },
        "&$heading__5": {
            ...applyHeadingStyles(),
        },
        "&$heading__6": {
            ...applyHeadingStyles(),
        },
    },
    heading__1: {},
    heading__2: {},
    heading__3: {},
    heading__4: {},
    heading__5: {},
    heading__6: {},
};

export default styles;
