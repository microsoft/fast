import { ArrayObserver } from "./index.debug.js";
import { Disposable, isFunction } from "./interfaces.js";
import type { Notifier, Subscriber } from "./observation/notifier.js";
import { Observable } from "./observation/observable.js";

interface ObjectVisitor<TVisitorData> {
    visitObject(object: any, data: TVisitorData): void;
    visitArray(array: any[], data: TVisitorData): void;
    visitProperty(object: any, key: PropertyKey, value: any, data: TVisitorData): void;
}

function shouldTraverse(value: any, traversed: WeakSet<any> | Set<any>) {
    return (
        value !== null &&
        value !== void 0 &&
        typeof value === "object" &&
        !traversed.has(value)
    );
}

function traverseObject<TVisitorData>(
    object: any,
    deep: boolean,
    visitor: ObjectVisitor<TVisitorData>,
    data: TVisitorData,
    traversed: WeakSet<any> | Set<any>
): void {
    if (!shouldTraverse(object, traversed)) {
        return;
    }

    traversed.add(object);

    if (Array.isArray(object)) {
        visitor.visitArray(object, data);

        for (const item of object) {
            traverseObject(item, deep, visitor, data, traversed);
        }
    } else {
        visitor.visitObject(object, data);

        for (const key in object) {
            const value = object[key];
            visitor.visitProperty(object, key, value, data);

            if (deep) {
                traverseObject(value, deep, visitor, data, traversed);
            }
        }
    }
}

const noop = () => void 0;
const observed = new WeakSet<any>();

const makeObserverVisitor: ObjectVisitor<undefined> = {
    visitObject: noop,
    visitArray: noop,
    visitProperty(object: any, propertyName: string, value: any): void {
        Reflect.defineProperty(object, propertyName, {
            enumerable: true,
            get() {
                Observable.track(object, propertyName);
                return value;
            },
            set(newValue: any) {
                if (value !== newValue) {
                    value = newValue;
                    Observable.notify(object, propertyName);
                }
            },
        });
    },
};

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
 * Converts a plain object to an observable object.
 * @param object - The object to make observable.
 * @param deep - Indicates whether or not to deeply convert the oject.
 * @returns The converted object.
 * @beta
 */
export function makeObservable<T>(object: T, deep = false): T {
    traverseObject(object, deep, makeObserverVisitor, void 0, observed);
    return object;
}

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
    traverseObject(object, true, watchVisitor, data, new Set());

    return {
        dispose() {
            for (const n of data.notifiers) {
                n.unsubscribe(data.subscriber);
            }
        },
    };
}

/**
 * Retrieves the "composed parent" element of a node, ignoring DOM tree boundaries.
 * When the parent of a node is a shadow-root, it will return the host
 * element of the shadow root. Otherwise it will return the parent node or null if
 * no parent node exists.
 * @param element - The element for which to retrieve the composed parent
 *
 * @public
 */
export function composedParent<T extends HTMLElement>(element: T): HTMLElement | null {
    const parentNode = element.parentElement;

    if (parentNode) {
        return parentNode;
    } else {
        const rootNode = element.getRootNode();

        if ((rootNode as ShadowRoot).host instanceof HTMLElement) {
            // this is shadow-root
            return (rootNode as ShadowRoot).host as HTMLElement;
        }
    }

    return null;
}

/**
 * Determines if the reference element contains the test element in a "composed" DOM tree that
 * ignores shadow DOM boundaries.
 *
 * Returns true of the test element is a descendent of the reference, or exist in
 * a shadow DOM that is a logical descendent of the reference. Otherwise returns false.
 * @param reference - The element to test for containment against.
 * @param test - The element being tested for containment.
 *
 * @public
 */
export function composedContains(reference: HTMLElement, test: HTMLElement): boolean {
    let current: HTMLElement | null = test;

    while (current !== null) {
        if (current === reference) {
            return true;
        }

        current = composedParent(current);
    }

    return false;
}
