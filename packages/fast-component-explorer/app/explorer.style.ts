import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    accentForegroundRest,
    applyCornerRadius,
    DesignSystem,
    neutralDividerRest,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralLayerL2,
    neutralLayerL3,
} from "@microsoft/fast-components-styles-msft";
import { format } from "@microsoft/fast-jss-utilities";

export interface ExplorerClassNameContract {
    explorer?: string;
    explorer_colorPicker?: string;
    explorer_devToolsPanel?: string;
    explorer_navigationPanel?: string;
    explorer_paneTitleContainer?: string;
    explorer_propertiesPanel?: string;
    explorer_toolbar?: string;
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
        background: neutralFillRest(neutralLayerL2),
        border: "none",
        width: "23px",
        height: "22px",
        ...applyCornerRadius(),
        "&:hover": {
            background: neutralFillHover(neutralLayerL2),
        },
        "&:active": {
            background: neutralFillActive(neutralLayerL2),
        },
        "&:focus": {
            outline: "none",
        },
    },
    explorer_devToolsPanel: {
        boxShadow:
            "0px 0.6px 1.8px rgba(0, 0, 0, 0.11) inset, 0px 3.2px 7.2px rgba(0, 0, 0, 0.13) inset",
        width: "100%",
        overflow: "auto",
        "& a": {
            color: accentForegroundRest(neutralLayerL2),
        },
    },
    explorer_navigationPanel: {
        overflowY: "auto",
        overflowX: "hidden",
        background: neutralLayerL3,
        boxShadow:
            "-0.6px 0px 1.8px rgba(0, 0, 0, 0.11) inset, -3.2px 0px 7.2px rgba(0, 0, 0, 0.13) inset",
    },
    explorer_paneTitleContainer: {
        height: "32px",
        display: "flex",
        boxSizing: "border-box",
        alignItems: "center",
        paddingLeft: "10px",
        borderBottom: format<DesignSystem>("1px solid {0}", neutralDividerRest),
    },
    explorer_propertiesPanel: {
        background: neutralLayerL3,
        boxShadow:
            "0.6px 0px 1.8px rgba(0, 0, 0, 0.11) inset, 3.2px 0px 7.2px rgba(0, 0, 0, 0.13) inset",
    },
    explorer_toolbar: {
        padding: "0 10px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        background: neutralLayerL2,
        justifyContent: "flex-end",
        boxShadow:
            "0px -0.6px 1.8px rgba(0, 0, 0, 0.11) inset, 0px -3.2px 7.2px rgba(0, 0, 0, 0.13) inset",
    },
    explorer_viewerRegion: {
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
