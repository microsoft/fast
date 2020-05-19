import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    neutralLayerFloating,
    neutralLayerL2,
} from "@microsoft/fast-components-styles-msft";

export interface ExplorerClassNameContract {
    explorer: string;
}

export function applyScrollbarStyle(): CSSRules<{}> {
    return {
        "&::-webkit-scrollbar": {
            background: neutralLayerL2,
            width: "8px",
            height: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
            background: neutralLayerFloating,
            borderRadius: "8px",
        },
    };
}

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
            ...applyScrollbarStyle(),
        },
    },
    explorer: {},
};

export default style;
