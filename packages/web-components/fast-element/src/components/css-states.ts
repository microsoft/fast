import { type Accessor, Observable } from "../observation/observable.js";
import { Updates } from "../observation/update-queue.js";
import type { FASTElement } from "./fast-element.js";

/**
 * Polyfill for CustomStateSet types until TypeScript adds the typings.
 *
 * @internal
 */
declare global {
    interface ElementInternals {
        states: Set<string>;
    }
}

/**
 * @internal
 */
export type InternalsElement = FASTElement & {
    elementInternals?: ElementInternals;
    [property: string]: any;
};

/**
 * An implementation of {@link Accessor} that supports reactivity, change callbacks, and applying CSS custom states.
 *
 * @internal
 */
export class CSSStateDefinition implements Accessor {
    private readonly fieldName: string;
    private readonly callbackName: string;
    private readonly hasCallback: boolean;
    private readonly stateName: string;

    /**
     * The class constructor that owns this state.
     */
    public readonly Owner: Function;

    /**
     * The name of the property associated with this state.
     */
    public readonly name: string;

    /**
     * Creates an instance of CSSStateDefinition.
     *
     * @param Owner - The class constructor that owns this state.
     * @param name - The name of the property associated with this state.
     */
    public constructor(Owner: Function, name: string) {
        this.Owner = Owner;
        this.name = name;
        this.fieldName = `_${name}`;
        this.callbackName = `${name}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;
        this.stateName = this.name.toLowerCase();
    }

    private ensureElementInternals(source: InternalsElement): void {
        if (!source.elementInternals) {
            source.elementInternals = source.attachInternals();
        }
    }

    /**
     * Sets the value of the property and sets the CSS custom state on the source element.
     *
     * @param source - The source element to access.
     * @param newValue - The value to set the property to.
     */
    public setValue(source: InternalsElement, newValue: boolean): void {
        this.ensureElementInternals(source);

        const oldValue = source[this.fieldName];

        if (oldValue !== newValue) {
            source[this.fieldName] = newValue;

            // wait until the DOM has settled before applying the state
            // in cases where the property's default value is already set to "true".
            Updates.enqueue(() => {
                if (newValue) {
                    source.elementInternals?.states.add(this.stateName);
                } else {
                    source.elementInternals?.states.delete(this.stateName);
                }
            });

            if (this.hasCallback) {
                source[this.callbackName](oldValue, newValue);
            }

            source.$fastController.notify(this.name);
        }
    }

    /**
     * Gets the value of the property on the source element.
     *
     * @param source - The source element to access.
     */
    public getValue(source: InternalsElement): boolean {
        Observable.track(source, this.name);
        return source[this.fieldName];
    }
}

/**
 * Decorator: Defines an observable boolean property that creates a CSS custom state on the target element.
 *
 * @alpha
 * @remarks If [elementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) has not been manually attached to the target, this decorator will attach it automatically.
 * @param target - The target that the property is defined on.
 * @param propertyName - The name of the property on the target.
 */
export function cssState(target: InternalsElement, propertyName: string): void {
    const state = new CSSStateDefinition(target.constructor, propertyName);

    Reflect.defineProperty(target, propertyName, {
        enumerable: true,
        get: function () {
            return state.getValue(this);
        },
        set(value: boolean) {
            state.setValue(this, value);
        },
    });
}
