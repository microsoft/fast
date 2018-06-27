import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { IFlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, Direction, toPx } from "@microsoft/fast-jss-utilities";
import { applyMixedColor } from "../utilities/colors";
import { get } from "lodash-es";
import * as Chroma from "chroma-js";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<IFlipperClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IFlipperClassNameContract, IDesignSystem> => {
/* tslint:enable:max-line-length */
    const backgroundColor: string = get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
    const brandColor: string = get(config, "brandColor") || designSystemDefaults.brandColor;
    const direction: Direction = get(config, "direction") || designSystemDefaults.direction;
    const foregroundColor: string = get(config, "foregroundColor") || designSystemDefaults.foregroundColor;

    return {
        button: {
            width: toPx(40),
            height: toPx(40),
            margin: "0",
            border: `${toPx(1)} solid ${applyMixedColor(foregroundColor, backgroundColor, .86)}`,
            borderRadius: "50%",
            background: applyMixedColor(foregroundColor, backgroundColor, .98),
            padding: "0",
            "&:hover": {
                cursor: "pointer"
            },
            "&:hover, &:focus": {
                background: backgroundColor,
                outline: "none",
                boxShadow: `0 4px 8px ${Chroma(foregroundColor).alpha(0.2).css()}`
            },
            "&:focus": {
                border: `${toPx(1)} solid ${applyMixedColor(foregroundColor, backgroundColor, .46)}`,
            }
        },
        flipperGlyph: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: toPx(14),
            height: toPx(14),
            "&::before": {
                boxSizing: "border-box",
                height: toPx(12),
                width: toPx(12),
                content: "\"\"",
                borderRight: `${toPx(1)} solid ${foregroundColor}`,
                borderTop: `${toPx(1)} solid ${foregroundColor}`
            }
        },
        flipper_next: {
            "& $flipperGlyph": {
                [applyLocalizedProperty("marginRight", "marginLeft", direction)]: toPx(6),
                transform: applyLocalizedProperty("rotate(45deg)", "rotate(-135deg)", direction)
            }
        },
        flipper_previous: {
            "& $flipperGlyph": {
                [applyLocalizedProperty("marginLeft", "marginRight", direction)]: toPx(6),
                transform: applyLocalizedProperty("rotate(-135deg)", "rotate(45deg)", direction)
            }
        }
    };
};

export default styles;
