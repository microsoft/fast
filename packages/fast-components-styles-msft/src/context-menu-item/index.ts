import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import {
    backgroundColor,
    ensureForegroundNormal,
    hoverContrast,
} from "../utilities/colors";
import { contrast, scaleContrast } from "@microsoft/fast-jss-utilities";
import { applyType, TypeRamp } from "../utilities/typography";

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        listStyleType: "none",
        height: density(defaultHeight),
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        color: ensureForegroundNormal,
        whiteSpace: "nowrap",
        overflow: "hidden",
        cursor: "default",
        ...applyType("t7", "vp1"),
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
        "&:first-child": {
            borderRadius: "2px 2px 0 0",
        },
        "&:last-child": {
            borderRadius: "0 0 2px 2px",
        },
    },
};

export default styles;
