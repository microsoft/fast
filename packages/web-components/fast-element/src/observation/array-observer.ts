import { DOM } from "../dom.js";
import { Observable } from "./observable.js";
import { SubscriberCollection } from "./notifier.js";
import {
    calcSplices,
    newSplice,
    projectArraySplices,
    Splice,
} from "./array-change-records.js";

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

export class ArrayObserver extends SubscriberCollection {
    private collection: any[];
    private oldCollection: any[] | undefined = void 0;
    private splices: any[] | undefined = void 0;
    private needsQueue: boolean = true;
    call: () => void = this.flush;

    constructor(collection: any[]) {
        super();
        (collection as any).$fastController = this;
        this.collection = collection;
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
                ? projectArraySplices(this.collection, splices!)
                : calcSplices(
                      this.collection,
                      0,
                      this.collection.length,
                      oldCollection,
                      0,
                      oldCollection.length
                  );

        this.notify(this, finalSplices);
    }
}

/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export function enableArrayObservation(): void {
    if (arrayObservationEnabled) {
        return;
    }

    arrayObservationEnabled = true;

    Observable.createArrayObserver = (collection: any[]): ArrayObserver => {
        return new ArrayObserver(collection);
    };

    const arrayProto = Array.prototype;
    const pop = arrayProto.pop;
    const push = arrayProto.push;
    const reverse = arrayProto.reverse;
    const shift = arrayProto.shift;
    const sort = arrayProto.sort;
    const splice = arrayProto.splice;
    const unshift = arrayProto.unshift;

    arrayProto.pop = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = pop.apply(this, arguments as any);
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(this.length, [methodCallResult], 0));
        }

        return methodCallResult;
    };

    arrayProto.push = function () {
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

    arrayProto.reverse = function () {
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

    arrayProto.shift = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = shift.apply(this, arguments as any);
        const o = (this as any).$fastController as ArrayObserver;

        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(0, [methodCallResult], 0));
        }

        return methodCallResult;
    };

    arrayProto.sort = function () {
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

    arrayProto.splice = function () {
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

    arrayProto.unshift = function () {
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
