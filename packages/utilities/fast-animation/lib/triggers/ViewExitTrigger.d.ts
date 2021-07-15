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
    protected update(): void;
}
