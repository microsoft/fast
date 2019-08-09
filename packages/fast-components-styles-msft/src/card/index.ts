import { DesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { CardClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyElevatedCornerRadius } from "../utilities/border";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { backgroundColor } from "../utilities/design-system";

const styles: ComponentStyles<CardClassNameContract, DesignSystem> = {
    card: {
        width: "100%",
        height: "100%",
        background: backgroundColor,
        ...applyElevatedCornerRadius(),
        ...applyElevation(ElevationMultiplier.e4),
        transition: "all 0.2s ease-in-out",
        "@media (-ms-high-contrast:active)": {
            border: "1px solid WindowText",
        },
    },
};

export default styles;
