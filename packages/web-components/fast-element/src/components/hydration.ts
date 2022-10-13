import { UnobservableMutationObserver } from "../utilities.js";
import { ElementController, ElementControllerStrategy } from "./element-controller.js";

const deferHydrationAttribute = "defer-hydration";

/**
 * @internal
 */
export class HydratableElementController<
    TElement extends HTMLElement = HTMLElement
> extends ElementController<TElement> {
    private static hydrationObserver = new UnobservableMutationObserver(
        HydratableElementController.hydrationObserverHandler
    );

    private static hydrationObserverHandler(records: MutationRecord[]) {
        for (const record of records) {
            HydratableElementController.hydrationObserver.unobserve(record.target);
            (record.target as any).$fastController.connect();
        }
    }

    public connect() {
        if (this.source.hasAttribute(deferHydrationAttribute)) {
            HydratableElementController.hydrationObserver.observe(this.source, {
                attributeFilter: [deferHydrationAttribute],
            });
        } else {
            super.connect();
        }
    }

    public disconnect() {
        super.disconnect();
        HydratableElementController.hydrationObserver.unobserve(this.source);
    }
}

const hydratableElementControllerStrategy: ElementControllerStrategy = {
    create(element, definition) {
        return new HydratableElementController(element, definition);
    },
};

/**
 * Configures FAST to support component hydration deferal.
 *
 * @beta
 * @remarks
 * This feature is designed to support SSR rendering, which is
 * currently in beta. This feature is subject to change.
 */
export function addHydrationSupport() {
    ElementController.setStrategy(hydratableElementControllerStrategy);
}
