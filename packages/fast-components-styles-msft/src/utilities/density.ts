import { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";

export function density(value: number, unit?: string): (config: IDesignSystem) => string {
    return (config: IDesignSystem): string => {
        const designSystem: IDesignSystem = withDesignSystemDefaults(config);
        const augmented: number = value * designSystem.density;
        return typeof unit === "string" ? `${augmented}${unit}` : toPx(augmented);
    };
}
