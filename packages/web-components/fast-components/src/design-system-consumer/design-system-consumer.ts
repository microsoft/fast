import { Behavior } from "@microsoft/fast-element";
import { composedParent } from "../utilities";
import { DesignSystemProvider } from "../design-system-provider";
import { isDesignSystemProvider } from "../design-system-provider/is-design-system-provider";

export interface DesignSystemConsumer {
    provider: DesignSystemProvider | null;
}

/**
 * Determines if the element has a design-system-provider context
 * @param element
 */
export function isDesignSystemConsumer(
    element: HTMLElement | DesignSystemConsumer
): element is DesignSystemConsumer {
    const provider = (element as DesignSystemProvider).provider;
    return provider instanceof HTMLElement && isDesignSystemProvider(provider);
}

/**
 * Behavior to connect an element to the nearest design-system provider
 */
export class DesignSystemConsumerBehavior<T extends DesignSystemConsumer & HTMLElement>
    implements Behavior {
    bind(source: T) {
        source.provider = findProvider(source);
    }

    /* eslint-disable-next-line */
    unbind(source: T) {}
}

/**
 * Resolves the nearest DesignSystemProvider element to an element.
 *
 * When the provider is found, this function will store the provider on
 * the `self` so that it can quickly be retrieved by other future invocations
 * of this function.
 * @param self The element from which to begin
 */
export function findProvider(
    self: HTMLElement & Partial<DesignSystemConsumer>
): DesignSystemProvider | null {
    if (isDesignSystemConsumer(self)) {
        return self.provider;
    }

    let parent = composedParent(self);

    while (parent !== null) {
        if (isDesignSystemProvider(parent)) {
            self.provider = parent; // Store provider on ourselves for future reference
            return parent;
        } else if (isDesignSystemConsumer(parent)) {
            self.provider = parent.provider;
            return parent.provider;
        } else {
            parent = composedParent(parent);
        }
    }

    return null;
}
