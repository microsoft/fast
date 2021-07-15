import isElementInView from "../utilities/isElementInView";
import ScrollBase from "./ScrollBase";
/**
 * Utility for registering element/callback pairs where the callback will be called when the element enters the view-port
 *
 * @public
 */
export default class ViewEnterTrigger extends ScrollBase {
    /**
     * Check if elements are in view-port and apply scroll method if they are
     */
    update() {
        super.update();
        this.subscriptions.forEach(
            /* eslint-disable-next-line */
            (subscription, index) => {
                const inView = isElementInView(subscription.element);
                // If the element is in view but previously wasn't
                if (inView && !subscription.inView) {
                    subscription.callback(this.scrollDistance);
                }
                if (inView !== subscription.inView) {
                    subscription.inView = inView;
                }
            }
        );
    }
}
