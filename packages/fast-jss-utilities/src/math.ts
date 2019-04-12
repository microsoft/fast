export function multiply<T>(
    ...args: Array<number | ((designSystem: T) => number)>
): (designSystem: T) => number {
    return (designSystem: T): number => {
        let value: number = 1;

        for (const currentValue of args) {
            value =
                value *
                (typeof currentValue === "function"
                    ? currentValue(designSystem)
                    : currentValue);
        }

        return value;
    };
}
