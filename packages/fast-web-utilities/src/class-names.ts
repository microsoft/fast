interface Foo {
    [key: string]: boolean
}
type ClassNamesArg = (string | Foo);

export function classNames(...args: Array<(string|{[key: string]: boolean})>): string {
    let classes: string = "";

    for (let i: number = 0, length: number = args.length; i < length; i++) {
        const arg: ClassNamesArg = args[i];
        const leadingChar: string = classes.length === 0 ? "": " ";
        if (typeof arg === "string") {
            classes += leadingChar;
            classes += arg;
        } else if (typeof arg === "object" && arg !== null) {
            classes += leadingChar;
            classes += classNames.apply(null, Object.keys(arg).filter((key: string): boolean => arg[key]));
        }
    }

    return classes;
}
