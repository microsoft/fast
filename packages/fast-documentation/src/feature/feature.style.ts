import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FeatureClassNameContract } from "./feature.props";
import { DesignSystem } from "../design-system/index";
import {
    applyCornerRadius,
    applyScaledTypeRamp,
    neutralFillRest,
    neutralForegroundRest,
    applyElevation,
    ElevationMultiplier
} from "@microsoft/fast-components-styles-msft";
import { format } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<FeatureClassNameContract, DesignSystem> = {
    feature: {
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "auto",
        ...applyCornerRadius(),
        overflow: "hidden",
        ...applyElevation(ElevationMultiplier.e4),
        "& $feature_contentContainer, $feature_content": {
            flex: "1",
            display: "flex",
            flexDirection: "column"
        },
        // Update from hard-coded instances
        "@media only screen and (min-width: 1083px)": {
            flexDirection: "row"
        }
    },
    feature_action: {},
    feature_badge: {
        ...applyScaledTypeRamp("t8"),
        letterSpacing: "4px",
        color: neutralForegroundRest,
        borderBottom: format<DesignSystem>("1px solid {0}", neutralFillRest),
        justifyContent: "flex-start",
        padding: "16px 20px",
        "@media only screen and (min-width: 1083px)": {
            padding: "16px 48px"
        }
    },
    feature_contentContainer: {
        justifyContent: "center",
        flex: "initial",
        "@media only screen and (min-width: 1083px)": {
            width: "25%"
        }
    },
    feature_content: {
        justifyContent: "flex-start",
        padding: "12px 20px",
        "@media only screen and (min-width: 1083px)": {
            padding: "12px 48px"
        },
        "& $feature_heading": {
            marginTop: "24px"
        },
        "& $feature_paragraph": {
            marginTop: "16px",
            marginBottom: "auto"
        },
        "& $feature_action": {
            margin: "16px 0",
            justifySelf: "flex-end"
        }
    },
    feature_heading: {},
    feature_image: {
        maxWidth: "100%",
        height: "auto",
        "@media only screen and (min-width: 1083px)": {
            width: "75%"
        }
    },
    feature_paragraph: {}
};

export default styles;
