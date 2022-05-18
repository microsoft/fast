import { emptyArray } from "../platform.js";
import type { ArrayObserver } from "./array-observer.js";

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
    /**
     * Indicates that this splice represents a complete array reset.
     */
    public reset?: boolean;

    /**
     * Creates a splice.
     * @param index - The index that the splice occurs at.
     * @param removed - The items that were removed.
     * @param addedCount - The  number of items that were added.
     */
    public constructor(
        public index: number,
        public removed: any[],
        public addedCount: number
    ) {}

    /**
     * Adjusts the splice index based on the provided array.
     * @param array - The array to adjust to.
     * @returns The same splice, mutated based on the reference array.
     */
    public adjustTo(array: any[]): this {
        let index = this.index;
        const arrayLength = array.length;

        if (index > arrayLength) {
            index = arrayLength - this.addedCount;
        } else if (index < 0) {
            index = arrayLength + this.removed.length + index - this.addedCount;
        }

        this.index = index < 0 ? 0 : index;
        return this;
    }
}

export interface SpliceStrategy {
    normalize(
        previous: unknown[] | undefined,
        current: unknown[],
        changes: Splice[] | undefined
    ): readonly Splice[];
    pop(
        array: any[],
        observer: ArrayObserver,
        pop: typeof Array.prototype.pop,
        args: any[]
    ): any;
    push(
        array: any[],
        observer: ArrayObserver,
        push: typeof Array.prototype.push,
        args: any[]
    ): any;
    reverse(
        array: any[],
        observer: ArrayObserver,
        reverse: typeof Array.prototype.reverse,
        args: any[]
    ): any;
    shift(
        array: any[],
        observer: ArrayObserver,
        shift: typeof Array.prototype.shift,
        args: any[]
    ): any;
    sort(
        array: any[],
        observer: ArrayObserver,
        sort: typeof Array.prototype.sort,
        args: any[]
    ): any[];
    splice(
        array: any[],
        observer: ArrayObserver,
        splice: typeof Array.prototype.splice,
        args: any[]
    ): any;
    unshift(
        array: any[],
        observer: ArrayObserver,
        unshift: typeof Array.prototype.unshift,
        args: any[]
    ): any[];
}

const reset = new Splice(0, emptyArray as any, 0);
reset.reset = true;
const resetSplices = [reset];

const defaultSpliceStrategy: SpliceStrategy = Object.freeze({
    normalize(
        previous: unknown[] | undefined,
        current: unknown[],
        changes: Splice[] | undefined
    ): readonly Splice[] {
        return previous === void 0 ? changes ?? emptyArray : resetSplices;
    },

    pop(
        array: any[],
        observer: ArrayObserver,
        pop: typeof Array.prototype.pop,
        args: any[]
    ) {
        const notEmpty = array.length > 0;
        const result = pop.apply(array, args);

        if (notEmpty) {
            observer.addSplice(new Splice(array.length, [result], 0));
        }

        return result;
    },

    push(
        array: any[],
        observer: ArrayObserver,
        push: typeof Array.prototype.push,
        args: any[]
    ): any {
        const result = push.apply(array, args);
        observer.addSplice(
            new Splice(array.length - args.length, [], args.length).adjustTo(array)
        );
        return result;
    },

    reverse(
        array: any[],
        observer: ArrayObserver,
        reverse: typeof Array.prototype.reverse,
        args: any[]
    ): any {
        const result = reverse.apply(array, args);
        observer.reset(array);
        return result;
    },

    shift(
        array: any[],
        observer: ArrayObserver,
        shift: typeof Array.prototype.shift,
        args: any[]
    ): any {
        const notEmpty = array.length > 0;
        const result = shift.apply(array, args);

        if (notEmpty) {
            observer.addSplice(new Splice(0, [result], 0));
        }

        return result;
    },

    sort(
        array: any[],
        observer: ArrayObserver,
        sort: typeof Array.prototype.sort,
        args: any[]
    ): any[] {
        const result = sort.apply(array, args);
        observer.reset(array);
        return result;
    },

    splice(
        array: any[],
        observer: ArrayObserver,
        splice: typeof Array.prototype.splice,
        args: any[]
    ): any {
        const result = splice.apply(array, args);
        observer.addSplice(
            new Splice(+args[0], result, args.length > 2 ? args.length - 2 : 0).adjustTo(
                array
            )
        );
        return result;
    },

    unshift(
        array: any[],
        observer: ArrayObserver,
        unshift: typeof Array.prototype.unshift,
        args: any[]
    ): any[] {
        const result = unshift.apply(array, args);
        observer.addSplice(new Splice(0, [], args.length).adjustTo(array));
        return result;
    },
});

export const SpliceStrategy = {
    default: defaultSpliceStrategy,
};
