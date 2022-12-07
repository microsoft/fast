import type { ElementViewTemplate } from "../index.js";
import { UnobservableMutationObserver } from "../utilities.js";
import { ElementController, Stages } from "./element-controller.js";

const deferHydrationAttribute = "defer-hydration";
const hydrationID = Symbol();

/**
 * An ElementController capable of hydrating FAST elements from
 * Declarative Shadow DOM.
 *
 * @beta
 */
export class HydratableElementController<
    TElement extends HTMLElement = HTMLElement
> extends ElementController<TElement> {
    public readonly [hydrationID] = hydrationID;
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
            return;
        }

        if (this.stage !== Stages.disconnected) {
            return;
        }

        this.stage = Stages.connecting;

        if (this.needsInitialization) {
            // hydrate template
            if (this.template) {
                this.hydrateView(this.template);
            }

            this.addStyles(this.mainStyles);
            this.needsInitialization = false;
        } else if (this.view !== null) {
            this.view.bind(this.source);
        }
    }

    public disconnect() {
        super.disconnect();
        HydratableElementController.hydrationObserver.unobserve(this.source);
    }

    public static install() {
        ElementController.setStrategy(HydratableElementController);
    }

    private hydrateView(template: ElementViewTemplate): void {}
}
