import { Disposable, isFunction, noop } from "../interfaces.js";
import { ArrayObserver } from "../observation/arrays.js";
import type { Notifier, Subscriber } from "../observation/notifier.js";
import { Observable } from "../observation/observable.js";
import { ObjectVisitor, visitObject } from "./visitor.js";

interface WatchData {
    notifiers: Notifier[];
    subscriber: Subscriber;
}

function watchObject(object: any, data: WatchData) {
    const notifier = Observable.getNotifier(object);
    notifier.subscribe(data.subscriber);
    data.notifiers.push(notifier);
}

const watchVisitor: ObjectVisitor<WatchData> = {
    visitProperty: noop,
    visitObject: watchObject,
    visitArray: watchObject,
};

/**
 * Deeply subscribes to changes in existing observable objects.
 * @param object - The observable object to watch.
 * @param subscriber - The handler to call when changes are made to the object.
 * @returns A disposable that can be used to unsubscribe from change updates.
 * @beta
 */
export function watch(
    object: any,
    subscriber: Subscriber | ((subject: any, args: any) => void)
): Disposable {
    const data: WatchData = {
        notifiers: [],
        subscriber: isFunction(subscriber) ? { handleChange: subscriber } : subscriber,
    };

    ArrayObserver.enable();
    visitObject(object, true, watchVisitor, data, new Set());

    return {
        dispose() {
            for (const n of data.notifiers) {
                n.unsubscribe(data.subscriber);
            }
        },
    };
}
