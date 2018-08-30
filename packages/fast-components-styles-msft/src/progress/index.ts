import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction, toPx } from "@microsoft/fast-jss-utilities";
import { IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Chroma from "chroma-js";
import { get } from "lodash";

/* tslint:disable-next-line */
const styles: ComponentStyles<IMSFTProgressClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IMSFTProgressClassNameContract, IDesignSystem> => {
    const backgroundColor: string = get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
    const brandColor: string = get(config, "brandColor") || designSystemDefaults.brandColor;
    const direction: Direction = get(config, "direction") || designSystemDefaults.direction;
    const foregroundColor: string = get(config, "foregroundColor") || designSystemDefaults.foregroundColor;

    return {
        progress: {
            display: "inline-block",
            width: "100%"
        },
        progress_indicator__determinate: {
            display: "flex",
            background: Chroma(foregroundColor).alpha(0.2).css(),
            height: "4px",
            borderRadius: "2px",
            width: "100%"
        },
        progress_indicator__determinate_bar: {
            display: "inline-block",
            background: brandColor,
            borderRadius: "2px",
            height: "100%"
        },
        progress_indicator__indeterminate: {
            position: "relative",
            display: "flex",
            alignItems: "center",
            height: "10px",
            width: "100%"
        },
        progress_dot__base: {
            position: "absolute",
            display: "inline-block",
            opacity: "0",
            width: "100%",
            height: "5px",
            borderRadius: "50%",
            animation: "dots 4s infinite",
            "&::after": {
                content: "''",
                position: "absolute",
                display: "inline-block",
                background: brandColor,
                width: "5px",
                height: "5px",
                borderRadius: "50%"
            }
        },
        progress_dot__1: {
            animationDelay: "0.25s",
            left: "-20px"
        },
        progress_dot__2: {
            animationDelay: "0.2s",
            left: "-10px"
        },
        progress_dot__3: {
            animationDelay: "0.15s",
            left: "0px"
        },
        progress_dot__4: {
            animationDelay: "0.1s",
            left: "10px"
        },
        progress_dot__5: {
            animationDelay: " 0.05s",
            left: "20px"
        },
        "@keyframes dots": {
            "0%": {},
            "20%": {
                transform: "translateX(0)",
                animationTimingFunction: "ease-out",
                opacity: "0",
            },
            "25%": {
                opacity: "1",
            },
            "35%": {
                transform: "translateX(45%)",
                animationTimingFunction: "linear",
            },
            "65%": {
                transform: "translateX(55%)",
                animationTimingFunction: "ease-out"
            },
            "75%": {
                opacity: "1",
            },
            "80%": {
                transform: "translateX(100%)",
                opacity: "0",
            },
            "100%": {
            }
        }
    };
};

export default styles;
