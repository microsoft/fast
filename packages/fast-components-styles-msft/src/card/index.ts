import {
    applyCornerRadius,
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { CardClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { elevation, ElevationMultiplier } from "../utilities/elevation";

const styles: ComponentStyles<CardClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CardClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        card: {
            width: "100%",
            height: "100%",
            background: designSystem.backgroundColor,
            ...applyCornerRadius(designSystem),
            ...elevation(ElevationMultiplier.e4)(designSystem),
            transition: "all 0.2s ease-in-out",
        },
    };
};

export default styles;
