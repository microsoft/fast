import { Callable } from "./interfaces";

export const DOM = {
    pendingUpdates: [] as Callable[],

    createTextMarker() {
        const marker = document.createElement("fm");
        this.makeIntoInstructionTarget(marker);
        return marker;
    },

    isMarker(node: HTMLElement): boolean {
        return node.tagName === "TEMPLATE" && node.className === "fph";
    },

    makeIntoInstructionTarget(element: HTMLElement) {
        const value = element.getAttribute("class");
        element.setAttribute("class", value ? value + " fm" : "fm");
    },

    convertMarkerToLocation(marker: Node): Node {
        const next = marker.nextSibling! as Node;
        marker.parentNode!.removeChild(marker);
        return next;
    },

    createInterpolationPlaceholder(instructionIndex: number) {
        return `@{${instructionIndex}}`;
    },

    createLocation() {
        return document.createComment("");
    },

    createLocationPlaceholder(instructionIndex: number) {
        return `<template i="${instructionIndex}" class="fph"></template><!---->`;
    },

    queueUpdate(callable: Callable) {
        if (this.pendingUpdates.length < 1) {
            window.requestAnimationFrame(processQueue);
        }

        this.pendingUpdates.push(callable);
    },
};

function processQueue() {
    const queue = DOM.pendingUpdates;
    const capacity = 1024;
    let index = 0;

    while (index < queue.length) {
        const task = queue[index];
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
                let scan = 0, newLength = queue.length - index;
                scan < newLength;
                scan++
            ) {
                queue[scan] = queue[scan + index];
            }

            queue.length -= index;
            index = 0;
        }
    }

    queue.length = 0;
}
