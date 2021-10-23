import { DOM } from "../dom";
import { calcSplices, newSplice, projectArraySplices } from "./array-change-records";
import type { Splice } from "./array-change-records";
import { SubscriberSet } from "./notifier";
import type { Notifier } from "./notifier";
import { Observable } from "./observable";

function adjustIndex(changeRecord: Splice, array: any[]): Splice {
    let index = changeRecord.index;
    const arrayLength = array.length;

    if (index > arrayLength) {
        index = arrayLength - changeRecord.addedCount;
    } else if (index < 0) {
        index =
            arrayLength + changeRecord.removed.length + index - changeRecord.addedCount;
    }

    if (index < 0) {
        index = 0;
    }

    changeRecord.index = index;
    return changeRecord;
}

class ArrayObserver extends SubscriberSet {
    private oldCollection: any[] | undefined = void 0;
    private splices: any[] | undefined = void 0;
    private needsQueue: boolean = true;
    call: () => void = this.flush;

    constructor(subject: any[]) {
        super(subject);
        (subject as any).$fastController = this;
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

        const finalSplices =
            oldCollection === void 0
                ? splices!.length > 1
                    ? projectArraySplices(this.subject, splices!)
                    : splices
                : calcSplices(
                      this.subject,
                      0,
                      this.subject.length,
                      oldCollection,
                      0,
                      oldCollection.length
                  );

        this.notify(finalSplices);
    }

    private enqueue() {
        if (this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
        }
    }
}

const proto = Array.prototype;
const pop = proto.pop;
const push = proto.push;
const reverse = proto.reverse;
const shift = proto.shift;
const sort = proto.sort;
const splice = proto.splice;
const unshift = proto.unshift;
const arrayOverrides = {
    pop() {
        const notEmpty = this.length > 0;
        const result = pop.apply(this, arguments);
        const o = this.$fastController as ArrayObserver;

        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(this.length, [result], 0));
        }

        return result;
    },

    push() {
        const result = push.apply(this, arguments);
        const o = this.$fastController as ArrayObserver;

        if (o !== void 0) {
            o.addSplice(
                adjustIndex(
                    newSplice(this.length - arguments.length, [], arguments.length),
                    this
                )
            );
        }

        return result;
    },

    reverse() {
        let oldArray;
        const o = this.$fastController as ArrayObserver;

        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }

        const result = reverse.apply(this, arguments);

        if (o !== void 0) {
            o.reset(oldArray);
        }

        return result;
    },

    shift() {
        const notEmpty = this.length > 0;
        const result = shift.apply(this, arguments);
        const o = this.$fastController as ArrayObserver;

        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(0, [result], 0));
        }

        return result;
    },

    sort() {
        let oldArray;
        const o = this.$fastController as ArrayObserver;

        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }

        const result = sort.apply(this, arguments);

        if (o !== void 0) {
            o.reset(oldArray);
        }

        return result;
    },

    splice() {
        const result = splice.apply(this, arguments);
        const o = this.$fastController as ArrayObserver;

        if (o !== void 0) {
            o.addSplice(
                adjustIndex(
                    newSplice(
                        +arguments[0],
                        result,
                        arguments.length > 2 ? arguments.length - 2 : 0
                    ),
                    this
                )
            );
        }

        return result;
    },

    unshift() {
        const result = unshift.apply(this, arguments);
        const o = this.$fastController as ArrayObserver;

        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(0, [], arguments.length), this));
        }

        return result;
    },
};

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
    if ((proto as any).$fastObservation) {
        return;
    }

    (proto as any).$fastObservation = true;

    Observable.setArrayObserverFactory(
        (collection: any[]): Notifier => {
            return new ArrayObserver(collection);
        }
    );

    Object.assign(proto, arrayOverrides);
}
/* eslint-enable prefer-rest-params */
/* eslint-enable @typescript-eslint/explicit-function-return-type */
