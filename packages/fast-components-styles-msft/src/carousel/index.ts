import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { CarouselClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { designUnit, focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import {
    highContrastButtonColorIndicator,
    HighContrastColor,
    highContrastColorBackground,
    highContrastForeground,
    highContrastHighlightColorIndicator,
    highContrastOptOutProperty,
    highContrastSelector,
} from "../utilities/high-contrast";

const white: string = "#FFF";
const black: string = "#101010";
const themeDarkNeutralForegroundRest: DesignSystemResolver<string> = neutralForegroundRest(
    (): string => black
);
const themeLightNeutralForegroundRest: DesignSystemResolver<string> = neutralForegroundRest(
    (): string => white
);
const themeDarkNeutralFillStealthRest: DesignSystemResolver<string> = neutralFillStealthRest(
    (): string => black
);
const themeLightNeutralFillStealthRest: DesignSystemResolver<string> = neutralFillStealthRest(
    (): string => white
);

const themeDarkNeutralOutlineRest: DesignSystemResolver<string> = neutralOutlineRest(
    (): string => black
);
const themeLightNeutralOutlineRest: DesignSystemResolver<string> = neutralOutlineRest(
    (): string => white
);

const themeDarkNeutralFocus: DesignSystemResolver<string> = neutralFocus(
    (): string => black
);
const themeLightNeutralFocus: DesignSystemResolver<string> = neutralFocus(
    (): string => white
);

function flipperStyles(): CSSRules<{}> {
    return {
        position: "absolute",
        top: "calc(50% - 20px)",
        "z-index": "100",
        opacity: "0",
        transition: "all 0.2s ease-in-out",
    };
}
const styles: ComponentStyles<CarouselClassNameContract, DesignSystem> = {
    carousel: {
        position: "relative",
        display: "inline-block",
        "&:hover": {
            "& $carousel_flipperPrevious, & $carousel_flipperNext": {
                opacity: "1",
            },
        },
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
    },
    carousel_slides: {},
    carousel_sequenceIndicators: {
        position: "absolute",
        bottom: "4px",
        display: "inline-flex",
        padding: "0",
        "text-align": "center",
        "z-index": "100",
        "max-width": "100%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        "& > :first-child:nth-last-child(1)": {
            display: "none",
        },
    },
    carousel_sequenceIndicator: {
        display: "inline-block",
        padding: "4px",
        position: "relative",
        "&:focus": {
            outline: "none",
        },
        ...applyFocusVisible<DesignSystem>({
            "&::after": {
                position: "absolute",
                border: format("{0} solid transparent", toPx(focusOutlineWidth)),
                "border-radius": "40px",
                top: "0",
                right: "0",
                left: "0",
                bottom: "0",
                content: "''",
                display: "block",
                transition: "all 0.05s ease-in-out",
            },
        }),
        "&::before": {
            opacity: "0.45",
            border: "1px solid transparent",
            "border-radius": "40px",
            content: "''",
            display: "block",
            height: toPx<DesignSystem>(designUnit),
            width: "32px",
            transition: "all 0.05s ease-in-out",
        },
        "&:not($carousel_sequenceIndicator__active)": {
            "&:hover": {
                "&::before": {
                    opacity: "0.9",
                    ...highContrastHighlightColorIndicator,
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
        left: directionSwitch("6px", ""),
        right: directionSwitch("", "6px"),
    },
    carousel_flipperNext: {
        ...flipperStyles(),
        right: directionSwitch("6px", ""),
        left: directionSwitch("", "6px"),
    },
    carousel__themeDark: {
        "& $carousel_flipperPrevious, & $carousel_flipperNext": {
            "&::before": {
                color: themeDarkNeutralForegroundRest,
                fill: themeDarkNeutralForegroundRest,
                background: themeDarkNeutralFillStealthRest,
                border: format(
                    "{0} solid {1}",
                    toPx<DesignSystem>(outlineWidth),
                    themeDarkNeutralOutlineRest
                ),
                ...highContrastColorBackground,
            },
            "& span::before": {
                "border-color": themeDarkNeutralForegroundRest,
            },
            "&:hover": {
                "&::before": {
                    background: neutralFillStealthHover((): string => black),
                    [highContrastSelector]: {
                        background: HighContrastColor.selectedBackground,
                        border: format(
                            "{0} solid {1}",
                            toPx<DesignSystem>(outlineWidth),
                            () => HighContrastColor.selectedText
                        ),
                    },
                },
                "& span::before": {
                    "border-color": themeDarkNeutralForegroundRest,
                },
            },
            "& > svg": {
                fill: themeDarkNeutralForegroundRest,
                ...highContrastForeground,
            },
            [highContrastSelector]: {
                background: "none",
            },
        },
        "& $carousel_sequenceIndicator": {
            "&::before": {
                background: themeDarkNeutralFillStealthRest,
                "border-color": themeDarkNeutralOutlineRest,
                ...highContrastButtonColorIndicator,
            },
            "&::after": {
                "border-color": themeDarkNeutralFocus,
            },
            "&$carousel_sequenceIndicator__active": {
                "&::before": {
                    background: themeDarkNeutralFillStealthRest,
                    ...highContrastHighlightColorIndicator,
                },
            },
        },
    },
    carousel__themeLight: {
        "& $carousel_flipperPrevious, & $carousel_flipperNext": {
            "&::before": {
                color: themeLightNeutralForegroundRest,
                fill: themeLightNeutralForegroundRest,
                background: themeLightNeutralFillStealthRest,
                border: format(
                    "{0} solid {1}",
                    toPx<DesignSystem>(outlineWidth),
                    themeLightNeutralOutlineRest
                ),
                ...highContrastColorBackground,
            },
            "& span::before": {
                "border-color": themeLightNeutralForegroundRest,
            },
            "&:hover": {
                "&::before": {
                    background: neutralFillStealthHover((): string => white),
                    [highContrastSelector]: {
                        background: HighContrastColor.selectedBackground,
                        border: format(
                            "{0} solid {1}",
                            toPx<DesignSystem>(outlineWidth),
                            () => HighContrastColor.selectedText
                        ),
                    },
                },
                "& span::before": {
                    "border-color": themeLightNeutralForegroundRest,
                },
            },
            "& > svg": {
                fill: themeLightNeutralForegroundRest,
                ...highContrastForeground,
            },
            [highContrastSelector]: {
                background: "none",
            },
        },
        "& $carousel_sequenceIndicator": {
            "&::before": {
                background: themeLightNeutralFillStealthRest,
                "border-color": themeLightNeutralOutlineRest,
                ...highContrastButtonColorIndicator,
            },
            "&::after": {
                "border-color": themeLightNeutralFocus,
            },
            "&$carousel_sequenceIndicator__active": {
                "&::before": {
                    background: themeLightNeutralFillStealthRest,
                    ...highContrastHighlightColorIndicator,
                },
            },
        },
    },
    carousel__slideAnimatePrevious: {},
    carousel__slideAnimateNext: {},
};

export default styles;
