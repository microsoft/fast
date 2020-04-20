import { Behavior, FASTElement } from "@microsoft/fast-element";
import { composedParent } from "../utilities";
import { DesignSystemProvider, isDesignSystemProvider } from "../design-system-provider";

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
export function findProvider(
    self: HTMLElement & Partial<DesignSystemConsumer>
): DesignSystemProvider | null {
    if (self.provider instanceof DesignSystemProvider) {
        return self.provider;
    }

    let parent = composedParent(self);

    while (parent !== null) {
        if (isDesignSystemProvider(parent)) {
            self.provider = parent as DesignSystemProvider;
            return parent;
        } else if ((parent as any).provider instanceof DesignSystemProvider) {
            self.provider = (parent as any).provider;
            return (parent as any).provider;
        } else {
            parent = composedParent(parent);
        }
    }

    return null;
}
