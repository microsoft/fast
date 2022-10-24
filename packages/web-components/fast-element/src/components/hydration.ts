import { UnobservableMutationObserver } from "../utilities.js";
import { ElementController } from "./element-controller.js";

const deferHydrationAttribute = "defer-hydration";

/**
 * An ElementController capable of hydrating FAST elements from
 * Declarative Shadow DOM.
 *
 * @beta
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

    public static install() {
        ElementController.setStrategy(HydratableElementController);
    }
}
