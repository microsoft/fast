import { DesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DividerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { outlineWidth } from "../utilities/design-system";
import { neutralDividerRest } from "../utilities/color/neutral-divider";

const styles: ComponentStyles<DividerClassNameContract, DesignSystem> = {
    divider: {
        boxSizing: "content-box",
        height: "0",
        margin: "0",
        border: "none",
        borderTop: format<DesignSystem>(
            "{0} solid {1}",
            toPx(outlineWidth),
            neutralDividerRest
        ),
        transition: "all 0.2s ease-in-out",
    },
};

export default styles;
