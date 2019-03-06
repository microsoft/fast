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
    const white: string = "white";
    const darkGray: string = "#101010";
    const lightGray: string = "rgb(206, 206, 206)";
    const lightGrayRest: string = "rgba(206, 206, 206, 0.6)";

    function flipperStyles(): CSSRules<{}> {
        return {
            position: "absolute",
            top: "calc(50% - 20px)",
            zIndex: "100",
            display: "block",
            opacity: "0",
            transition: "all 0.2s ease-in-out",
        };
    }

    return {
        carousel: {
            position: "relative",
            display: "inline-block",
            "&:hover": {
                "& $carousel_flipperPrevious, & $carousel_flipperNext": {
                    opacity: "1",
                },
            },
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
            "& > :first-child:nth-last-child(1)": {
                display: "none",
            },
        },
        carousel_sequenceIndicator: {
            display: "inline-block",
            padding: "0 2px",
            "&:focus": {
                outline: "none",
            },
            "&::before": {
                opacity: "0.2",
                border: "1px solid transparent",
                borderRadius: "40px",
                content: "''",
                display: "block",
                height: "4px",
                width: "32px",
                transition: "all 0.05s ease-in-out",
            },
            "&:not($carousel_sequenceIndicator__active)": {
                "&:hover": {
                    "&::before": {
                        opacity: "0.5",
                    },
                },
            },
        },
        carousel_sequenceIndicator__active: {
            "&::before": {
                opacity: "1",
            },
        },
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
        carousel__themeDark: {
            "& $carousel_flipperPrevious, & $carousel_flipperNext": {
                color: darkGray,
                fill: darkGray,
                background: "rgba(255, 255, 255, 0.6)",
                border: `1px solid ${lightGrayRest}`,
                "& span::before": {
                    borderColor: darkGray,
                },
                "&:hover": {
                    background: white,
                    "& span::before": {
                        borderColor: hoverContrast(config.contrast, darkGray),
                    },
                },
            },
            "& $carousel_sequenceIndicator": {
                "&::before": {
                    background: white,
                    borderColor: lightGray,
                },
                "&$carousel_sequenceIndicator__active": {
                    "&::before": {
                        background: white,
                    },
                },
            },
        },
        carousel__themeLight: {
            "& $carousel_flipperPrevious, & $carousel_flipperNext": {
                color: white,
                fill: white,
                background: "rgba(0, 0, 0, 0.6)",
                border: `1px solid ${lightGrayRest}`,
                "& span::before": {
                    borderColor: white,
                },
                "&:hover": {
                    background: darkGray,
                    "& span::before": {
                        borderColor: hoverContrast(config.contrast, white),
                    },
                },
            },
            "& $carousel_sequenceIndicator": {
                "&::before": {
                    background: darkGray,
                    borderColor: lightGray,
                },
            },
            "& $carousel_sequenceIndicator__active": {
                "&::before": {
                    background: darkGray,
                },
            },
        },
        carousel__slideAnimatePrevious: {},
        carousel__slideAnimateNext: {},
    };
};

export default styles;
