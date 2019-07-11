export type ArgumentTypes<T> = T extends (...a: infer A) => infer R ? A : never;
