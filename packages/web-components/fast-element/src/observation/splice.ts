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

/**
 * Indicates what level of feature support the splice
 * strategy provides.
 * @public
 */
export const SpliceStrategySupport = Object.freeze({
    /**
     * Only supports resets.
     */
    reset: 1,
    /**
     * Supports tracking splices and resets.
     */
    splice: 2,
    /**
     * Supports tracking splices and resets, while applying some form
     * of optimization, such as merging, to the splices.
     */
    optimized: 3,
} as const);

/**
 * Indicates what level of feature support the splice
 * strategy provides.
 * @public
 */
export type SpliceStrategySupport = typeof SpliceStrategySupport[keyof typeof SpliceStrategySupport];

/**
 * An approach to tracking changes in an array.
 * @public
 */
export interface SpliceStrategy {
    /**
     * The level of feature support the splice strategy provides.
     */
    readonly support: SpliceStrategySupport;

    /**
     * Normalizes the splices before delivery to array change subscribers.
     * @param previous - The previous version of the array if a reset has taken place.
     * @param current - The current version of the array.
     * @param changes - The set of changes tracked against the array.
     */
    normalize(
        previous: unknown[] | undefined,
        current: unknown[],
        changes: Splice[] | undefined
    ): readonly Splice[];

    /**
     * Performs and tracks a pop operation on an array.
     * @param array - The array to track the change for.
     * @param observer - The observer to register the change with.
     * @param pop - The operation to perform.
     * @param args - The arguments for the operation.
     */
    pop(
        array: any[],
        observer: ArrayObserver,
        pop: typeof Array.prototype.pop,
        args: any[]
    ): any;

    /**
     * Performs and tracks a push operation on an array.
     * @param array - The array to track the change for.
     * @param observer - The observer to register the change with.
     * @param push - The operation to perform.
     * @param args - The arguments for the operation.
     */
    push(
        array: any[],
        observer: ArrayObserver,
        push: typeof Array.prototype.push,
        args: any[]
    ): any;

    /**
     * Performs and tracks a reverse operation on an array.
     * @param array - The array to track the change for.
     * @param observer - The observer to register the change with.
     * @param reverse - The operation to perform.
     * @param args - The arguments for the operation.
     */
    reverse(
        array: any[],
        observer: ArrayObserver,
        reverse: typeof Array.prototype.reverse,
        args: any[]
    ): any;

    /**
     * Performs and tracks a shift operation on an array.
     * @param array - The array to track the change for.
     * @param observer - The observer to register the change with.
     * @param shift - The operation to perform.
     * @param args - The arguments for the operation.
     */
    shift(
        array: any[],
        observer: ArrayObserver,
        shift: typeof Array.prototype.shift,
        args: any[]
    ): any;

    /**
     * Performs and tracks a sort operation on an array.
     * @param array - The array to track the change for.
     * @param observer - The observer to register the change with.
     * @param sort - The operation to perform.
     * @param args - The arguments for the operation.
     */
    sort(
        array: any[],
        observer: ArrayObserver,
        sort: typeof Array.prototype.sort,
        args: any[]
    ): any[];

    /**
     * Performs and tracks a splice operation on an array.
     * @param array - The array to track the change for.
     * @param observer - The observer to register the change with.
     * @param splice - The operation to perform.
     * @param args - The arguments for the operation.
     */
    splice(
        array: any[],
        observer: ArrayObserver,
        splice: typeof Array.prototype.splice,
        args: any[]
    ): any;

    /**
     * Performs and tracks an unshift operation on an array.
     * @param array - The array to track the change for.
     * @param observer - The observer to register the change with.
     * @param unshift - The operation to perform.
     * @param args - The arguments for the operation.
     */
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
    support: SpliceStrategySupport.splice,

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

/**
 * Functionality related to tracking changes in arrays.
 * @public
 */
export const SpliceStrategy = {
    /**
     * The default strategy for array change tracking.
     */
    default: defaultSpliceStrategy,

    /**
     * A set of changes that represent a full array reset.
     */
    reset: resetSplices,
};
