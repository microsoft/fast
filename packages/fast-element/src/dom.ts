import { Message, TrustedTypesPolicy } from "./interfaces.js";
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
export type DOMAspect = (typeof DOMAspect)[Exclude<keyof typeof DOMAspect, "none">];

/**
 * A function used to send values to a DOM sink.
 * @public
 */
export type DOMSink = (
    target: Node,
    aspectName: string,
    value: any,
    ...args: any[]
) => void;

/**
 * A security policy that FAST can use to interact with the DOM.
 * @public
 */
export interface DOMPolicy {
    /**
     * Creates safe HTML from the provided value.
     * @param value - The source to convert to safe HTML.
     */
    createHTML(value: string): string;

    /**
     * Protects a DOM sink that intends to write to the DOM.
     * @param tagName - The tag name for the element to write to.
     * @param aspect - The aspect of the DOM to write to.
     * @param aspectName - The name of the aspect to write to.
     * @param sink - The sink that is used to write to the DOM.
     */
    protect(
        tagName: string | null,
        aspect: DOMAspect,
        aspectName: string,
        sink: DOMSink
    ): DOMSink;
}

const createHTML = html => html;
const fastTrustedType: TrustedTypesPolicy = globalThis.trustedTypes
    ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML })
    : { createHTML };

let defaultPolicy: DOMPolicy = Object.freeze({
    createHTML(value: string): string {
        return fastTrustedType.createHTML(value);
    },

    protect(
        tagName: string | null,
        aspect: DOMAspect,
        aspectName: string,
        sink: DOMSink
    ): DOMSink {
        return sink;
    },
});

const fastPolicy = defaultPolicy;

/**
 * Common DOM APIs.
 * @public
 */
export const DOM = Object.freeze({
    /**
     * Gets the dom policy used by the templating system.
     */
    get policy(): DOMPolicy {
        return defaultPolicy;
    },

    /**
     * Sets the dom policy used by the templating system.
     * @param policy - The policy to set.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    setPolicy(value: DOMPolicy): void {
        if (defaultPolicy !== fastPolicy) {
            throw FAST.error(Message.onlySetDOMPolicyOnce);
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
    setAttribute(element: HTMLElement, attributeName: string, value: any): void {
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
    setBooleanAttribute(
        element: HTMLElement,
        attributeName: string,
        value: boolean
    ): void {
        value
            ? element.setAttribute(attributeName, "")
            : element.removeAttribute(attributeName);
    },
});
