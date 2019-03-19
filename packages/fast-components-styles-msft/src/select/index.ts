import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import {
    ButtonClassNameContract,
    SelectClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import {
    neutralFillStealthRest,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { toPx } from "@microsoft/fast-jss-utilities";

export const selectDisplayButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        width: "100%",
        padding: "0 10px",
    },
    button_contentRegion: {
        width: "100%",
        display: "inline-flex",
    },
};

const styles: ComponentStyles<SelectClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SelectClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        select: {
            minWidth: "276px",
            maxWidth: "374px",
        },

        select_toggleGlyph: {
            fill: neutralForegroundRest,
        },

        select__disabled: {
            opacity: ".3",
        },

        select_menu: {
            ...elevation(ElevationMultiplier.e11, designSystem.foregroundColor)(
                designSystem
            ),
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

        select__multiSelectable: {
            "& $select_menu": {
                position: "static",
                boxShadow: "none",
                border: "1px solid",
                borderColor: neutralOutlineRest,
            },
        },
        select_menu__open: {},
    };
};

export default styles;
