import { Observable } from "./observable";
import { SubscriberCollection } from "./subscriber-collection";
import { Notifier } from "./notifier";
import { DOM } from "../dom";
import {
    projectArraySplices,
    calcSplices,
    Splice,
    newSplice,
} from "./array-change-records";

let arrayObservationEnabled = false;

export function enableArrayObservation() {
    if (arrayObservationEnabled) {
        return;
    }

    arrayObservationEnabled = true;

    Observable.createArrayObserver = (collection: any[]) => {
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

    arrayProto.pop = function() {
        const notEmpty = this.length > 0;
        const methodCallResult = pop.apply(this, arguments as any);
        const o = (this as any).$controller as ArrayObserver;

        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(this.length, [methodCallResult], 0));
        }

        return methodCallResult;
    };

    arrayProto.push = function() {
        const methodCallResult = push.apply(this, arguments as any);
        const o = (this as any).$controller as ArrayObserver;

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

    arrayProto.reverse = function() {
        let oldArray;
        const o = (this as any).$controller as ArrayObserver;

        if (o !== void 0) {
            o.notify();
            oldArray = this.slice();
        }

        const methodCallResult = reverse.apply(this, arguments as any);

        if (o !== void 0) {
            o.reset(oldArray);
        }

        return methodCallResult;
    };

    arrayProto.shift = function() {
        const notEmpty = this.length > 0;
        const methodCallResult = shift.apply(this, arguments as any);
        const o = (this as any).$controller as ArrayObserver;

        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(0, [methodCallResult], 0));
        }

        return methodCallResult;
    };

    arrayProto.sort = function() {
        let oldArray;
        const o = (this as any).$controller as ArrayObserver;

        if (o !== void 0) {
            o.notify();
            oldArray = this.slice();
        }

        const methodCallResult = sort.apply(this, arguments as any);

        if (o !== void 0) {
            o.reset(oldArray);
        }

        return methodCallResult;
    };

    arrayProto.splice = function() {
        const methodCallResult = splice.apply(this, arguments as any);
        const o = (this as any).$controller as ArrayObserver;

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

    arrayProto.unshift = function() {
        const methodCallResult = unshift.apply(this, arguments as any);
        const o = (this as any).$controller as ArrayObserver;

        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(0, [], arguments.length), this));
        }

        return methodCallResult;
    };
}

function adjustIndex(changeRecord: Splice, array: any[]) {
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

export class ArrayObserver extends SubscriberCollection implements Notifier {
    private collection: any[];
    private oldCollection: any[] | undefined = void 0;
    private splices: any[] | undefined = void 0;
    private needsQueue = true;

    subscribe = this.addSubscriber;
    unsubscribe = this.removeSubscriber;

    constructor(collection: any[]) {
        super();
        (collection as any).$controller = this;
        this.collection = collection;
    }

    addSplice(splice: Splice) {
        if (this.hasSubscribers()) {
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
    }

    reset(oldCollection: any[] | undefined) {
        this.oldCollection = oldCollection;

        if (this.hasSubscribers() && this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
        }
    }

    notify() {
        if (this.splices !== void 0 || this.oldCollection !== void 0) {
            this.call();
        }
    }

    call() {
        const splices = this.splices;
        const oldCollection = this.oldCollection;

        this.needsQueue = true;
        this.splices = void 0;
        this.oldCollection = void 0;

        if (this.hasSubscribers()) {
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

            this.notifySubscribers(this, finalSplices);
        }
    }
}
