import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, ellipsis, format, toPx } from "@microsoft/fast-jss-utilities";
import { DataGridClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { applyScaledTypeRamp } from "../utilities/typography";
import { applyFontWeightSemiBold } from "../utilities/fonts";
import { height, horizontalSpacing } from "../utilities/density";
import { DesignSystem } from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { outlineWidth } from "../utilities/design-system";
import {
    highContrastForeground,
    highContrastOptOutProperty,
    highContrastOutlineFocus,
    highContrastSelector,
} from "../utilities/high-contrast";

const styles: ComponentStyles<DataGridClassNameContract, DesignSystem> = {
    dataGrid: {
        display: "flex",
        "flex-direction": "column",
        "justify-content": "flex-start",
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
        "& $dataGrid_header, $dataGrid_cell": {
            ...highContrastForeground,
        },
    },
    dataGrid__virtualized: {},
    dataGrid_header: {
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        height: height(),
        ...applyScaledTypeRamp("t7"),
        ...applyFontWeightSemiBold(),
        "border-bottom": format<DesignSystem>(
            "{0} solid {1}",
            toPx(outlineWidth),
            neutralOutlineRest
        ),
    },
    dataGrid_columnHeader: {
        height: "100%",
        "box-sizing": "border-box",
        overflow: "hidden",
        padding: format<DesignSystem>("0 {0}", horizontalSpacing(0)),
        ...ellipsis(),
        "line-height": height(),
    },
    dataGrid_scrollingPanel: {},
    dataGrid_scrollingPanel_items: {},
    dataGrid_scrollingPanel__scrollable: {},
    dataGrid_row: {
        padding: "1px 0",
        "box-sizing": "border-box",
        width: "100%",
        "border-bottom": format<DesignSystem>(
            "{0} solid {1}",
            toPx(outlineWidth),
            neutralOutlineRest
        ),
    },
    dataGrid_row__focusWithin: {},
    dataGrid_cell: {
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        "box-sizing": "border-box",
        overflow: "hidden",
        padding: format<DesignSystem>("0 {0}", horizontalSpacing(0)),
        ...ellipsis(),
        ...applyScaledTypeRamp("t7"),
        ...applyCornerRadius(),
        ...applyFocusPlaceholderBorder(),
        ...applyFocusVisible<DesignSystem>({
            "border-color": neutralFocus,
            ...highContrastOutlineFocus,
        }),
    },
};

export default styles;
