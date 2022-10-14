import { Updates } from "./observation/update-queue.js";
import { Callable, Message } from "./interfaces.js";
import { FAST } from "./platform.js";

/**
 * The type of HTML aspect to target.
 * @public
 */
export const DOMAspect = Object.freeze({
    /**
     * Not aspected.
     */
    none: 0 as const,

    /**
     * An attribute.
     */
    attribute: 1 as const,

    /**
     * A boolean attribute.
     */
    booleanAttribute: 2 as const,

    /**
     * A property.
     */
    property: 3 as const,

    /**
     * Content
     */
    content: 4 as const,

    /**
     * A token list.
     */
    tokenList: 5 as const,

    /**
     * An event.
     */
    event: 6 as const,
} as const);

/**
 * The type of HTML aspect to target.
 * @public
 */
export type DOMAspect = typeof DOMAspect[Exclude<keyof typeof DOMAspect, "none">];

export type DOMSink = (
    target: Node,
    aspectName: string,
    value: any,
    ...args: any[]
) => void;

export interface DOMPolicy {
    createHTML(value: string): string;
    protect<T extends DOMSink = DOMSink>(
        tagName: string | null,
        aspect: DOMAspect,
        aspectName: string,
        sink: T
    ): T;
}

let defaultPolicy: DOMPolicy = {
    createHTML(value: string): string {
        return value;
    },

    protect<T extends DOMSink = DOMSink>(
        tagName: string | null,
        aspect: DOMAspect,
        aspectName: string,
        sink: T
    ): T {
        return sink;
    },
};

const fastPolicy = defaultPolicy;

/**
 * Common DOM APIs.
 * @public
 */
export const DOM = Object.freeze({
    /**
     * @deprecated
     * Use Updates.enqueue().
     */
    queueUpdate: Updates.enqueue as (callable: Callable) => void,

    /**
     * @deprecated
     * Use Updates.next()
     */
    nextUpdate: Updates.next,

    /**
     * @deprecated
     * Use Updates.process()
     */
    processUpdates: Updates.process,

    get policy() {
        return defaultPolicy;
    },

    /**
     * Sets the security policy used by the templating system.
     * @param policy - The policy to set.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    set policy(value: DOMPolicy) {
        if (defaultPolicy !== fastPolicy) {
            // TODO: fix error message
            throw FAST.error(Message.onlySetHTMLPolicyOnce);
        }

        defaultPolicy = value;
    },

    /**
     * Sets an attribute value on an element.
     * @param element - The element to set the attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is `null` or `undefined`, the attribute is removed, otherwise
     * it is set to the provided value using the standard `setAttribute` API.
     */
    setAttribute(element: HTMLElement, attributeName: string, value: any) {
        value === null || value === undefined
            ? element.removeAttribute(attributeName)
            : element.setAttribute(attributeName, value);
    },

    /**
     * Sets a boolean attribute value.
     * @param element - The element to set the boolean attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is true, the attribute is added; otherwise it is removed.
     */
    setBooleanAttribute(element: HTMLElement, attributeName: string, value: boolean) {
        value
            ? element.setAttribute(attributeName, "")
            : element.removeAttribute(attributeName);
    },
});
