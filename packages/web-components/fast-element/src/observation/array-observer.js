import { DOM } from "../dom";
import { calcSplices, newSplice, projectArraySplices } from "./array-change-records";
import { SubscriberSet } from "./notifier";
import { Observable } from "./observable";
let arrayObservationEnabled = false;
function adjustIndex(changeRecord, array) {
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
    constructor(source) {
        super(source);
        this.oldCollection = void 0;
        this.splices = void 0;
        this.needsQueue = true;
        this.call = this.flush;
        source.$fastController = this;
    }
    addSplice(splice) {
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
    reset(oldCollection) {
        this.oldCollection = oldCollection;
        if (this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
        }
    }
    flush() {
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
                ? projectArraySplices(this.source, splices)
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
export function enableArrayObservation() {
    if (arrayObservationEnabled) {
        return;
    }
    arrayObservationEnabled = true;
    Observable.setArrayObserverFactory(collection => {
        return new ArrayObserver(collection);
    });
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
        const methodCallResult = pop.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(this.length, [methodCallResult], 0));
        }
        return methodCallResult;
    };
    arrayProto.push = function () {
        const methodCallResult = push.apply(this, arguments);
        const o = this.$fastController;
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
        const o = this.$fastController;
        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }
        const methodCallResult = reverse.apply(this, arguments);
        if (o !== void 0) {
            o.reset(oldArray);
        }
        return methodCallResult;
    };
    arrayProto.shift = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = shift.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(0, [methodCallResult], 0));
        }
        return methodCallResult;
    };
    arrayProto.sort = function () {
        let oldArray;
        const o = this.$fastController;
        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }
        const methodCallResult = sort.apply(this, arguments);
        if (o !== void 0) {
            o.reset(oldArray);
        }
        return methodCallResult;
    };
    arrayProto.splice = function () {
        const methodCallResult = splice.apply(this, arguments);
        const o = this.$fastController;
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
        const methodCallResult = unshift.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(0, [], arguments.length), this));
        }
        return methodCallResult;
    };
}
/* eslint-enable prefer-rest-params */
/* eslint-enable @typescript-eslint/explicit-function-return-type */
