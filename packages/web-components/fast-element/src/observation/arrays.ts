import { emptyArray } from "../platform.js";
import { Notifier, Subscriber, SubscriberSet } from "./notifier.js";
import { Observable } from "./observable.js";
import { Updates } from "./update-queue.js";

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
 * The available values for SpliceStrategySupport.
 * @public
 */
export type SpliceStrategySupport =
    (typeof SpliceStrategySupport)[keyof typeof SpliceStrategySupport];

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

const enum Edit {
    leave = 0,
    update = 1,
    add = 2,
    delete = 3,
}

// Note: This function is *based* on the computation of the Levenshtein
// "edit" distance. The one change is that "updates" are treated as two
// edits - not one. With Array splices, an update is really a delete
// followed by an add. By retaining this, we optimize for "keeping" the
// maximum array items in the original array. For example:
//
//   'xxxx123' to '123yyyy'
//
// With 1-edit updates, the shortest path would be just to update all seven
// characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
// leaves the substring '123' intact.
function calcEditDistances(
    current: any[],
    currentStart: number,
    currentEnd: number,
    old: any[],
    oldStart: number,
    oldEnd: number
): any[] {
    // "Deletion" columns
    const rowCount = oldEnd - oldStart + 1;
    const columnCount = currentEnd - currentStart + 1;
    const distances = new Array(rowCount);
    let north;
    let west;

    // "Addition" rows. Initialize null column.
    for (let i = 0; i < rowCount; ++i) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
    }

    // Initialize null row
    for (let j = 0; j < columnCount; ++j) {
        distances[0][j] = j;
    }

    for (let i = 1; i < rowCount; ++i) {
        for (let j = 1; j < columnCount; ++j) {
            if (current[currentStart + j - 1] === old[oldStart + i - 1]) {
                distances[i][j] = distances[i - 1][j - 1];
            } else {
                north = distances[i - 1][j] + 1;
                west = distances[i][j - 1] + 1;
                distances[i][j] = north < west ? north : west;
            }
        }
    }

    return distances;
}

// This starts at the final weight, and walks "backward" by finding
// the minimum previous weight recursively until the origin of the weight
// matrix.
function spliceOperationsFromEditDistances(distances: number[][]): number[] {
    let i = distances.length - 1;
    let j = distances[0].length - 1;
    let current = distances[i][j];
    const edits: number[] = [];

    while (i > 0 || j > 0) {
        if (i === 0) {
            edits.push(Edit.add);
            j--;
            continue;
        }
        if (j === 0) {
            edits.push(Edit.delete);
            i--;
            continue;
        }

        const northWest = distances[i - 1][j - 1];
        const west = distances[i - 1][j];
        const north = distances[i][j - 1];

        let min;
        if (west < north) {
            min = west < northWest ? west : northWest;
        } else {
            min = north < northWest ? north : northWest;
        }

        if (min === northWest) {
            if (northWest === current) {
                edits.push(Edit.leave);
            } else {
                edits.push(Edit.update);
                current = northWest;
            }
            i--;
            j--;
        } else if (min === west) {
            edits.push(Edit.delete);
            i--;
            current = west;
        } else {
            edits.push(Edit.add);
            j--;
            current = north;
        }
    }

    return edits.reverse();
}

function sharedPrefix(current: any[], old: any[], searchLength: number): number {
    for (let i = 0; i < searchLength; ++i) {
        if (current[i] !== old[i]) {
            return i;
        }
    }

    return searchLength;
}

function sharedSuffix(current: any[], old: any[], searchLength: number): number {
    let index1 = current.length;
    let index2 = old.length;
    let count = 0;

    while (count < searchLength && current[--index1] === old[--index2]) {
        count++;
    }

    return count;
}

function intersect(start1: number, end1: number, start2: number, end2: number): number {
    // Disjoint
    if (end1 < start2 || end2 < start1) {
        return -1;
    }

    // Adjacent
    if (end1 === start2 || end2 === start1) {
        return 0;
    }

    // Non-zero intersect, span1 first
    if (start1 < start2) {
        if (end1 < end2) {
            return end1 - start2; // Overlap
        }

        return end2 - start2; // Contained
    }

    // Non-zero intersect, span2 first
    if (end2 < end1) {
        return end2 - start1; // Overlap
    }

    return end1 - start1; // Contained
}

/**
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
function calc(
    current: unknown[],
    currentStart: number,
    currentEnd: number,
    old: unknown[],
    oldStart: number,
    oldEnd: number
): Splice[] {
    let prefixCount = 0;
    let suffixCount = 0;

    const minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
    if (currentStart === 0 && oldStart === 0) {
        prefixCount = sharedPrefix(current, old, minLength);
    }

    if (currentEnd === current.length && oldEnd === old.length) {
        suffixCount = sharedSuffix(current, old, minLength - prefixCount);
    }

    currentStart += prefixCount;
    oldStart += prefixCount;
    currentEnd -= suffixCount;
    oldEnd -= suffixCount;

    if (currentEnd - currentStart === 0 && oldEnd - oldStart === 0) {
        return emptyArray as any;
    }

    if (currentStart === currentEnd) {
        const splice = new Splice(currentStart, [], 0);

        while (oldStart < oldEnd) {
            splice.removed.push(old[oldStart++]);
        }

        return [splice];
    } else if (oldStart === oldEnd) {
        return [new Splice(currentStart, [], currentEnd - currentStart)];
    }

    const ops = spliceOperationsFromEditDistances(
        calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd)
    );

    const splices: Splice[] = [];
    let splice: Splice | undefined = void 0;
    let index = currentStart;
    let oldIndex = oldStart;

    for (let i = 0; i < ops.length; ++i) {
        switch (ops[i]) {
            case Edit.leave:
                if (splice !== void 0) {
                    splices.push(splice);
                    splice = void 0;
                }

                index++;
                oldIndex++;
                break;
            case Edit.update:
                if (splice === void 0) {
                    splice = new Splice(index, [], 0);
                }

                splice.addedCount++;
                index++;

                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            case Edit.add:
                if (splice === void 0) {
                    splice = new Splice(index, [], 0);
                }

                splice.addedCount++;
                index++;
                break;
            case Edit.delete:
                if (splice === void 0) {
                    splice = new Splice(index, [], 0);
                }

                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            // no default
        }
    }

    if (splice !== void 0) {
        splices.push(splice);
    }

    return splices;
}

function merge(splice: Splice, splices: Splice[]): void {
    let inserted = false;
    let insertionOffset = 0;

    for (let i = 0; i < splices.length; i++) {
        const current = splices[i];
        current.index += insertionOffset;

        if (inserted) {
            continue;
        }

        const intersectCount = intersect(
            splice.index,
            splice.index + splice.removed.length,
            current.index,
            current.index + current.addedCount
        );

        if (intersectCount >= 0) {
            // Merge the two splices

            splices.splice(i, 1);
            i--;

            insertionOffset -= current.addedCount - current.removed.length;

            splice.addedCount += current.addedCount - intersectCount;
            const deleteCount =
                splice.removed.length + current.removed.length - intersectCount;

            if (!splice.addedCount && !deleteCount) {
                // merged splice is a noop. discard.
                inserted = true;
            } else {
                let currentRemoved = current.removed;

                if (splice.index < current.index) {
                    // some prefix of splice.removed is prepended to current.removed.
                    const prepend = splice.removed.slice(0, current.index - splice.index);
                    prepend.push(...currentRemoved);
                    currentRemoved = prepend;
                }

                if (
                    splice.index + splice.removed.length >
                    current.index + current.addedCount
                ) {
                    // some suffix of splice.removed is appended to current.removed.
                    const append = splice.removed.slice(
                        current.index + current.addedCount - splice.index
                    );
                    currentRemoved.push(...append);
                }

                splice.removed = currentRemoved;

                if (current.index < splice.index) {
                    splice.index = current.index;
                }
            }
        } else if (splice.index < current.index) {
            // Insert splice here.
            inserted = true;

            splices.splice(i, 0, splice);
            i++;

            const offset = splice.addedCount - splice.removed.length;
            current.index += offset;
            insertionOffset += offset;
        }
    }

    if (!inserted) {
        splices.push(splice);
    }
}

function project(array: unknown[], changes: Splice[]): Splice[] {
    let splices: Splice[] = [];
    const initialSplices: Splice[] = [];

    for (let i = 0, ii = changes.length; i < ii; i++) {
        merge(changes[i], initialSplices);
    }

    for (let i = 0, ii = initialSplices.length; i < ii; ++i) {
        const splice = initialSplices[i];

        if (splice.addedCount === 1 && splice.removed.length === 1) {
            if (splice.removed[0] !== array[splice.index]) {
                splices.push(splice);
            }

            continue;
        }

        splices = splices.concat(
            calc(
                array,
                splice.index,
                splice.index + splice.addedCount,
                splice.removed,
                0,
                splice.removed.length
            )
        );
    }

    return splices;
}

/**
 * A SpliceStrategy that attempts to merge all splices into the minimal set of
 * splices needed to represent the change from the old array to the new array.
 * @public
 */

let defaultSpliceStrategy: SpliceStrategy = Object.freeze({
    support: SpliceStrategySupport.optimized,

    normalize(
        previous: unknown[] | undefined,
        current: unknown[],
        changes: Splice[] | undefined
    ): readonly Splice[] {
        if (previous === void 0) {
            if (changes === void 0) {
                return emptyArray;
            }
            return project(current, changes);
        }

        return resetSplices;
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
export const SpliceStrategy = Object.freeze({
    /**
     * A set of changes that represent a full array reset.
     */
    reset: resetSplices,

    /**
     * Sets the default strategy to use for array observers.
     * @param strategy - The splice strategy to use.
     */
    setDefaultStrategy(strategy: SpliceStrategy) {
        defaultSpliceStrategy = strategy;
    },
} as const);

function setNonEnumerable(target: any, property: string, value: any): void {
    Reflect.defineProperty(target, property, {
        value,
        enumerable: false,
    });
}

/**
 * Observes array lengths.
 * @public
 */
export interface LengthObserver extends Subscriber {
    /**
     * The length of the observed array.
     */
    length: number;
}

/**
 * An observer for arrays.
 * @public
 */
export interface ArrayObserver extends SubscriberSet {
    /**
     * The strategy to use for tracking changes.
     */
    strategy: SpliceStrategy | null;

    /**
     * The length observer for the array.
     */
    readonly lengthObserver: LengthObserver;

    /**
     * Adds a splice to the list of changes.
     * @param splice - The splice to add.
     */
    addSplice(splice: Splice): void;

    /**
     * Indicates that a reset change has occurred.
     * @param oldCollection - The collection as it was before the reset.
     */
    reset(oldCollection: any[] | undefined): void;

    /**
     * Flushes the changes to subscribers.
     */
    flush(): void;
}

class DefaultArrayObserver extends SubscriberSet implements ArrayObserver {
    private oldCollection: any[] | undefined = void 0;
    private splices: Splice[] | undefined = void 0;
    private needsQueue: boolean = true;
    private _strategy: SpliceStrategy | null = null;
    private _lengthObserver: LengthObserver | undefined = void 0;

    public get strategy(): SpliceStrategy | null {
        return this._strategy;
    }

    public set strategy(value: SpliceStrategy | null) {
        this._strategy = value;
    }

    public get lengthObserver(): LengthObserver {
        let observer = this._lengthObserver;

        if (observer === void 0) {
            const array = this.subject;
            this._lengthObserver = observer = {
                length: array.length,
                handleChange() {
                    if (this.length !== array.length) {
                        this.length = array.length;
                        Observable.notify(observer, "length");
                    }
                },
            };

            this.subscribe(observer);
        }

        return observer;
    }

    call: () => void = this.flush;

    constructor(subject: any[]) {
        super(subject);
        setNonEnumerable(subject, "$fastController", this);
    }

    public subscribe(subscriber: Subscriber): void {
        this.flush();
        super.subscribe(subscriber);
    }

    public addSplice(splice: Splice) {
        if (this.splices === void 0) {
            this.splices = [splice];
        } else {
            this.splices.push(splice);
        }

        this.enqueue();
    }

    public reset(oldCollection: any[] | undefined): void {
        this.oldCollection = oldCollection;
        this.enqueue();
    }

    public flush(): void {
        const splices = this.splices;
        const oldCollection = this.oldCollection;

        if (splices === void 0 && oldCollection === void 0) {
            return;
        }

        this.needsQueue = true;
        this.splices = void 0;
        this.oldCollection = void 0;

        this.notify(
            (this._strategy ?? defaultSpliceStrategy).normalize(
                oldCollection,
                this.subject,
                splices
            )
        );
    }

    private enqueue(): void {
        if (this.needsQueue) {
            this.needsQueue = false;
            Updates.enqueue(this);
        }
    }
}

let enabled = false;

/**
 * An observer for arrays.
 * @public
 */
export const ArrayObserver = Object.freeze({
    /**
     * Enables the array observation mechanism.
     * @remarks
     * Array observation is enabled automatically when using the
     * {@link RepeatDirective}, so calling this API manually is
     * not typically necessary.
     */
    enable(): void {
        if (enabled) {
            return;
        }

        enabled = true;

        Observable.setArrayObserverFactory(
            (collection: any[]): Notifier => new DefaultArrayObserver(collection)
        );

        const proto = Array.prototype;

        if (!(proto as any).$fastPatch) {
            setNonEnumerable(proto, "$fastPatch", 1);

            [
                proto.pop,
                proto.push,
                proto.reverse,
                proto.shift,
                proto.sort,
                proto.splice,
                proto.unshift,
            ].forEach(method => {
                proto[method.name] = function (...args) {
                    const o = this.$fastController as ArrayObserver;
                    return o === void 0
                        ? method.apply(this, args)
                        : (o.strategy ?? defaultSpliceStrategy)[method.name](
                              this,
                              o,
                              method,
                              args
                          );
                };
            });
        }
    },
} as const);

/**
 * Enables observing the length of an array.
 * @param array - The array to observe the length of.
 * @returns The length of the array.
 * @public
 */
export function lengthOf<T>(array: readonly T[]): number {
    if (!array) {
        return 0;
    }

    let arrayObserver = (array as any).$fastController as ArrayObserver;
    if (arrayObserver === void 0) {
        ArrayObserver.enable();
        arrayObserver = Observable.getNotifier<ArrayObserver>(array);
    }

    Observable.track(arrayObserver.lengthObserver, "length");
    return array.length;
}
