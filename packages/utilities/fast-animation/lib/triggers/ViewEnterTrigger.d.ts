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
    protected update(): void;
}
