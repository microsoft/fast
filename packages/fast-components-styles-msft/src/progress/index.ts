import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ensureBrandNormal, largeContrast } from "../utilities/colors";
import { get } from "lodash-es";
import { toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<ProgressClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ProgressClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const brandColor: string = ensureBrandNormal(config);
    const backgroundColor: string = largeContrast(
        designSystem.contrast,
        designSystem.backgroundColor,
        brandColor
    );

    return {
        progress: {
            display: "flex",
            width: "100%",
            alignItems: "center",
            height: toPx(designSystem.designUnit),
            textAlign: "left",
        },
        progress_valueIndicator: {
            background: brandColor,
            borderRadius: "100px",
            height: "100%",
            "@media (-ms-high-contrast:active)": {
                background: "ButtonText",
            },
        },
        progress_indicator: {
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
            borderRadius: "100px",
            height: toPx(designSystem.designUnit),
            background: backgroundColor,
            maskImage: "-webkit-radial-gradient(white, black)",
        },
        progress_indicator__determinate: {
            height: toPx(designSystem.designUnit),
            borderRadius: "2px",

            "@media (-ms-high-contrast:active)": {
                background: "ButtonShadow",
            },
        },
        progress_indicator__indeterminate: {
            position: "absolute",
            opacity: "0",
            transform: "translateX(-100%)",
            width: "40%",
            height: "100%",
            backgroundColor: brandColor,
            borderRadius: "100px",
        },
        progress_indicator__indeterminate__1: {
            animation: "indeterminate-1 2s infinite",
            animationTimingFunction: "cubic-bezier(0.4, 0.0, 0.6, 1.0)",
        },
        progress_indicator__indeterminate__2: {
            animation: "indeterminate-2 2s infinite",
            animationTimingFunction: "cubic-bezier(0.4, 0.0, 0.6, 1.0)",
        },
        "@keyframes indeterminate-1": {
            "0%": {
                opacity: "1",
                transform: "translateX(-100%)",
            },
            "15%": {
                transform: "translateX(-100%)",
            },
            "50%": {
                opacity: "1",
                transform: "translateX(250%)",
            },
            "51%": {
                opacity: "0",
            },
            "100%": {
                opacity: "0",
            },
        },
        "@keyframes indeterminate-2": {
            "0%": {
                opacity: "0",
                transform: "translateX(-100%)",
            },
            "29%": {
                opacity: "0",
            },
            "30%": {
                opacity: "1",
            },
            "45%": {
                transform: "translateX(-100%)",
            },
            "90%": {
                transform: "translateX(250%)",
                opacity: "1",
            },
            "91%": {
                opacity: "0",
            },
            "100%": {
                transform: "translateX(-100%)",
                opacity: "0",
            },
        },
    };
};

export default styles;
