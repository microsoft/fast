import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager-react";
import { ViewerClassNameContract } from "./viewer.class-name-contract";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<
    ViewerClassNameContract,
    {}
> = (config: {}): ComponentStyleSheet<ViewerClassNameContract, {}> => {
    const fixedSize: number = 20;
    const backgroundColor: string = "#999";

    return {
        viewer: {
            display: "flex",
            minWidth: "100%",
            minHeight: "100%",
        },
        viewer_contentRegion: {
            position: "relative",
            background: "#FFF",
            borderRadius: "4px",
            margin: "0 auto",
            height: "100%",
            boxShadow: "0 0 22px rgba(0,0,0,0.22), 0 2px 5px rgba(0,0,0,0.18)",
        },
        viewer_iframe: {
            borderRadius: "4px",
            border: "none",
            width: "100%",
            height: "100%",
        },
        viewer_contentRegion__disabled: {
            "&::before": {
                content: "''",
                background: "transparent",
                position: "absolute",
                left: "0",
                right: "0",
                bottom: "0",
                top: "0",
            },
        },
        handle: {
            position: "absolute",
            background: "transparent",
            borderRadius: "0",
            padding: "0",
            "&:focus": {
                outline: "none",
            },
        },
        handle__bottom: {
            cursor: "ns-resize",
            bottom: "-1px",
            left: `${fixedSize}px`,
            width: `calc(100% - ${fixedSize * 2}px)`,
            height: "0",
            border: "none",
        },
        handle__bottomLeft: {
            cursor: "nesw-resize",
            bottom: "-1px",
            left: "-1px",
            height: `${fixedSize + 1}px`,
            width: `${fixedSize + 1}px`,
            border: "none",
            "&::before, &::after": {
                content: "''",
                position: "absolute",
                background: backgroundColor,
                transform: "rotate(-45deg)",
            },
            "&::before": {
                left: "6px",
                bottom: "1px",
                height: "10px",
                width: "1px",
            },
            "&::after": {
                left: "4px",
                bottom: "2px",
                height: "4px",
                width: "1px",
            },
        },
        handle__bottomRight: {
            cursor: "nwse-resize",
            bottom: "-1px",
            right: "-1px",
            height: `${fixedSize + 1}px`,
            width: `${fixedSize + 1}px`,
            border: "none",
            "&::before, &::after": {
                content: "''",
                position: "absolute",
                background: backgroundColor,
                transform: "rotate(45deg)",
            },
            "&::before": {
                right: "6px",
                bottom: "1px",
                height: "10px",
                width: "1px",
            },
            "&::after": {
                right: "4px",
                bottom: "2px",
                height: "4px",
                width: "1px",
            },
        },
        handle__left: {
            cursor: "ew-resize",
            left: "-1px",
            top: "0",
            height: `calc(100% - ${fixedSize}px)`,
            width: "0",
            border: "none",
        },
        handle__right: {
            cursor: "ew-resize",
            top: "0",
            right: "-1px",
            height: `calc(100% - ${fixedSize}px)`,
            width: "0",
            border: "none",
        },
    };
};

export default styles;
