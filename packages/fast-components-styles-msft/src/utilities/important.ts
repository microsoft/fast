import {
    checkDesignSystemResolver,
    DesignSystem,
    DesignSystemResolver,
} from "../design-system";

/**
 * Sets a css value to be '!important'.
 */
export function importantValue(
    value: string | DesignSystemResolver<string>
): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string => {
        return `${checkDesignSystemResolver(value, designSystem)} !important`;
    };
}
