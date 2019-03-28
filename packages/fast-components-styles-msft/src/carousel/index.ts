import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction, toPx } from "@microsoft/fast-jss-utilities";
import {
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { CarouselClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

const styles: ComponentStyles<CarouselClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CarouselClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const white: string = "#FFF";
    const black: string = "#101010";

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
                opacity: "0.45",
                border: "1px solid transparent",
                borderRadius: "40px",
                content: "''",
                display: "block",
                height: toPx(designSystem.designUnit),
                width: "32px",
                transition: "all 0.05s ease-in-out",
            },
            "&:not($carousel_sequenceIndicator__active)": {
                "&:hover": {
                    "&::before": {
                        opacity: "0.9",
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
                "&::before": {
                    color: neutralForegroundRest((): string => black),
                    fill: neutralForegroundRest((): string => black),
                    background: neutralFillStealthRest((): string => black),
                    border: `${toPx(
                        designSystem.outlineWidth
                    )} solid ${neutralOutlineRest((): string => black)}`,
                },
                "& span::before": {
                    borderColor: neutralForegroundRest((): string => black),
                },
                "&:hover": {
                    "&::before": {
                        background: neutralFillStealthHover((): string => black),
                    },
                    "& span::before": {
                        borderColor: neutralForegroundRest((): string => black),
                    },
                },
            },
            "& $carousel_sequenceIndicator": {
                "&::before": {
                    background: neutralFillStealthRest((): string => black),
                    borderColor: neutralOutlineRest((): string => black),
                },
                "&$carousel_sequenceIndicator__active": {
                    "&::before": {
                        background: neutralFillStealthRest((): string => black),
                    },
                },
            },
        },
        carousel__themeLight: {
            "& $carousel_flipperPrevious, & $carousel_flipperNext": {
                "&::before": {
                    color: neutralForegroundRest((): string => white),
                    fill: neutralForegroundRest((): string => white),
                    background: neutralFillStealthRest((): string => white),
                    border: `${toPx(
                        designSystem.outlineWidth
                    )} solid ${neutralOutlineRest((): string => white)}`,
                },
                "& span::before": {
                    borderColor: neutralForegroundRest((): string => white),
                },
                "&:hover": {
                    "&::before": {
                        background: neutralFillStealthHover((): string => white),
                    },
                    "& span::before": {
                        borderColor: neutralForegroundRest((): string => white),
                    },
                },
            },
            "& $carousel_sequenceIndicator": {
                "&::before": {
                    background: neutralFillStealthRest((): string => white),
                    borderColor: neutralOutlineRest((): string => white),
                },
                "&$carousel_sequenceIndicator__active": {
                    "&::before": {
                        background: neutralFillStealthRest((): string => white),
                    },
                },
            },
        },
        carousel__slideAnimatePrevious: {},
        carousel__slideAnimateNext: {},
    };
};

export default styles;
