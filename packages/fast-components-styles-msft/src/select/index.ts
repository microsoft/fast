import { DesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import {
    ButtonClassNameContract,
    SelectClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import {
    neutralFillStealthRest,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { applyFloatingCornerRadius } from "../utilities/border";
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

const styles: ComponentStyles<SelectClassNameContract, DesignSystem> = {
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
        ...applyElevation(ElevationMultiplier.e11),
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

export default styles;
