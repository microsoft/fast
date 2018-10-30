import { DesignSystem } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { HeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyBreakpoint, breakpoints } from "../utilities/breakpoints";

function applyHeadingStyles(): CSSRules<DesignSystem> {
    return {
        fontWeight: "700",
    };
}
/**
 * TODO #306: Pull font weight styles when we have an API for font/variable font properties
 */
const styles: ComponentStyles<HeadingClassNameContract, DesignSystem> = {
    heading: {},
    heading__1: {
        ...applyHeadingStyles(),
    },
    heading__2: {
        ...applyHeadingStyles(),
    },
    heading__3: {
        ...applyHeadingStyles(),
    },
    heading__4: {
        ...applyHeadingStyles(),
    },
    heading__5: {
        ...applyHeadingStyles(),
    },
    heading__6: {
        ...applyHeadingStyles(),
    },
};

export default styles;
