import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import {
    ButtonClassNameContract,
    SelectClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import { contrast, toPx } from "@microsoft/fast-jss-utilities";
import { disabledContrast, ensureNormalContrast } from "../utilities/colors";
import { curry } from "lodash-es";

export const selectDisplayButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        width: "100%",
        padding: "0 10px",
    },
    button_contentRegion: {
        width: "100%",
        display: "inline-flex",
    },
};

const styles: ComponentStyles<SelectClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SelectClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    const backgroundColor: string = designSystem.backgroundColor;
    const foregroundColor: string = ensureNormalContrast(
        designSystem.contrast,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );

    type ContrastFunction = (operandColor: string, referenceColor: string) => string;
    const contrastScale: number = designSystem.contrast;
    const brandColor: string = designSystem.brandColor;
    const color: string = designSystem.foregroundColor;
    const scaledEnsureNormalContrast: ContrastFunction = curry(ensureNormalContrast)(
        contrastScale
    );
    const primaryRestBackgroundColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(brandColor, designSystem.backgroundColor),
        color
    );
    const primaryDisabledBackground: string = disabledContrast(
        contrastScale,
        primaryRestBackgroundColor,
        designSystem.backgroundColor
    );
    const primaryDisabledColor: string = disabledContrast(
        contrastScale,
        color,
        primaryDisabledBackground
    );
    const primarySelectedBackground: string = contrast(
        1.7,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );

    return {
        select: {
            minWidth: "276px",
            maxWidth: "374px",
        },

        select_toggleGlyph: {
            fill: { foregroundColor },
        },

        select__disabled: {
            "&$select__multiSelectable $select_menu": {
                borderColor: primaryDisabledColor,
            },
        },

        select_menu: {
            ...elevation(ElevationMultiplier.e11, designSystem.foregroundColor)(
                designSystem
            ),
            background: backgroundColor,
            zIndex: "1",
            position: "absolute",
            width: "100%",
            margin: "0",
            padding: "4px 0",
            maxWidth: "374px",
            minWidth: "276px",
            maxHeight: "328px",
            overflow: "auto",
            borderRadius: toPx(designSystem.cornerRadius * 2),
        },

        select__multiSelectable: {
            "& $select_menu": {
                position: "static",
                boxShadow: "none",
                border: "1px solid",
                borderColor: foregroundColor,
            },
        },

        select_menu__open: {},
    };
};

export default styles;
