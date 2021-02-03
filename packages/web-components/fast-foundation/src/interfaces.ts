export type Class<T, C = unknown> = C & {
    readonly prototype: T;
    new (...args: any[]): T;
};
