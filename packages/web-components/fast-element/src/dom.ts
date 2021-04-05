import type { Callable } from "./interfaces";
import { $global, TrustedTypesPolicy } from "./platform";

const updateQueue = [] as Callable[];

/* eslint-disable */
const fastHTMLPolicy: TrustedTypesPolicy = $global.trustedTypes.createPolicy(
    "fast-html",
    {
        createHTML: html => html,
    }
);
/* eslint-enable */

let htmlPolicy: TrustedTypesPolicy = fastHTMLPolicy;

function processQueue(): void {
    const capacity = 1024;
    let index = 0;

    while (index < updateQueue.length) {
        const task = updateQueue[index];
        (task as any).call();
        index++;

        // Prevent leaking memory for long chains of recursive calls to `queueMicroTask`.
        // If we call `queueMicroTask` within a MicroTask scheduled by `queueMicroTask`, the queue will
        // grow, but to avoid an O(n) walk for every MicroTask we execute, we don't
        // shift MicroTasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 MicroTasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (
                let scan = 0, newLength = updateQueue.length - index;
                scan < newLength;
                scan++
            ) {
                updateQueue[scan] = updateQueue[scan + index];
            }

            updateQueue.length -= index;
            index = 0;
        }
    }

    updateQueue.length = 0;
}

const marker = `fast-${Math.random().toString(36).substring(2, 8)}`;

/** @internal */
export const _interpolationStart = `${marker}{`;

/** @internal */
export const _interpolationEnd = `}${marker}`;

/**
 * Common DOM APIs.
 * @public
 */
export const DOM = Object.freeze({
    /**
     * Indicates whether the DOM supports the adoptedStyleSheets feature.
     */
    supportsAdoptedStyleSheets:
        Array.isArray((document as any).adoptedStyleSheets) &&
        "replace" in CSSStyleSheet.prototype,

    /**
     * Sets the HTML trusted types policy used by the templating engine.
     * @param policy - The policy to set for HTML.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    setHTMLPolicy(policy: TrustedTypesPolicy) {
        if (htmlPolicy !== fastHTMLPolicy) {
            throw new Error("The HTML policy can only be set once.");
        }

        htmlPolicy = policy;
    },

    /**
     * Turns a string into trusted HTML using the configured trusted types policy.
     * @param html - The string to turn into trusted HTML.
     * @remarks
     * Used internally by the template engine when creating templates
     * and setting innerHTML.
     */
    createHTML(html: string): string {
        return htmlPolicy.createHTML(html);
    },

    /**
     * Determines if the provided node is a template marker used by the runtime.
     * @param node - The node to test.
     */
    isMarker(node: Node): node is Comment {
        return node && node.nodeType === 8 && (node as Comment).data.startsWith(marker);
    },

    /**
     * Given a marker node, extract the {@link HTMLDirective} index from the placeholder.
     * @param node - The marker node to extract the index from.
     */
    extractDirectiveIndexFromMarker(node: Comment): number {
        return parseInt(node.data.replace(`${marker}:`, ""));
    },

    /**
     * Creates a placeholder string suitable for marking out a location *within*
     * an attribute value or HTML content.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by binding directives.
     */
    createInterpolationPlaceholder(index: number): string {
        return `${_interpolationStart}${index}${_interpolationEnd}`;
    },

    /**
     * Creates a placeholder that manifests itself as an attribute on an
     * element.
     * @param attributeName - The name of the custom attribute.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
     */
    createCustomAttributePlaceholder(attributeName: string, index: number) {
        return `${attributeName}="${this.createInterpolationPlaceholder(index)}"`;
    },

    /**
     * Creates a placeholder that manifests itself as a marker within the DOM structure.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by structural directives such as `repeat`.
     */
    createBlockPlaceholder(index: number) {
        return `<!--${marker}:${index}-->`;
    },

    /**
     * Schedules DOM update work in the next async batch.
     * @param callable - The callable function or object to queue.
     */
    queueUpdate(callable: Callable) {
        if (updateQueue.length < 1) {
            window.requestAnimationFrame(processQueue);
        }

        updateQueue.push(callable);
    },

    /**
     * Resolves with the next DOM update.
     */
    nextUpdate(): Promise<void> {
        return new Promise((resolve: () => void) => {
            DOM.queueUpdate(resolve);
        });
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
        if (value === null || value === undefined) {
            element.removeAttribute(attributeName);
        } else {
            element.setAttribute(attributeName, value);
        }
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

    /**
     * Removes all the child nodes of the provided parent node.
     * @param parent - The node to remove the children from.
     */
    removeChildNodes(parent: Node) {
        for (let child = parent.firstChild; child !== null; child = parent.firstChild) {
            parent.removeChild(child);
        }
    },

    /**
     * Creates a TreeWalker configured to walk a template fragment.
     * @param fragment - The fragment to walk.
     */
    createTemplateWalker(fragment: DocumentFragment): TreeWalker {
        return document.createTreeWalker(
            fragment,
            133, // element, text, comment
            null,
            false
        );
    },
});
