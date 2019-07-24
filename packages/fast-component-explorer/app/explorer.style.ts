import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyCornerRadius,
    DesignSystem,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
} from "@microsoft/fast-components-styles-msft";

export interface ExplorerClassNameContract {
    explorer?: string;
    explorer_colorPicker?: string;
    explorer_viewerRegion?: string;
    explorer_viewerControlRegion?: string;
    explorer_viewerControls?: string;
}

const style: ComponentStyles<ExplorerClassNameContract, DesignSystem> = {
    "@font-face": {
        fontFamily: "Segoe UI",
        src:
            "url('//c.s-microsoft.com/static/fonts/segoe-ui/west-european/Normal/latest.woff2') format('woff2')",
    },
    "@global": {
        "body, html": {
            fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            fontSize: "12px",
            padding: "0",
            margin: "0",
        },
    },
    explorer: {},
    explorer_colorPicker: {
        background: neutralFillRest(() => "#3B3B3B"),
        border: "none",
        width: "23px",
        ...applyCornerRadius(),
        "&:hover": {
            background: neutralFillHover(() => "#3B3B3B"),
        },
        "&:active": {
            background: neutralFillActive(() => "#3B3B3B"),
        },
        "&:focus": {
            outline: "none",
        },
    },
    explorer_viewerRegion: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    explorer_viewerControlRegion: {
        display: "flex",
        alignItems: "center",
    },
    explorer_viewerControls: {
        display: "flex",
        padding: "7px 10px",
        marginLeft: "auto",
        alignItems: "center",
    },
};

export default style;
