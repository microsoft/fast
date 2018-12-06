import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import {
    ensureBackgroundNormal,
    ensureForegroundNormal,
    foregroundNormal,
} from "../utilities/colors";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { disabledContrast, hoverContrast } from "../utilities/colors";

/**
 * Describes the outline pattern for components. The default export includes all css values specific
 * to the outline pattern. Depending on the component structure aligning to the outline pattern,
 * these values can either be integrated wholesale into a css selector (eg. {...outlinePattern.rest})
 * or assigned by property (eg. {backgroundColor: outlinePattern.rest.border})
 */

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
            return `0 0 0 1px inset ${ensureForegroundNormal(config)}`;
        },
        border: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return outline(
                designSystem.outlinePatternOutlineWidth,
                ensureForegroundNormal(designSystem)
            );
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
