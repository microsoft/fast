// Typescript chokes if we don't type alias this for some reason
type Resolver<T> = (designSystem: T) => number;

export function multiply<T>(
    ...args: Array<number | Resolver<T>>
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

multiply(2, (d: any): number => 2);
