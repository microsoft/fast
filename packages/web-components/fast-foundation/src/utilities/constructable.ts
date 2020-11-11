/**
 * @internal
 */
export type Constructable<T = {}> = {
    new (...args: any[]): T;
};
