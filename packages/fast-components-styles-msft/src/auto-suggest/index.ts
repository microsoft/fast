import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { AutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import { toPx } from "@microsoft/fast-jss-utilities";
import { neutralFillStealthRest } from "../utilities/color";
import { curry } from "lodash-es";

const styles: ComponentStyles<AutoSuggestClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<AutoSuggestClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

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

            padding: "4px 0",
            maxWidth: "374px",
            minWidth: "276px",

            maxHeight: "328px",
            overflow: "auto",
            borderRadius: toPx(designSystem.cornerRadius * 2),
        },

        autoSuggest__menuOpen: {},
    };
};

export default styles;
