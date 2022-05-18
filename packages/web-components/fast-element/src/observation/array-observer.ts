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
 * An observer for arrays.
 * @public
 */
export interface ArrayObserver extends SubscriberSet {
    strategy: SpliceStrategy;
    addSplice(splice: Splice): void;
    reset(oldCollection: any[] | undefined): void;
    flush(): void;
}

interface LengthSubscriber extends Subscriber {
    length: number;
}

class DefaultArrayObserver extends SubscriberSet implements ArrayObserver {
    private oldCollection: any[] | undefined = void 0;
    private splices: Splice[] | undefined = void 0;
    private needsQueue: boolean = true;
    private spliceStrategy: SpliceStrategy | null = null;

    /** @internal */
    public lengthSubscriber: LengthSubscriber | undefined = void 0;

    public get strategy(): SpliceStrategy {
        return this.spliceStrategy ?? SpliceStrategy.default;
    }

    public set strategy(value: SpliceStrategy) {
        this.spliceStrategy = value;
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

        this.notify(this.strategy.normalize(oldCollection, this.subject, splices));
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
                    : o.strategy[method.name](this, o, method, args);
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

    let arrayObserver = (array as any).$fastController as DefaultArrayObserver;
    if (arrayObserver === void 0) {
        enableArrayObservation();
        arrayObserver = Observable.getNotifier<DefaultArrayObserver>(array);
    }

    let lengthSubscriber = arrayObserver.lengthSubscriber; // using internal API
    if (lengthSubscriber === void 0) {
        arrayObserver.lengthSubscriber = lengthSubscriber = {
            length: array.length,
            handleChange() {
                if (this.length !== array.length) {
                    this.length = array.length;
                    Observable.notify(lengthSubscriber, "length");
                }
            },
        };

        arrayObserver.subscribe(lengthSubscriber);
    }

    Observable.track(lengthSubscriber, "length");
    return array.length;
}
