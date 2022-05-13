import { DOM } from "../dom.js";
import { Splice } from "./array-change-records.js";
import { Subscriber, SubscriberSet } from "./notifier.js";
import type { Notifier } from "./notifier.js";
import { Observable } from "./observable.js";

function setNonEnumerable(target: any, property: string, value: any): void {
    Reflect.defineProperty(target, property, {
        value,
        enumerable: false,
    });
}

interface LengthSubscriber extends Subscriber {
    length: number;
}

class ArrayObserver extends SubscriberSet {
    private oldCollection: any[] | undefined = void 0;
    private splices: Splice[] | undefined = void 0;
    private needsQueue: boolean = true;

    /** @internal */
    public lengthSubscriber: LengthSubscriber | undefined = void 0;

    call: () => void = this.flush;

    constructor(subject: any[]) {
        super(subject);
        setNonEnumerable(subject, "$fastController", this);
    }

    public addSplice(splice: Splice): void {
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

        this.notify(Splice.normalize(oldCollection, this.subject, splices));
    }

    private enqueue(): void {
        if (this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
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
        (collection: any[]): Notifier => new ArrayObserver(collection)
    );

    const proto = Array.prototype;

    if (!(proto as any).$fastPatch) {
        setNonEnumerable(proto, "$fastPatch", 1);

        const pop = proto.pop;
        const push = proto.push;
        const reverse = proto.reverse;
        const shift = proto.shift;
        const sort = proto.sort;
        const splice = proto.splice;
        const unshift = proto.unshift;
        const adjustIndex = (changeRecord: Splice, array: any[]): Splice => {
            let index = changeRecord.index;
            const arrayLength = array.length;

            if (index > arrayLength) {
                index = arrayLength - changeRecord.addedCount;
            } else if (index < 0) {
                index =
                    arrayLength +
                    changeRecord.removed.length +
                    index -
                    changeRecord.addedCount;
            }

            changeRecord.index = index < 0 ? 0 : index;
            return changeRecord;
        };

        Object.assign(proto, {
            pop(...args) {
                const notEmpty = this.length > 0;
                const result = pop.apply(this, args);
                const o = this.$fastController as ArrayObserver;

                if (o !== void 0 && notEmpty) {
                    o.addSplice(new Splice(this.length, [result], 0));
                }

                return result;
            },

            push(...args) {
                const result = push.apply(this, args);
                const o = this.$fastController as ArrayObserver;

                if (o !== void 0) {
                    o.addSplice(
                        adjustIndex(
                            new Splice(this.length - args.length, [], args.length),
                            this
                        )
                    );
                }

                return result;
            },

            reverse(...args) {
                let oldArray;
                const o = this.$fastController as ArrayObserver;

                if (o !== void 0) {
                    o.flush();
                    oldArray = this.slice();
                }

                const result = reverse.apply(this, args);

                if (o !== void 0) {
                    o.reset(oldArray);
                }

                return result;
            },

            shift(...args) {
                const notEmpty = this.length > 0;
                const result = shift.apply(this, args);
                const o = this.$fastController as ArrayObserver;

                if (o !== void 0 && notEmpty) {
                    o.addSplice(new Splice(0, [result], 0));
                }

                return result;
            },

            sort(...args) {
                let oldArray;
                const o = this.$fastController as ArrayObserver;

                if (o !== void 0) {
                    o.flush();
                    oldArray = this.slice();
                }

                const result = sort.apply(this, args);

                if (o !== void 0) {
                    o.reset(oldArray);
                }

                return result;
            },

            splice(...args) {
                const result = splice.apply(this, args);
                const o = this.$fastController as ArrayObserver;

                if (o !== void 0) {
                    o.addSplice(
                        adjustIndex(
                            new Splice(
                                +args[0],
                                result,
                                args.length > 2 ? args.length - 2 : 0
                            ),
                            this
                        )
                    );
                }

                return result;
            },

            unshift(...args) {
                const result = unshift.apply(this, args);
                const o = this.$fastController as ArrayObserver;

                if (o !== void 0) {
                    o.addSplice(adjustIndex(new Splice(0, [], args.length), this));
                }

                return result;
            },
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

    let lengthSubscriber = arrayObserver.lengthSubscriber;
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
