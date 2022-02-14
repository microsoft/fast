import { DOM } from "../dom.js";
import { Splice } from "./array-change-records.js";
import { SubscriberSet } from "./notifier.js";
import type { Notifier } from "./notifier.js";
import { Observable } from "./observable.js";

function adjustIndex(changeRecord: Splice, array: any[]): Splice {
    let index = changeRecord.index;
    const arrayLength = array.length;

    if (index > arrayLength) {
        index = arrayLength - changeRecord.addedCount;
    } else if (index < 0) {
        index =
            arrayLength + changeRecord.removed.length + index - changeRecord.addedCount;
    }

    changeRecord.index = index < 0 ? 0 : index;
    return changeRecord;
}

class ArrayObserver extends SubscriberSet {
    private oldCollection: any[] | undefined = void 0;
    private splices: Splice[] | undefined = void 0;
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

        this.notify(Splice.normalize(oldCollection, this.subject, splices));
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
            o.addSplice(new Splice(this.length, [result], 0));
        }

        return result;
    },

    push() {
        const result = push.apply(this, arguments);
        const o = this.$fastController as ArrayObserver;

        if (o !== void 0) {
            o.addSplice(
                adjustIndex(
                    new Splice(this.length - arguments.length, [], arguments.length),
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
            o.addSplice(new Splice(0, [result], 0));
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
                    new Splice(
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
            o.addSplice(adjustIndex(new Splice(0, [], arguments.length), this));
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
