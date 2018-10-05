import isElementInView from "../utilities/isElementInView";
import ScrollBase, { ScrollTriggerSubscription } from "./ScrollBase";

/**
 * Utility for registering element/callback pairs where the callback will be called on scroll while the element is in view.
 */
export default class ScrollTrigger extends ScrollBase {
    /**
     * Check if elements are in view-port and apply scroll method if they are
     */
    protected update(): void {
        super.update();

        this.subscriptions.forEach((subscription: ScrollTriggerSubscription) => {
            const inView: boolean = isElementInView(subscription.element);

            if (inView) {
                subscription.callback(this.scrollDistance);
            }

            if (inView !== subscription.inView) {
                subscription.inView = inView;
            }
        });
    }
}
