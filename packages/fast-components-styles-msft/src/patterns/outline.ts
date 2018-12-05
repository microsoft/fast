import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import { ensureBackgroundNormal, foregroundNormal } from "../utilities/colors";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { disabledContrast, hoverContrast } from "../utilities/colors";

function outline(width: number, color: string): string {
    return `${toPx(width)} solid ${color}`;
}

export default {
    rest: {
        /** The border of an outline component in rest state
         */
        border: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return outline(
                designSystem.outlinePatternOutlineWidth,
                foregroundNormal(designSystem)
            );
        },
        /**
         * The background of an outline component in rest state
         */
        background: ensureBackgroundNormal,
    },
    hover: {
        /**
         * The border of an outline component in hover state
         */
        border: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return outline(
                designSystem.outlinePatternOutlineWidth,
                hoverContrast(
                    designSystem.contrast,
                    foregroundNormal(designSystem),
                    designSystem.backgroundColor
                )
            );
        },
    },
    focus: {
        /**
         * The inner border of an outline component in focus state
         */
        boxShadow: (config: DesignSystem): string => {
            return `0 0 0 1px inset ${foregroundNormal(config)}`;
        },
    },
    disabled: {
        /**
         * The border of an outline component in disabled state
         */
        border: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return outline(
                designSystem.outlinePatternOutlineWidth,
                disabledContrast(
                    designSystem.contrast,
                    foregroundNormal(designSystem),
                    designSystem.backgroundColor
                )
            );
        },
    },
};
