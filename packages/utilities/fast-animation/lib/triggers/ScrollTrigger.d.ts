import ScrollBase from "./ScrollBase";
/**
 * Utility for registering element/callback pairs where the callback will be called on scroll while the element is in view.
 *
 * @public
 */
export default class ScrollTrigger extends ScrollBase {
    /**
     * Check if elements are in view-port and apply scroll method if they are
     */
    protected update(): void;
}
