/**
 * For each item in an array, invoke a function
 */
export function invokeFunctionForEach<T>(arr: T[], name: string): void {
    arr.forEach((arrItem: T) => arrItem[name]());
}
