import { FlyoutClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { applyFloatingCornerRadius } from "../utilities/border";
import { backgroundColor } from "../utilities/design-system";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { highContrastBorder } from "../utilities/high-contrast";

const styles: ComponentStyles<FlyoutClassNameContract, DesignSystem> = {
    flyout_positioner: {
        display: "none",
        '&[aria-hidden="false"]': {
            display: "block",
        },
    },
    flyout_visual: {
        height: "100%",
        width: "100%",
        background: backgroundColor,
        ...applyFloatingCornerRadius(),
        ...applyElevation(ElevationMultiplier.e14),
        ...highContrastBorder,
    },
    flyout__top: {},
    flyout__bottom: {},
    flyout__left: {},
    flyout__right: {},
    flyout__horizontalInset: {},
    flyout__verticalInset: {},
};

export default styles;
