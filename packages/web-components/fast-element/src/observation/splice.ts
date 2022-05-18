import { emptyArray } from "../platform.js";

/**
 * A splice map is a representation of how a previous array of items
 * was transformed into a new array of items. Conceptually it is a list of
 * tuples of
 *
 *   (index, removed, addedCount)
 *
 * which are kept in ascending index order of. The tuple represents that at
 * the |index|, |removed| sequence of items were removed, and counting forward
 * from |index|, |addedCount| items were added.
 * @public
 */
export class Splice {
    public reset?: boolean;

    constructor(
        /**
         * The index that the splice occurs at.
         */
        public index: number,

        /**
         * The items that were removed.
         */
        public removed: any[],

        /**
         * The  number of items that were added.
         */
        public addedCount: number
    ) {}
}

export interface SpliceStrategy {
    normalizeSplices(
        previous: unknown[] | undefined,
        current: unknown[],
        changes: Splice[] | undefined
    ): readonly Splice[];
}

const reset = new Splice(0, emptyArray as any, 0);
reset.reset = true;
const resetSplices = [reset];

const defaultSpliceStrategy: SpliceStrategy = {
    normalizeSplices(
        previous: unknown[] | undefined,
        current: unknown[],
        changes: Splice[] | undefined
    ): readonly Splice[] {
        return previous === void 0 ? changes ?? emptyArray : resetSplices;
    },
};

export const SpliceStrategy = {
    default: defaultSpliceStrategy,
};
