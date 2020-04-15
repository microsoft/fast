import { Behavior } from "@microsoft/fast-element";
import { composedParent } from "../utilities";
import { DesignSystemProvider } from "../design-system-provider";

export interface DesignSystemConsumer {
    provider: DesignSystemProvider | null;
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
 * @param self The element from which to begin
 */
export function findProvider(self: HTMLElement): DesignSystemProvider | null {
    let parent = composedParent(self);

    while (parent !== null) {
        if ((parent as any).isDesignSystemProvider) {
            return parent as any;
        } else {
            parent = composedParent(parent);
        }
    }

    return null;
}
