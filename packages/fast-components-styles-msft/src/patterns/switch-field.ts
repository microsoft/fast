import {
    disabledContrast,
    ensureNormalContrast,
    normalContrast,
} from "../utilities/colors";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";

export default {
    rest: {
        stateIndicator: {
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
    disabled: {
        stateIndicator: {
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
};
