import { Observable } from "./observation/observable.js";

/**
 * Options for converting plain JS objects into observable objects.
 * @public
 */
export interface ObservableCreateOptions {
    /**
     * Indicates whether or not to deeply convert the object,
     * following properties, sub-objects, arrays, and their items.
     */
    deep?: boolean;
}

const defaultCreateOptions: ObservableCreateOptions = {};

function eligibleForTraversal(value: any, traversed: any[]) {
    return typeof value === "object" && traversed.indexOf(value) === -1;
}

function makeObservableProperty(
    object: any,
    propertyName: string,
    options: ObservableCreateOptions,
    traversed: any[]
) {
    const value = object[propertyName];
    Observable.defineProperty(object, propertyName);
    object[propertyName] = value;

    if (options.deep && eligibleForTraversal(value, traversed)) {
        makeObservableObject(value, options, traversed);
    }
}

function makeObservableObject<T>(
    object: T,
    options: ObservableCreateOptions,
    traversed: any[]
): T {
    if (object === null || object === void 0) {
        return object;
    }

    traversed.push(object);

    if (Array.isArray(object)) {
        for (const item of object) {
            if (eligibleForTraversal(item, traversed)) {
                makeObservableObject(item, options, traversed);
            }
        }
    } else {
        for (const key in object) {
            makeObservableProperty(object, key, options, traversed);
        }
    }

    return object;
}

/**
 * Converts a plain object to an observable object.
 * @param object - The object to make observable.
 * @param options - Specifies how to convert the object.
 * @returns The same object passed as an argument, but made observable.
 * @public
 */
export function makeObservable<T>(
    object: T,
    options: ObservableCreateOptions = defaultCreateOptions
): T {
    return makeObservableObject(object, options, []);
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
