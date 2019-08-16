import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { DialogClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyAcrylicMaterial } from "../utilities/acrylic";
import { applyElevatedCornerRadius } from "../utilities/border";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";

/* tslint:disable-next-line */
const styles: ComponentStyles<DialogClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<DialogClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const backgroundColor: string = designSystem.backgroundColor;

    return {
        dialog: {
            display: "none",
            '&[aria-hidden="false"]': {
                display: "block",
            },
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
            ...applyAcrylicMaterial(backgroundColor, 0.6, 0.9, true),
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
};

export default styles;
