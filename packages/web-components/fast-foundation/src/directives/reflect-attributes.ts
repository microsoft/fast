import { Behavior, observable, Subscriber, Observable } from "@microsoft/fast-element";
import { SubscriberSet } from "@microsoft/fast-element";
import { AttachedBehaviorHTMLDirective } from "@microsoft/fast-element";
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
    }

    public unbind(source: any): void {
        AttributeReflectionSubscriptionSet.getOrCreateFor(source).unsubscribe(this);
    }

    public handleChange(source: HTMLElement, arg: string): void {
        // In cases where two or more ReflectAttrBehavior instances are bound to the same element,
        // the will share a Subscriber implementation. In that case, this handle change can be invoked with for
        // attributes an instances doesn't need to reflect. This guards against reflecting attrs
        // that shouldn't be reflected.
        if (this.attributes.includes(arg)) {
            const value = source.getAttribute(arg);
            value === null
                ? this.target.removeAttribute(arg)
                : this.target.setAttribute(arg, value);
        }
    }
}

export function reflectAttributes<T = any>(...attributes: string[]): CaptureType<T> {
    return new AttachedBehaviorHTMLDirective(
        "fast-reflect-attr",
        ReflectAttrBehavior,
        attributes
    );
}
