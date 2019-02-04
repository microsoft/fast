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
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
import typographyPattern from "../patterns/typography";
import { toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        listStyleType: "none",
        height: density(32),
        display: "grid",
        gridTemplateColumns: "32px auto 32px",
        gridTemplateRows: "auto",
        alignItems: "center",
        padding: "0",
        margin: "0 4px",
        ...typographyPattern.rest,
        whiteSpace: "nowrap",
        overflow: "hidden",
        cursor: "default",
        ...applyTypeRampConfig("t7"),
        background: backgroundColor,
        borderRadius: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return toPx(designSystem.cornerRadius);
        },
        border: "2px solid transparent",
        ...applyFocusVisible({
            borderColor: ensureForegroundNormal,
        }),
        "&:hover": {
            background: (config: DesignSystem): string => {
                const designSystem: DesignSystem = withDesignSystemDefaults(config);

                return hoverContrast(designSystem.contrast, designSystem.backgroundColor);
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
        ...typographyPattern.disabled,
        "&:hover": {
            background: backgroundColor,
        },
        ...applyFocusVisible({
            background: backgroundColor,
        }),
    },
};

export default styles;
