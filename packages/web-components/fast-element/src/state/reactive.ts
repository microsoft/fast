import { noop } from "../interfaces.js";
import { Observable } from "../observation/observable.js";
import { ObjectVisitor, visitObject } from "./visitor.js";

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

/**
 * Converts a plain object to a reactive, observable object.
 * @param object - The object to make reactive.
 * @param deep - Indicates whether or not to deeply convert the oject.
 * @returns The converted object.
 * @beta
 */
export function reactive<T>(object: T, deep = false): T {
    visitObject(object, deep, makeObserverVisitor, void 0, observed);
    return object;
}
