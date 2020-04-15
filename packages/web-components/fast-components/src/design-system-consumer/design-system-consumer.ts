import { Behavior } from "@microsoft/fast-element";
import { composedParent } from "../utilities";
import { DesignSystemProvider } from "../design-system-provider";

export interface DesignSystemConsumer {
    provider: DesignSystemProvider | null;
}

export class DesignSystemConsumerBehavior<T extends DesignSystemConsumer & HTMLElement>
    implements Behavior {
    bind(source: T) {
        source.provider = findProvider(source);
    }

    /* eslint-disable-next-line */
    unbind(source: T) {}
}

export function findProvider(host: HTMLElement): DesignSystemProvider | null {
    let parent = composedParent(host as any);

    while (parent !== null) {
        if ((parent as any).isDesignSystemProvider) {
            return parent as any;
        } else {
            parent = composedParent(parent);
        }
    }

    return null;
}
