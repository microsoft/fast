/**
 * @public
 */
export interface DesignToken<T> {
    readonly $value: T | undefined;
    readonly name?: string;
}
