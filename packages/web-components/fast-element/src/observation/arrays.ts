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

let defaultSpliceStrategy: SpliceStrategy = Object.freeze({
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
