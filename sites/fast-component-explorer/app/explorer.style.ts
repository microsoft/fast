import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    neutralLayerL1,
    neutralLayerL3,
} from "@microsoft/fast-components-styles-msft";
import { PivotClassNameContract } from "@microsoft/fast-components-react-msft";

export interface ExplorerClassNameContract {
    explorer: string;
}

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
};

const style: ComponentStyles<ExplorerClassNameContract, DesignSystem> = {
    "@font-face": [
        {
            fontFamily: "SegoeUIVF",
            src:
                "url(https://res.cloudinary.com/fast-dna/raw/upload/v1558051831/SegoeUI-Roman-VF_web.ttf) format('truetype')",
            fontWeight: "1 1000",
        },
        {
            fontFamily: "Segoe UI",
            src:
                "url('//c.s-microsoft.com/static/fonts/segoe-ui/west-european/Normal/latest.woff2') format('woff2')",
        },
    ] as any,
    "@global": {
        "body, html": {
            fontFamily:
                "SegoeUIVF, Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            fontSize: "12px",
            padding: "0",
            margin: "0",
            overflowX: "hidden",
        },
    },
    explorer: {},
};

export default style;
