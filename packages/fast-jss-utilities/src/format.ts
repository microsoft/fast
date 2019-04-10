import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
} from "../design-system";

export function format(
    value: string,
    ...args: Array<DesignSystemResolver<string>>
): DesignSystemResolver<string> {
    return ensureDesignSystemDefaults(
        (designSystem: DesignSystem): string => {
            return args.reduce(
                (
                    reducedValue: string,
                    currentValue: DesignSystemResolver<string>,
                    index: number
                ): string => {
                    return reducedValue.replace(
                        new RegExp(`\\{${index}\\}`, "g"),
                        currentValue(designSystem)
                    );
                },
                value
            );
        }
    );
}
