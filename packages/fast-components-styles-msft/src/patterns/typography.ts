import { disabledContrast, ensureForegroundNormal } from "../utilities/colors";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";

export default {
    rest: {
        color: ensureForegroundNormal,
    },
    disabled: {
        color: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);

            return disabledContrast(
                designSystem.contrast,
                designSystem.foregroundColor,
                designSystem.backgroundColor
            );
        },
    },
};
