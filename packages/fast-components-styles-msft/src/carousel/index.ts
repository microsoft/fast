import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction } from "@microsoft/fast-jss-utilities";
import { hoverContrast } from "../utilities/colors";
import { CarouselClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

const styles: ComponentStyles<CarouselClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CarouselClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    function flipperStyles(): CSSRules<{}> {
        return {
            position: "absolute",
            top: "calc(50% - 20px)",
        };
    }

    return {
        carousel: {
            position: "relative",
        },
        carousel_slides: {},
        carousel_sequenceIndicators: {
            position: "absolute",
            bottom: "8px",
            display: "block",
            padding: "0",
            textAlign: "center",
            width: "100%",
            zIndex: "100",
        },
        carousel_sequenceIndicator: {
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
        carousel_sequenceIndicator__active: {},
        carousel_tabPanel: {
            display: "block",
        },
        carousel_tabPanel__hidden: {
            display: "none",
        },
        carousel_tabPanels: {},
        carousel_tabPanelContent: {},
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
            "& $carousel_sequenceIndicator": {
                "&::before": {
                    border: "1px solid white",
                },
                "&:focus": {
                    "&::before": {
                        boxShadow: "0 0 0 1px white",
                    },
                },
            },
            "& $carousel_sequenceIndicator__active": {
                "&::before": {
                    background: "white",
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
            "& $carousel_sequenceIndicator": {
                "&::before": {
                    border: "1px solid black",
                },
                "&:focus": {
                    "&::before": {
                        boxShadow: "0 0 0 1px black",
                    },
                },
            },
            "& $carousel_sequenceIndicator__active": {
                "&::before": {
                    background: "black",
                },
            },
        },
    };
};

export default styles;
