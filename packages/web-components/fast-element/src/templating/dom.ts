import { Updates } from "../observation/update-queue.js";
import type { Callable } from "../interfaces.js";

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
