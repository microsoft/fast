import { DesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DialogClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyElevatedCornerRadius } from "../utilities/border";
import { backgroundColor } from "../utilities/design-system";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { highContrastBorder } from "../utilities/high-contrast";

const styles: ComponentStyles<DialogClassNameContract, DesignSystem> = {
    dialog: {
        display: "none",
        '&[aria-hidden="false"]': {
            display: "block",
        },
        ...highContrastBorder,
    },
    dialog_positioningRegion: {
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        overflow: "auto",
    },
    dialog_modalOverlay: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "rgba(0, 0, 0, 0.3)",
    },
    dialog_contentRegion: {
        marginTop: "auto",
        marginBottom: "auto",
        background: backgroundColor,
        ...applyElevatedCornerRadius(),
        ...applyElevation(ElevationMultiplier.e14),
        zIndex: "1",
    },
};

export default styles;
