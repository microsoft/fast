import { DOM } from "../dom.js";
import { calcSplices, newSplice, projectArraySplices } from "./array-change-records.js";
import type { Splice } from "./array-change-records.js";
import { Subscriber, SubscriberSet } from "./notifier.js";
import type { Notifier } from "./notifier.js";
import { Observable } from "./observable.js";

class ArrayObserver extends SubscriberSet {
    private oldCollection: any[] | undefined = void 0;
    private splices: Splice[] | undefined = void 0;
    private needsQueue: boolean = true;
    call: () => void = this.flush;

    constructor(subject: any[]) {
        super(subject);
        (subject as any).$fastController = this;
    }

    public subscribe(subscriber: Subscriber): void {
        this.flush();
        super.subscribe(subscriber);
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
        (collection: any[]): Notifier => {
            return new ArrayObserver(collection);
        }
    );

    const proto = Array.prototype;

    if (!(proto as any).$fastPatch) {
        (proto as any).$fastPatch = true;

        const pop = proto.pop;
        const push = proto.push;
        const reverse = proto.reverse;
        const shift = proto.shift;
        const sort = proto.sort;
        const splice = proto.splice;
        const unshift = proto.unshift;

        function adjustIndex(changeRecord: Splice, array: any[]): Splice {
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
        }

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
