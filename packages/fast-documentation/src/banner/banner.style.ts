import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { BannerClassNameContract } from "./banner.props";
import { DesignSystem } from "../design-system/index";
import {
    applyCursorPointer,
    neutralFocus,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest
} from "@microsoft/fast-components-styles-msft";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { ButtonClassNameContract } from "@microsoft/fast-components-react-base";

const styles: ComponentStyles<BannerClassNameContract, DesignSystem> = {
    banner: {
        position: "relative",
        boxSizing: "border-box",
        marginTop: "30px",
        ...applyCursorPointer()
    },
    banner_contentRegion: {
        display: "grid",
        gridTemplateRows: "repeat(3, 1fr)",
        boxSizing: "border-box",
        maxWidth: "calc(1600px + 10%)",
        padding: "16px 5%",
        margin: "0 auto",
        height: "294px",
        alignItems: "center",
        "@media only screen and (min-width: 768px)": {
            height: "150px",
            gridTemplateColumns: "1fr 1fr .5fr",
            gridTemplateRows: "1fr"
        },
        "@media only screen and (min-width: 1084px)": {
            height: "150px",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "1fr"
        }
    },
    banner_title: {
        margin: "0",
        textDecoration: "none"
    },
    banner_abstract: {
        margin: "0"
    },
    banner_action: {
        "&:after": {
            content: "''",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0"
        }
    }
};

export const buttonStyles: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
    button: {
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        textDecoration: "none",
        width: "60px",
        background: "transparent",
        border: "none",
        justifySelf: "end",
        "&:hover": {
            color: neutralForegroundHover,
            fill: neutralForegroundHover
        },
        "&:active": {
            fill: neutralForegroundActive,
            color: neutralForegroundActive
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus
        }),
        "& svg": {}
    }
};

export default styles;
