/**
 * @internal
 */
export declare function binarySearch<T>(
    valuesToSearch: T[] | ReadonlyArray<T>,
    searchCondition: (value: T) => boolean,
    startIndex?: number,
    endIndex?: number
): T;
