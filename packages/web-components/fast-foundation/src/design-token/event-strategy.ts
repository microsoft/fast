import type { FASTElement, HostController } from "@microsoft/fast-element";
import type { DesignTokenResolutionStrategy } from "./fast-design-token.js";

const parentLocatorEventName = "$$designToken__locate__parent$$";
const containsEventName = "$$designToken__contains$$";
type ParentLocatorEvent = CustomEvent<{ parent: FASTElement | null }>;
type ContainsEvent = CustomEvent<{ contains: boolean }>;
function parentLocatorHandler(event: ParentLocatorEvent) {
    if (event.target !== this) {
        event.detail.parent = this;
        event.stopImmediatePropagation();
    }
}

function containsHandler(event: ContainsEvent) {
    if (event.detail !== this) {
        event.detail.contains = true;
        event.stopImmediatePropagation();
    }
}

/**
 * A DesignToken resolution strategy that uses custom events to resolve
 * node hierarchies.
 *
 * @public
 */
export const DesignTokenEventResolutionStrategy: DesignTokenResolutionStrategy = {
    addedCallback(controller: HostController<FASTElement>) {
        controller.source.addEventListener(parentLocatorEventName, parentLocatorHandler);
    },
    removedCallback(controller: HostController<FASTElement>) {
        controller.source.removeEventListener(
            parentLocatorEventName,
            parentLocatorHandler
        );
    },
    contains(parent, child): boolean {
        parent.addEventListener(containsEventName, containsHandler);
        const event = new CustomEvent(containsEventName, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { contains: false },
        });
        child.dispatchEvent(event);
        parent.removeEventListener(containsEventName, containsHandler);
        return event.detail.contains;
    },
    parent(element): FASTElement | null {
        const event: ParentLocatorEvent = new CustomEvent(parentLocatorEventName, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { parent: null },
        });
        element.dispatchEvent(event);

        return event.detail.parent;
    },
};
