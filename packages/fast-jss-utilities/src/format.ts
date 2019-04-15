export function format<T>(
    value: string,
    ...args: Array<(designSystem: T) => string>
): (designSystem: T) => string {
    return (designSystem: T): string => {
        return args.reduce(
            (
                reducedValue: string,
                currentValue: (designSystem: T) => string,
                index: number
            ): string => {
                return reducedValue.replace(
                    new RegExp(`\\{${index}\\}`, "g"),
                    currentValue(designSystem)
                );
            },
            value
        );
    };
}

export function toString<T, S>(
    resolver: (designSystem?: T) => any
): (designSystem?: T) => string {
    return (designSystem: T): string => String(resolver(designSystem));
}
