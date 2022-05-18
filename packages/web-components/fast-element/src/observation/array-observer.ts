import { Updates } from "./update-queue.js";
import { Splice, SpliceStrategy } from "./splice.js";
import { Subscriber, SubscriberSet } from "./notifier.js";
import type { Notifier } from "./notifier.js";
import { Observable } from "./observable.js";

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
            (this._strategy ?? SpliceStrategy.default).normalize(
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

/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Enables the array observation mechanism.
 * @remarks
 * Array observation is enabled automatically when using the
 * {@link RepeatDirective}, so calling this API manually is
 * not typically necessary.
 * @public
 */
export function enableArrayObservation(): void {
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
                    : (o.strategy ?? SpliceStrategy.default)[method.name](
                          this,
                          o,
                          method,
                          args
                      );
            };
        });
    }
}

/**
 * Enables observing the length of an array.
 * @param array - The array to observe the length of.
 * @returns The length of the array.
 * @public
 */
export function length<T>(array: readonly T[]): number {
    if (!array) {
        return 0;
    }

    let arrayObserver = (array as any).$fastController as ArrayObserver;
    if (arrayObserver === void 0) {
        enableArrayObservation();
        arrayObserver = Observable.getNotifier<ArrayObserver>(array);
    }

    Observable.track(arrayObserver.lengthObserver, "length");
    return array.length;
}
