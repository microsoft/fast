import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    applyLocalizedProperty,
    Direction,
    localizeSpacing,
} from "@microsoft/fast-jss-utilities";
import {
    applyMixedColor,
    ensureNormalContrast,
    hoverContrast,
    normalContrast,
} from "../utilities/colors";
import Chroma from "chroma-js";
import { CarouselClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

function flipperStyles(): CSSRules<{}> {
    return {
        position: "absolute",
        top: "calc(50% - 20px)",
    };
}

const styles: ComponentStyles<CarouselClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CarouselClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        carousel: {
            position: "relative",
        },
        carousel_tabs: {
            '& > [role="tablist"]': {
                position: "absolute",
                bottom: "8px",
                display: "block",
                padding: "0",
                textAlign: "center",
                width: "100%",
                zIndex: "100",
            },
        },
        carousel_tabsTabItem: {},
        carousel_tabsTabItemTab: {
            display: "inline-block",
            background: "transparent",
            border: "0",
            height: "10px",
            padding: "2px 3px",
            width: "10px",
            "&:focus": {
                outline: "none",
            },
            "&::before": {
                borderRadius: "50%",
                content: "''",
                display: "block",
                height: "100%",
                width: "100%",
            },
        },
        carousel_tabsTabItemTabPanel: {
            display: "none",
            '&[aria-hidden="false"]': {
                display: "block",
            },
        },
        carousel_tabsTabItemTabContent: {},
        carousel_tabsTabItemTabPanelContent: {},
        carousel_flipperPrevious: {
            ...flipperStyles(),
            [applyLocalizedProperty("left", "right", direction)]: "6px",
        },
        carousel_flipperNext: {
            ...flipperStyles(),
            [applyLocalizedProperty("right", "left", direction)]: "6px",
        },
        theme__dark: {
            "& $carousel_flipperPrevious, & $carousel_flipperNext": {
                color: "black",
                fill: "black",
                background: "white",
                "& span::before": {
                    borderColor: "black",
                },
                "&:hover": {
                    "& span::before": {
                        borderColor: hoverContrast(config.contrast, "black"),
                    },
                },
            },
            "& $carousel_tabsTabItemTab": {
                "&::before": {
                    border: "1px solid white",
                },
                "&:focus": {
                    "&::before": {
                        boxShadow: "0 0 0 1px white",
                    },
                },
                '&[aria-selected="true"]': {
                    "&::before": {
                        background: "white",
                    },
                },
            },
        },
        theme__light: {
            "& $carousel_flipperPrevious, & $carousel_flipperNext": {
                color: "white",
                fill: "white",
                background: "black",
                "& span::before": {
                    borderColor: "white",
                },
                "&:hover": {
                    "& span::before": {
                        borderColor: hoverContrast(config.contrast, "white"),
                    },
                },
            },
            "& $carousel_tabsTabItemTab": {
                "&::before": {
                    border: "1px solid black",
                },
                '&[aria-selected="true"]': {
                    "&::before": {
                        background: "black",
                    },
                    "&:focus": {
                        "&::before": {
                            boxShadow: "0 0 0 1px black",
                        },
                    },
                },
            },
        },
    };
};

export default styles;
