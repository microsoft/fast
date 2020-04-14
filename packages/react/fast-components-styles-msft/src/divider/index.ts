import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DividerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { outlineWidth } from "../utilities/design-system";
import { neutralDividerRest } from "../utilities/color/neutral-divider";
import { highContrastBorderColor } from "../utilities/high-contrast";

const styles: ComponentStyles<DividerClassNameContract, DesignSystem> = {
    divider: {
        "box-sizing": "content-box",
        height: "0",
        margin: "0",
        border: "none",
        "border-top": format<DesignSystem>(
            "{0} solid {1}",
            toPx(outlineWidth),
            neutralDividerRest
        ),
        transition: "all 0.2s ease-in-out",
        ...highContrastBorderColor,
    },
};

export default styles;
