import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { DialogClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import Chroma from "chroma-js";
import { applyAcrylicMaterial } from "../utilities/acrylic";
import { elevation, ElevationMultiplier } from "../utilities/elevation";

/* tslint:disable-next-line */
const styles: ComponentStyles<DialogClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<DialogClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const backgroundColor: string = designSystem.backgroundColor;
    const foregroundColor: string = designSystem.foregroundColor;

    return {
        dialog: {
            display: "none",
            '&[aria-hidden="false"]': {
                display: "block",
            },
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
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: backgroundColor,
            ...elevation(ElevationMultiplier.e14, foregroundColor)(designSystem),
        },
    };
};

export default styles;
