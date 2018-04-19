export type JSSUtilities<T> = {
    [P in keyof T]: T[P]
};
