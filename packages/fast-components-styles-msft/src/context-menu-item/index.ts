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
import { contrast, focusVisible, scaleContrast } from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
import typographyPattern from "../patterns/typography";

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        listStyleType: "none",
        height: density(40),
        display: "grid",
        gridTemplateColumns: "38px auto 38px",
        gridTemplateRows: "auto",
        alignItems: "center",
        padding: "0",
        ...typographyPattern.rest,
        whiteSpace: "nowrap",
        overflow: "hidden",
        cursor: "default",
        ...applyTypeRampConfig("t7"),
        background: backgroundColor,
        border: "2px solid transparent",
        "&:focus": {
            outline: "none",
        },
        [`&${focusVisible()}`]: {
            borderColor: ensureForegroundNormal,
        },
        "&:hover": {
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
        ...typographyPattern.disabled,
        [`&:hover, &${focusVisible()}`]: {
            background: backgroundColor,
        },
    },
};

export default styles;
