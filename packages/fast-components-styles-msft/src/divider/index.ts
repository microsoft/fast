import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { neutralOutlineRest } from "../utilities/color";
import { DividerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { format } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<DividerClassNameContract, DesignSystem> = {
    divider: {
        boxSizing: "content-box",
        height: "0",
        margin: "0",
        border: "none",
        borderTop: format<DesignSystem>("1px solid {0}", neutralOutlineRest),
        transition: "all 0.2s ease-in-out",
    },
};

export default styles;
