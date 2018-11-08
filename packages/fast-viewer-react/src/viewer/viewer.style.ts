import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
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
            background: "#E3E3E3",
            minWidth: "100%",
            minHeight: "100%",
        },
        viewer_contentRegion: {
            position: "relative",
            background: "#FFF",
            margin: "0 auto",
            height: "100%",
            boxShadow:
                "0px 9.6px 21.6px rgba(0,0,0,0.22), 0px 1.8px 5.4px rgba(0,0,0,0.18)",
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
            borderBottom: `1px solid ${backgroundColor}`,
            border: "none",
        },
        handle__bottomLeft: {
            cursor: "nesw-resize",
            bottom: "-1px",
            left: "-1px",
            height: `${fixedSize + 1}px`,
            width: `${fixedSize + 1}px`,
            border: "none",
            borderLeft: `1px solid ${backgroundColor}`,
            borderBottom: `1px solid ${backgroundColor}`,
            "&::before, &::after": {
                content: "''",
                position: "absolute",
                background: backgroundColor,
                transform: "rotate(-45deg)",
            },
            "&::before": {
                left: "4px",
                bottom: "0",
                height: "10px",
                width: "1px",
            },
            "&::after": {
                left: "2px",
                bottom: "0",
                height: "5px",
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
            borderRight: `1px solid ${backgroundColor}`,
            borderBottom: `1px solid ${backgroundColor}`,
            "&::before, &::after": {
                content: "''",
                position: "absolute",
                background: backgroundColor,
                transform: "rotate(45deg)",
            },
            "&::before": {
                right: "4px",
                bottom: "0",
                height: "10px",
                width: "1px",
            },
            "&::after": {
                right: "2px",
                bottom: "0",
                height: "5px",
                width: "1px",
            },
        },
        handle__left: {
            cursor: "ew-resize",
            left: "-1px",
            top: "0",
            height: `calc(100% - ${fixedSize}px)`,
            width: "0",
            borderLeft: `1px solid ${backgroundColor}`,
            border: "none",
        },
        handle__right: {
            cursor: "ew-resize",
            top: "0",
            right: "-1px",
            height: `calc(100% - ${fixedSize}px)`,
            width: "0",
            borderRight: `1px solid ${backgroundColor}`,
            border: "none",
        },
    };
};

export default styles;
