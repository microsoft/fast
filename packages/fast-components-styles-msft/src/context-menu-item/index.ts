import {
    applyCornerRadius,
    applyDisabledState,
    applyFocusPlaceholderBorder,
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyFontSize, height, paddingNumber } from "../utilities/density";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFocus,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
} from "../utilities/color";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ContextMenuItemClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const padding: number =
        paddingNumber(-2)(designSystem) + 16 + paddingNumber()(designSystem);

    return {
        contextMenuItem: {
            listStyleType: "none",
            boxSizing: "border-box",
            height: height()(designSystem),
            display: "grid",
            gridTemplateColumns: `${toPx(padding)} auto ${toPx(padding)}`,
            gridTemplateRows: "auto",
            justifyItems: "center",
            alignItems: "center",
            padding: "0",
            margin: "0 4px",
            color: neutralForegroundRest,
            fill: neutralForegroundRest,
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "default",
            ...applyFontSize(designSystem),
            ...applyCornerRadius(designSystem),
            ...applyFocusPlaceholderBorder(designSystem),
            ...applyFocusVisible<DesignSystem>({
                borderColor: neutralFocus,
            }),
            "&:hover": {
                color: neutralForegroundHover,
                background: neutralFillStealthHover,
            },
            "&:active": {
                color: neutralForegroundActive,
                background: neutralFillStealthActive,
            },
        },
        contextMenuItem_contentRegion: {
            gridColumnStart: "2",
            justifySelf: "start",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
        contextMenuItem__disabled: {
            ...applyDisabledState(designSystem),
        },
    };
};

export default styles;
