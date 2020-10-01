import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    highContrastForeground,
    neutralLayerL1,
    neutralLayerL3,
} from "@microsoft/fast-components-styles-msft";
import { PivotClassNameContract } from "@microsoft/fast-components-react-msft";

export const accent: string = "#FB356D";

export const scrollbarStyle: CSSRules<{}> = {
    "&::-webkit-scrollbar": {
        background: neutralLayerL1,
        width: "8px",
        height: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
        background: neutralLayerL3,
        borderRadius: "8px",
    },
};

export const pivotStyleSheetOverrides: ComponentStyles<
    PivotClassNameContract,
    DesignSystem
> = {
    pivot: {
        height: "100%",
        ...highContrastForeground,
    },
    pivot_tabList: {
        padding: "0 16px",
        height: "36px",
    },
    pivot_tabPanels: {
        padding: "0 24px",
        overflow: "auto",
        height: "calc(100% - 36px)",
        ...scrollbarStyle,
        "& a": {
            color: accent,
        },
    },
    pivot_tabPanel: {
        height: "100%",
    },
    pivot_tabContent: {
        ...highContrastForeground,
    },
};
