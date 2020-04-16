export type Callable = typeof Function.prototype.call | { call(): void };

export const emptyArray = Object.freeze([]);
