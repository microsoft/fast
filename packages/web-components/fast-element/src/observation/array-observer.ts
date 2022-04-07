import { DOM } from "../dom.js";
import { calcSplices, newSplice, projectArraySplices } from "./array-change-records.js";
import type { Splice } from "./array-change-records.js";
import { SubscriberSet } from "./notifier.js";
import type { Notifier } from "./notifier.js";
import { Observable } from "./observable.js";

let arrayObservationEnabled = false;

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

    constructor(source: any[]) {
        super(source);

        Reflect.defineProperty(source, "$fastController", {
            value: this,
            enumerable: false,
        });
    }

    public addSplice(splice: Splice): void {
        if (this.splices === void 0) {
            this.splices = [splice];
        } else {
            this.splices.push(splice);
        }

        if (this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
        }
    }

    public reset(oldCollection: any[] | undefined): void {
        this.oldCollection = oldCollection;

        if (this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
        }
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
                ? projectArraySplices(this.source, splices!)
                : calcSplices(
                      this.source,
                      0,
                      this.source.length,
                      oldCollection,
                      0,
                      oldCollection.length
                  );

        this.notify(finalSplices);
    }
}

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
    if (arrayObservationEnabled) {
        return;
    }

    arrayObservationEnabled = true;

    Observable.setArrayObserverFactory(
        (collection: any[]): Notifier => {
            return new ArrayObserver(collection);
        }
    );

    const proto = Array.prototype;

    // Don't patch Array if it has already been patched
    // by another copy of fast-element.
    if ((proto as any).$fastPatch) {
        return;
    }

    Reflect.defineProperty(proto, "$fastPatch", {
        value: 1,
        enumerable: false,
    });

    const pop = proto.pop;
    const push = proto.push;
    const reverse = proto.reverse;
    const shift = proto.shift;
    const sort = proto.sort;
    const splice = proto.splice;
    const unshift = proto.unshift;

    proto.pop = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = pop.apply(this, arguments as any);
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(this.length, [methodCallResult], 0));
        }

        return methodCallResult;
    };

    proto.push = function () {
        const methodCallResult = push.apply(this, arguments as any);
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0) {
            o.addSplice(
                adjustIndex(
                    newSplice(this.length - arguments.length, [], arguments.length),
                    this
                )
            );
        }

        return methodCallResult;
    };

    proto.reverse = function () {
        let oldArray;
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }

        const methodCallResult = reverse.apply(this, arguments as any);

        if (o !== void 0) {
            o.reset(oldArray);
        }

        return methodCallResult;
    };

    proto.shift = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = shift.apply(this, arguments as any);
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(0, [methodCallResult], 0));
        }

        return methodCallResult;
    };

    proto.sort = function () {
        let oldArray;
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }

        const methodCallResult = sort.apply(this, arguments as any);

        if (o !== void 0) {
            o.reset(oldArray);
        }

        return methodCallResult;
    };

    proto.splice = function () {
        const methodCallResult = splice.apply(this, arguments as any);
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0) {
            o.addSplice(
                adjustIndex(
                    newSplice(
                        +arguments[0],
                        methodCallResult,
                        arguments.length > 2 ? arguments.length - 2 : 0
                    ),
                    this
                )
            );
        }

        return methodCallResult;
    };

    proto.unshift = function () {
        const methodCallResult = unshift.apply(this, arguments as any);
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(0, [], arguments.length), this));
        }

        return methodCallResult;
    };
}
/* eslint-enable prefer-rest-params */
/* eslint-enable @typescript-eslint/explicit-function-return-type */
