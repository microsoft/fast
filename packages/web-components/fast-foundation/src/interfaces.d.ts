export declare type Class<T, C = {}> = C & {
    readonly prototype: T;
    new (...args: any[]): T;
};
