import { Observable } from "../observation/observable.js";
import { Updates } from "../observation/update-queue.js";

interface InternalsElement extends HTMLElement {
    elementInternals?: ElementInternals;
}

/**
 * Decorator: Defines an observable property with a custom setter for writing the custom CSS state value.
 *
 * @alpha
 * @remarks If [elementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) has not been manually attached to the target, this decorator will attach it automatically.
 * @param target - The target that the property is defined on.
 * @param propertyName - The name of the property on the target.
 */
export function cssState(target: InternalsElement, propertyName: string): void {
    const fieldName = `_${propertyName}`;
    if (!target.elementInternals) {
        const connectedCallback = Reflect.get(target, "connectedCallback");
        Reflect.defineProperty(target, "connectedCallback", {
            value: function () {
                this.elementInternals = this.attachInternals();
                Reflect.apply(connectedCallback, this, []);
            },
        });
    }

    Reflect.defineProperty(target, propertyName, {
        enumerable: true,
        get: function () {
            Observable.track(this, propertyName);
            return this[fieldName];
        },
        set(value: boolean) {
            this[fieldName] = value;
            Updates.enqueue(() => {
                if (value) {
                    this.elementInternals.states.add(propertyName);
                } else {
                    this.elementInternals.states.delete(propertyName);
                }
            });

            Observable.notify(this, propertyName);
        },
    });
}
