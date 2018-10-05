import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";

export function density(value: number, unit?: string): (config: DesignSystem) => string {
    return (config: DesignSystem): string => {
        const designSystem: DesignSystem = withDesignSystemDefaults(config);
        const augmented: number = value * designSystem.density;
        return typeof unit === "string" ? `${augmented}${unit}` : toPx(augmented);
    };
}
