import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import { ensureForegroundNormal } from "../utilities/colors";

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        listStyleType: "none",
        height: density(defaultHeight),
        display: "flex",
        alignItems: "center",
        color: ensureForegroundNormal,
        padding: "0 12px",
        background: "red",
        "&:focus": {
            background: "blue",
        },
    },
};

export default styles;
