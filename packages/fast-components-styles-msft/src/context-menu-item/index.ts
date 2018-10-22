import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import { ensureForegroundNormal } from "../utilities/colors";
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
        background: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return contrast(
                scaleContrast(1.1, designSystem.contrast),
                designSystem.foregroundColor,
                designSystem.backgroundColor
            );
        },
        "&:focus": {
            outline: "none",
        },
        "&:focus, &:hover": {
            background: (config: DesignSystem): string => {
                const designSystem: DesignSystem = withDesignSystemDefaults(config);

                return contrast(
                    scaleContrast(1.3, designSystem.contrast),
                    designSystem.foregroundColor,
                    designSystem.backgroundColor
                );
            },
        },
    },
};

export default styles;
