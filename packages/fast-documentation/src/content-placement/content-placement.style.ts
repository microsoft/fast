import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ContentPlacementClassNameContract } from "./content-placement.props";
import { DesignSystem } from "../design-system/index";
import { accentFillRest } from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ContentPlacementClassNameContract, DesignSystem> = {
    contentPlacement: {
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        marginTop: "24px"
    },
    contentPlacement_contentContainer: {
        flex: "1",
        order: "2",
        "& $contentPlacement_heading": {
            marginTop: "24px"
        },
        "& $contentPlacement_paragraph": {
            margin: "16px 0"
        }
    },
    contentPlacement_image: {
        order: "1",
        fill: accentFillRest,
        "& > img": {
            maxWidth: "100%"
        }
    },
    contentPlacement_action: {
        display: "inline-flex",
        flexDirection: "column"
    },
    contentPlacement_heading: {
        position: "relative"
    },
    contentPlacement_paragraph: {
        paddingRight: "25px"
    }
};

export default styles;
