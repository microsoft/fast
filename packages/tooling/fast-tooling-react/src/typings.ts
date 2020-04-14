export type Arguments<T> = T extends (...a: infer A) => infer R ? A : never;
