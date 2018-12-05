import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import { ensureBackgroundNormal, foregroundNormal } from "../utilities/colors";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { disabledContrast, hoverContrast } from "../utilities/colors";

/**
 * Define the static outline for outline components. The result can be applied to a CSS border or outline property
 */
export const rest: CSSRules<DesignSystem> = {
    border: (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);

        return `${toPx(designSystem.outlinePatternOutlineWidth)} solid ${foregroundNormal(
            designSystem
        )}`;
    },
    background: ensureBackgroundNormal,
};

/**
 * Define the hover outline for outline components. The result can be applied to a CSS border or outline property
 */
export const hover: CSSRules<DesignSystem> = {
    border: (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);

        const outlineColor: string = hoverContrast(
            designSystem.contrast,
            foregroundNormal(designSystem),
            designSystem.backgroundColor
        );
        return `${toPx(designSystem.outlinePatternOutlineWidth)} solid ${outlineColor}`;
    },
};

export const focus: CSSRules<DesignSystem> = {
    boxShadow: (config: DesignSystem): string => {
        return `0 0 0 1px inset ${foregroundNormal(config)}`;
    },
};

export const disabled: CSSRules<DesignSystem> = {
    border: (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);

        const outlineColor: string = disabledContrast(
            designSystem.contrast,
            foregroundNormal(designSystem),
            designSystem.backgroundColor
        );
        return `${toPx(designSystem.outlinePatternOutlineWidth)} solid ${outlineColor}`;
    },
};
