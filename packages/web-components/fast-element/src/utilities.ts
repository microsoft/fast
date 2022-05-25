import { Disposable, isFunction } from "./interfaces.js";
import type { Notifier, Subscriber } from "./observation/notifier.js";
import { Observable } from "./observation/observable.js";

/**
 * Options for converting plain JS objects into observable objects.
 * @public
 */
export interface MakeObservableOptions {
    /**
     * Indicates whether or not to deeply convert the object,
     * following properties, sub-objects, arrays, and their items.
     */
    deep?: boolean;

    /**
     * Subscribes to all changes in the object graph.
     */
    subscriber?: Subscriber | ((subject: any, args: any) => void);
}

const defaultMakeObservableOptions: MakeObservableOptions = {};

function eligibleForTraversal(value: any, traversed: any[]) {
    return typeof value === "object" && traversed.indexOf(value) === -1;
}

function makeObservableProperty(
    object: any,
    propertyName: string,
    options: MakeObservableOptions,
    traversed: any[]
): void {
    const value = object[propertyName];
    Observable.defineProperty(object, propertyName);
    object[propertyName] = value;

    if (options.deep && eligibleForTraversal(value, traversed)) {
        visitObject(value, options, makeObservableProperty, traversed);
    }
}

function visitObject(
    object: any,
    options: MakeObservableOptions,
    propertyAction: (
        object: any,
        propertyName: string,
        options: MakeObservableOptions,
        traversed: any[]
    ) => void,
    traversed: any[],
    notifiers?: Notifier[]
): void {
    if (object === null || object === void 0) {
        return;
    }

    traversed.push(object);

    if (Array.isArray(object)) {
        for (const item of object) {
            if (eligibleForTraversal(item, traversed)) {
                visitObject(item, options, propertyAction, traversed, notifiers);
            }
        }
    } else {
        for (const key in object) {
            propertyAction(object, key, options, traversed);
        }
    }

    if (options.subscriber) {
        const notifier = Observable.getNotifier(object);
        notifier.subscribe(options.subscriber as Subscriber);
        notifiers!.push(notifier);
    }
}

function visitAndSubscribe(
    object: any,
    options: MakeObservableOptions,
    propertyAction: (
        object: any,
        propertyName: string,
        options: MakeObservableOptions,
        traversed: any[]
    ) => void
) {
    if (isFunction(options.subscriber)) {
        options.subscriber = { handleChange: options.subscriber };
    }

    const notifiers: Notifier[] = [];
    visitObject(object, options, propertyAction, [], notifiers);

    return {
        dispose() {
            for (const n of notifiers) {
                n.unsubscribe(options!.subscriber as Subscriber);
            }
        },
    };
}

/**
 * Converts a plain object to an observable object.
 * @param object - The object to make observable.
 * @param options - Specifies how to convert the object.
 * @returns If a subscriber is passed, then a disposable object
 * is returned that enables unsubscribing from changes.
 * @public
 */
export function makeObservable(
    object: any,
    options?: MakeObservableOptions
): void | Disposable {
    options = options
        ? Object.assign({}, defaultMakeObservableOptions, options)
        : defaultMakeObservableOptions;

    if (options.subscriber) {
        return visitAndSubscribe(object, options, makeObservableProperty);
    }

    visitObject(object, options, makeObservableProperty, []);
}

/**
 * Deeply subscribes to existing observable objects.
 * @param object - The observable object to observe.
 * @param subscriber - The handler to call when changes are made to the object.
 */
export function deepObserve(
    object: any,
    subscriber?: Subscriber | ((subject: any, args: any) => void)
): Disposable {
    return visitAndSubscribe(object, { deep: true, subscriber }, () => void 0);
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
