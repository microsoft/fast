import {
    ComponentStyles,
    CSSRules,
    ManagedClasses,
} from "@microsoft/fast-jss-manager-react";
import {
    applyCornerRadius,
    DesignSystem,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralLayerFloating,
    neutralLayerL2,
    neutralLayerL3,
} from "@microsoft/fast-components-styles-msft";

export function applyScrollbarStyle(): CSSRules<{}> {
    return {
        "&::-webkit-scrollbar": {
            background: (config: DesignSystem): string => {
                return neutralLayerL2(config);
            },
            width: "8px",
            height: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
            background: (config: DesignSystem): string => {
                return neutralLayerFloating(config);
            },
            borderRadius: "8px",
        },
    };
}

export interface CreatorClassNameContract {
    creator?: string;
    creator_uploadInput?: string;
    creator_colorPicker?: string;
    creator_devToolsPanel?: string;
    creator_navigationPanel?: string;
    creator_navigationPanelRegion?: string;
    creator_navigationPanelContent?: string;
    creator_paneTitleContainer?: string;
    creator_propertiesPanel?: string;
    creator_toolbar?: string;
    creator_viewerControlRegion?: string;
    creator_viewerPanel?: string;
}

const style: ComponentStyles<CreatorClassNameContract, DesignSystem> = {
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
        },
    },
    creator: {},
    creator_uploadInput: {
        position: "absolute",
        width: "20px",
        overflow: "hidden",
        opacity: "0",
    },
    creator_colorPicker: {
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
    creator_devToolsPanel: {
        width: "100%",
        boxShadow:
            "0px 0.6px 1.8px rgba(0, 0, 0, 0.11) inset, 0px 3.2px 7.2px rgba(0, 0, 0, 0.13) inset",
    },
    creator_navigationPanel: {
        overflowY: "auto",
        overflowX: "hidden",
        background: neutralLayerL3,
        boxShadow:
            "-0.6px 0px 1.8px rgba(0, 0, 0, 0.11) inset, -3.2px 0px 7.2px rgba(0, 0, 0, 0.13) inset",
    },
    creator_navigationPanelRegion: {
        height: "calc(100% - 39px)",
    },
    creator_navigationPanelContent: {
        height: "calc(100% - 32px)",
        overflow: "auto",
        ...applyScrollbarStyle(),
    },
    creator_paneTitleContainer: {
        height: "32px",
        display: "flex",
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "10px",
    },
    creator_propertiesPanel: {
        background: neutralLayerL3,
        boxShadow:
            "0.6px 0px 1.8px rgba(0, 0, 0, 0.11) inset, 3.2px 0px 7.2px rgba(0, 0, 0, 0.13) inset",
        overflow: "auto",
        ...applyScrollbarStyle(),
    },
    creator_viewerPanel: {
        width: "100%",
        height: "calc(100% - 32px)",
        overflow: "auto",
        ...applyScrollbarStyle(),
    },
    creator_viewerControlRegion: {
        display: "flex",
        alignItems: "center",
    },
    creator_toolbar: {
        padding: "0 8px",
        height: "32px",
        display: "flex",
        verticalAlign: "middle",
        alignItems: "center",
        background: neutralLayerL2,
        boxShadow:
            "0px -0.6px 1.8px rgba(0, 0, 0, 0.11) inset, 0px -3.2px 7.2px rgba(0, 0, 0, 0.13) inset",
    },
};

export default style;
