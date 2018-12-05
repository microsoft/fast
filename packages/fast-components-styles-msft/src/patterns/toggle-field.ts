import {
    disabledContrast,
    ensureNormalContrast,
    normalContrast,
} from "../utilities/colors";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";

export default {
    rest: {
        text: {
            color: (config: DesignSystem): string => {
                const designSystem: DesignSystem = withDesignSystemDefaults(config);
                return ensureNormalContrast(
                    config.contrast,
                    designSystem.foregroundColor,
                    designSystem.backgroundColor
                );
            },
        },
        stateIndicator: {
            unchecked: {
                background: "transparent",
            },
            checked: {
                background: (config: DesignSystem): string => {
                    const designSystem: DesignSystem = withDesignSystemDefaults(config);

                    return normalContrast(
                        designSystem.contrast,
                        designSystem.foregroundColor,
                        designSystem.backgroundColor
                    );
                },
            },
        },
    },
    disabled: {
        text: {
            color: (config: DesignSystem): string => {
                const designSystem: DesignSystem = withDesignSystemDefaults(config);

                return disabledContrast(
                    designSystem.contrast,
                    designSystem.foregroundColor,
                    designSystem.backgroundColor
                );
            },
        },
        stateIndicator: {
            checked: {
                background: (config: DesignSystem): string => {
                    const designSystem: DesignSystem = withDesignSystemDefaults(config);

                    return disabledContrast(
                        designSystem.contrast,
                        designSystem.foregroundColor,
                        designSystem.backgroundColor
                    );
                },
            },
        },
    },
};
