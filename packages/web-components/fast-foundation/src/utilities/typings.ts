/**
 * Helper for enumerating a type from a const object
 * Example: export type Foo = ValuesOf<typeof Foo>
 */
export type ValuesOf<T> = T[keyof T];
