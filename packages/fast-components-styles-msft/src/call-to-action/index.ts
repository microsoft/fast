import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { ICallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, Direction, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { IDesignSystem, withDesignSystemDefaults } from "../design-system/index";
import { curry } from "lodash-es";
import { ensureNormalContrast } from "../utilities/colors";

const styles: ComponentStyles<ICallToActionClassNameContract, IDesignSystem> = (
    config: IDesignSystem
): ComponentStyleSheet<ICallToActionClassNameContract, IDesignSystem> => {
    type ContrastFunction = (operandColor: string, referenceColor: string) => string;

    const designSystem: IDesignSystem = withDesignSystemDefaults(config);
    const contrastScale: number = designSystem.contrast;
    const backgroundColor: string = designSystem.backgroundColor;
    const brandColor: string = designSystem.brandColor;
    const direction: Direction = designSystem.direction;
    const scaledEnsureNormalContrast: ContrastFunction = curry(ensureNormalContrast)(contrastScale);
    const color: string = "white";
    const primaryRestBackgroundColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(brandColor, backgroundColor),
        color
    );

    return {
        callToAction: {
            fontSize: "15px",
            display: "inline-block",
            maxWidth: "100%",
            border: "2px solid transparent",
            padding: localizeSpacing(direction)("13px 22px 11px 24px"),
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
            lineHeight: "1",
            textDecoration: "none",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
            marginTop: "16px",
            transition: "all 0.2s ease-in-out",
            "&:hover, &:focus": {
                outline: "none",
                "& $glyph": {
                    left: "8px",
                    position: "relative"
                }
            }
        },
        glyph: {
            display: "inline-block",
            position: "relative",
            width: "8px",
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "6px",
            transform: direction === Direction.ltr ? "none" : "rotate(180deg)",
            verticalAlign: "top",
            transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
            left: "0",
            marginTop: "4px"
        },
        callToAction_backer: {
            "& $glyph": {
                fill: color
            }
        },
        callToAction_lightweight: {
            "& $glyph": {
                fill: primaryRestBackgroundColor
            }
        }
    };
};

export default styles;
