import { Behavior } from "@microsoft/fast-element";
import { composedParent } from "../utilities";
import { DesignSystemProvider } from "../design-system-provider";

export interface DesignSystemConsumer {
    provider: DesignSystemProvider | null;
}

export class DesignSystemConsumerBehavior<T extends DesignSystemConsumer>
    implements Behavior {
    bind(source: T) {
        console.log("DesignSystemConsumerBehavior bound");
        source.provider = findProvider(source as any);
    }

    unbind(source: T) {
        console.log(source);
    }
}

/**
 * Type-safe checking for if an HTMLElement is a DesignSystemProvider.
 * @param el The element to test
 */
export function isDesignSystemProvider(
    el: HTMLElement | DesignSystemConsumer
): el is DesignSystemConsumer {
    return (el as any).isDesignSystemConsumer;
}

export function findProvider(host: HTMLElement): DesignSystemProvider | null {
    let parent = composedParent(host as any);

    while (parent !== null) {
        if ((parent as any).isDesignSystemProvider) {
            return parent as any;
        } else if (isDesignSystemProvider(parent)) {
            return parent.provider;
        } else {
            parent = composedParent(parent);
        }
    }

    return null;
}
