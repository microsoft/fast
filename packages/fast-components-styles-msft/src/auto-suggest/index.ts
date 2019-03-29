import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { AutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { toPx } from "@microsoft/fast-jss-utilities";
import { applyFloatingCornerRadius } from "../utilities/border";
import { neutralFillStealthRest } from "../utilities/color";
import { heightNumber } from "../utilities/density";
import { elevation, ElevationMultiplier } from "../utilities/elevation";

const styles: ComponentStyles<AutoSuggestClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<AutoSuggestClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const visibleOptionCount: number = 10;

    return {
        autoSuggest: {
            minWidth: "276px",
            maxWidth: "374px",
        },

        autoSuggest_menu: {
            ...elevation(ElevationMultiplier.e11)(designSystem),
            background: neutralFillStealthRest,
            zIndex: "1",
            position: "absolute",
            width: "100%",
            margin: "0",

            padding: `${toPx(designSystem.designUnit)} 0`,
            marginTop: toPx(designSystem.designUnit),
            maxWidth: "374px",
            minWidth: "276px",

            maxHeight: `${toPx(
                heightNumber(visibleOptionCount)(designSystem) +
                    designSystem.designUnit * 2
            )}`,
            overflow: "auto",
            ...applyFloatingCornerRadius(),
        },

        autoSuggest__menuOpen: {},
    };
};

export default styles;
