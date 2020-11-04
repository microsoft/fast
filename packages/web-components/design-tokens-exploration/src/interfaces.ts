export type Constructable<T = {}> = {
    new (...args: any[]): T;
};

export type Class<T, C = {}> = C & {
    readonly prototype: T;
    new (...args: any[]): T;
};
