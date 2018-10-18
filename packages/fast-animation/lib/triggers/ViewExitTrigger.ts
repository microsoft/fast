import isElementInView from "../utilities/isElementInView";
import ScrollBase, { ScrollTriggerSubscription } from "./ScrollBase";

/**
 * Utility for registering element/callback pairs where the callback will be called when the element exits the view-port
 */
export default class ViewExitTrigger extends ScrollBase {
    /**
     * Check if elements are in view-port and apply scroll method if they are
     */
    protected update(): void {
        super.update();

        this.subscriptions.forEach(
            (subscription: ScrollTriggerSubscription, index: number) => {
                const inView: boolean = isElementInView(subscription.element);

                // If the element is out of view but previously was in view
                if (!inView && subscription.inView) {
                    subscription.callback(this.scrollDistance);
                }

                if (inView !== subscription.inView) {
                    subscription.inView = inView;
                }
            }
        );
    }
}
