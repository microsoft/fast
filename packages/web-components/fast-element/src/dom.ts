import { Callable } from "./interfaces.js";
const markerClass = `fast-${Math.random().toString(36).substring(7)}`;
const updateQueue = [] as Callable[];

type TrustedTypesPolicy = { createHTML(html: string): string };

// Tiny API-only polyfill for trustedTypes
/* eslint-disable */
if (globalThis.trustedTypes === void 0) {
    globalThis.trustedTypes = { createPolicy: (name, rules) => rules };
}

const fastHTMLPolicy: TrustedTypesPolicy = globalThis.trustedTypes.createPolicy(
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

export const DOM = Object.freeze({
    setHTMLPolicy(policy: TrustedTypesPolicy) {
        if (htmlPolicy !== fastHTMLPolicy) {
            throw new Error("The HTML policy can only be set once.");
        }

        htmlPolicy = policy;
    },

    createHTML(html: string): string {
        return htmlPolicy.createHTML(html);
    },

    isMarker(node: Node): node is Comment {
        return (
            node && node.nodeType === 8 && (node as Comment).data.startsWith(markerClass)
        );
    },

    extractDirectiveIndexFromMarker(node: Comment): number {
        return parseInt(node.data.replace(`${markerClass}:`, ""));
    },

    createInterpolationPlaceholder(index: number): string {
        return `@{${index}}`;
    },

    createCustomAttributePlaceholder(attributeName: string, index: number) {
        return `${attributeName}="${this.createInterpolationPlaceholder(index)}"`;
    },

    createBlockPlaceholder(index: number) {
        return `<!--${markerClass}:${index}-->`;
    },

    queueUpdate(callable: Callable) {
        if (updateQueue.length < 1) {
            window.requestAnimationFrame(processQueue);
        }

        updateQueue.push(callable);
    },

    setAttribute(element: HTMLElement, attributeName: string, value: any) {
        if (value === null || value === undefined) {
            element.removeAttribute(attributeName);
        } else {
            element.setAttribute(attributeName, value);
        }
    },

    setBooleanAttribute(element: HTMLElement, attributeName: string, value: boolean) {
        value
            ? element.setAttribute(attributeName, "")
            : element.removeAttribute(attributeName);
    },
});
