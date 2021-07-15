/**
 * Represents a set of splice-based changes against an Array.
 * @public
 */
export interface Splice {
    /**
     * The index that the splice occurs at.
     */
    index: number;
    /**
     * The items that were removed.
     */
    removed: any[];
    /**
     * The  number of items that were added.
     */
    addedCount: number;
}
/** @internal */
export declare function newSplice(
    index: number,
    removed: any[],
    addedCount: number
): Splice;
/**
 * Splice Projection functions:
 *
 * A splice map is a representation of how a previous array of items
 * was transformed into a new array of items. Conceptually it is a list of
 * tuples of
 *
 *   <index, removed, addedCount>
 *
 * which are kept in ascending index order of. The tuple represents that at
 * the |index|, |removed| sequence of items were removed, and counting forward
 * from |index|, |addedCount| items were added.
 */
/**
 * @internal
 * @remarks
 * Lacking individual splice mutation information, the minimal set of
 * splices can be synthesized given the previous state and final state of an
 * array. The basic approach is to calculate the edit distance matrix and
 * choose the shortest path through it.
 *
 * Complexity: O(l * p)
 *   l: The length of the current array
 *   p: The length of the old array
 */
export declare function calcSplices(
    current: any[],
    currentStart: number,
    currentEnd: number,
    old: any[],
    oldStart: number,
    oldEnd: number
): ReadonlyArray<never> | Splice[];
/** @internal */
export declare function projectArraySplices(array: any[], changeRecords: any[]): Splice[];
