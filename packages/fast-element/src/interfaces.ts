export type Callable = typeof Function.prototype.call | { call(): void };

export const emptyArray = Object.freeze([]);

export type CustomElementConstructor = {
    new (): HTMLElement;
};

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
