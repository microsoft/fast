// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Arguments<T> = T extends (...a: infer A) => infer R ? A : never;
