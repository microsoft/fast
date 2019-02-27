import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { density } from "../utilities/density";
import { neutralForegroundRest, neutralFillStealthHover } from "../utilities/color";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
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
        color: neutralForegroundRest,
        whiteSpace: "nowrap",
        overflow: "hidden",
        cursor: "default",
        ...applyTypeRampConfig("t7"),
        borderRadius: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return toPx(designSystem.cornerRadius);
        },
        border: "2px solid transparent",
        ...applyFocusVisible({
            borderColor: (config: DesignSystem): string => {
                const designSystem: DesignSystem = withDesignSystemDefaults(config);
                return designSystem.foregroundColor;
            },
        }),
        "&:hover": {
            background: neutralFillStealthHover,
        },
    },
    contextMenuItem_contentRegion: {
        gridColumnStart: "2",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    contextMenuItem__disabled: {
        cursor: "not-allowed",
        opacity: "0.3",
    },
};

export default styles;
