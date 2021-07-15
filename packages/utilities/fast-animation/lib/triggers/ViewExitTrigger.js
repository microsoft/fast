import isElementInView from "../utilities/isElementInView";
import ScrollBase from "./ScrollBase";
/**
 * Utility for registering element/callback pairs where the callback will be invoked when the element exits the view-port
 *
 * @public
 */
export default class ViewExitTrigger extends ScrollBase {
    /**
     * Check if elements are in view-port and apply scroll method if they are
     */
    update() {
        super.update();
        this.subscriptions.forEach(
            /* eslint-disable-next-line */
            (subscription, index) => {
                const inView = isElementInView(subscription.element);
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
