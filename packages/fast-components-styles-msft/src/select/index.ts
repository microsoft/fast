import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { toPx } from "@microsoft/fast-jss-utilities";
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
import { applyFloatingCornerRadius } from "../utilities/border";
import { format } from "../utilities/format";
import { designUnit } from "../utilities/design-system";

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
            background: neutralFillStealthRest,
            ...applyFloatingCornerRadius(),
            ...elevation(ElevationMultiplier.e11)(designSystem),
            zIndex: "1",
            position: "absolute",
            width: "100%",
            margin: "0",
            padding: format("{0} 0", toPx<DesignSystem>(designUnit)),
            maxWidth: "374px",
            minWidth: "276px",
            maxHeight: "328px",
            overflow: "auto",
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
