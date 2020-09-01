import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { scrollbarStyle } from "./explorer.style";

export interface PreviewClassNameContract {
    preview: string;
    preview__transparent: string;
    preview_componentRegion: string;
}

const style: ComponentStyles<PreviewClassNameContract, DesignSystem> = {
    "@font-face": {
        fontFamily: "Segoe UI",
        src:
            "url('//c.s-microsoft.com/static/fonts/segoe-ui/west-european/Normal/latest.woff2') format('woff2')",
    },
    "@global": {
        "body, html": {
            fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            fontSize: "12px",
            margin: "0",
        },
    },
    preview: {
        boxSizing: "border-box",
        display: "flex",
        ...scrollbarStyle,
    },
    preview__transparent: {
        background:
            "linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white",
        "background-repeat": "repeat, repeat",
        "background-position": "0 0, 5px 5px",
        "transform-origin": "0 0 0",
        "background-origin": "padding-box, padding-box",
        "background-clip": "border-box, border-box",
        "background-size": "10px 10px, 10px 10px",
        "box-shadow": "none",
        "text-shadow": "none",
        "min-height": "100vh",
        transition: "none",
        transform: "scaleX(1) scaleY(1) scaleZ(1)",
    },
    preview_componentRegion: {
        padding: "12px",
        height: "calc(100vh - 24px)",
    },
};

export default style;
