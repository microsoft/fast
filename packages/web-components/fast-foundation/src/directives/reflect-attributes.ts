import {
    AttachedBehaviorHTMLDirective,
    Behavior,
    Subscriber,
    SubscriberSet,
    DOM,
} from "@microsoft/fast-element";
import type { CaptureType } from "@microsoft/fast-element";

const observer = new MutationObserver((mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
        AttributeReflectionSubscriptionSet.getOrCreateFor(mutation.target).notify(
            mutation.attributeName
        );
    }
});
class AttributeReflectionSubscriptionSet extends SubscriberSet {
    private static subscriberCache: WeakMap<
        any,
        AttributeReflectionSubscriptionSet
    > = new WeakMap();
    private watchedAttributes: Set<Readonly<string[]>> = new Set();

    public subscribe(subscriber: Subscriber & ReflectAttrBehavior) {
        super.subscribe(subscriber);
        if (!this.watchedAttributes.has(subscriber.attributes)) {
            this.watchedAttributes.add(subscriber.attributes);
            this.observe();
        }
    }

    constructor(source: any) {
        super(source);

        AttributeReflectionSubscriptionSet.subscriberCache.set(source, this);
    }

    public unsubscribe(subscriber: Subscriber & ReflectAttrBehavior) {
        super.unsubscribe(subscriber);
        if (this.watchedAttributes.has(subscriber.attributes)) {
            this.watchedAttributes.delete(subscriber.attributes);
            this.observe();
        }
    }

    public static getOrCreateFor(source: any) {
        return (
            this.subscriberCache.get(source) ||
            new AttributeReflectionSubscriptionSet(source)
        );
    }

    private observe() {
        const attributeFilter: string[] = [];
        for (const attributes of this.watchedAttributes.values()) {
            for (let i = 0; i < attributes.length; i++) {
                attributeFilter.push(attributes[i]);
            }
        }

        observer.observe(this.source, { attributeFilter });
    }
}

class ReflectAttrBehavior implements Behavior {
    /**
     * The attributes the behavior is reflecting
     */
    public attributes: Readonly<string[]>;
    constructor(private target: HTMLElement, attributes: string[]) {
        this.attributes = Object.freeze(attributes);
    }

    public bind(source: HTMLElement): void {
        AttributeReflectionSubscriptionSet.getOrCreateFor(source).subscribe(this);

        // Reflect any existing attributes because MutationObserver will only
        // handle *changes* to attributes.
        if (source.hasAttributes()) {
            for (let i = 0; i < source.attributes.length; i++) {
                this.handleChange(source, source.attributes[i].name);
            }
        }
    }

    public unbind(source: any): void {
        AttributeReflectionSubscriptionSet.getOrCreateFor(source).unsubscribe(this);
    }

    public handleChange(source: HTMLElement, arg: string): void {
        // In cases where two or more ReflectAttrBehavior instances are bound to the same element,
        // they will share a Subscriber implementation. In that case, this handle change can be invoked with
        // attributes an instances doesn't need to reflect. This guards against reflecting attrs
        // that shouldn't be reflected.
        if (this.attributes.includes(arg)) {
            DOM.setAttribute(this.target, arg, source.getAttribute(arg));
        }
    }
}

/**
 * Reflects attributes from the host element to the target element of the directive.
 * @param attributes - The attributes to reflect
 *
 * @beta
 * @example
 * ```ts
 * const template = html`
 *     <button
 *         ${reflectAttributes("aria-label", "aria-describedby")}
 *     >
 *          hello world
 *     </button
 * `
 * ```
 */
export function reflectAttributes<T = any>(...attributes: string[]): CaptureType<T> {
    return new AttachedBehaviorHTMLDirective(
        "fast-reflect-attr",
        ReflectAttrBehavior,
        attributes
    );
}
