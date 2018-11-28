import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import {
    backgroundColor,
    disabledContrast,
    ensureForegroundNormal,
    hoverContrast,
} from "../utilities/colors";
import { contrast, scaleContrast } from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        listStyleType: "none",
        height: density(40),
        display: "grid",
        gridTemplateColumns: "40px auto 40px",
        gridTemplateRows: "auto",
        alignItems: "center",
        padding: "0",
        color: ensureForegroundNormal,
        whiteSpace: "nowrap",
        overflow: "hidden",
        cursor: "default",
        ...applyTypeRampConfig("t7"),
        background: backgroundColor,
        "&:focus": {
            outline: "none",
        },
        "&:focus, &:hover": {
            background: (config: DesignSystem): string => {
                const designSystem: DesignSystem = withDesignSystemDefaults(config);

                return hoverContrast(
                    designSystem.contrast,
                    designSystem.backgroundColor,
                    designSystem.foregroundColor
                );
            },
        },
    },
    contextMenuItem_contentRegion: {
        gridColumnStart: "2",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    contextMenuItem__disabled: {
        cursor: "not-allowed",
        color: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return disabledContrast(
                designSystem.contrast,
                designSystem.foregroundColor,
                designSystem.backgroundColor
            );
        },
        "&:hover, &:focus": {
            background: backgroundColor,
        },
    },
};

export default styles;
