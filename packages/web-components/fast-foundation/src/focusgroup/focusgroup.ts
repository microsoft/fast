import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";

/**
 * Focusgroup wrapping element
 * @alpha
 */
export class Focusgroup extends FoundationElement {
    /**
     * Wrapping behavior
     * @public
     */
    @attr wrap: "both" | "horizontal" | "none" | "vertical" | undefined = "none";

    /**
     * Directions allowed to move
     * @public
     */
    @attr direction: "both" | "horizontal" | "vertical" = "both";

    /**
     * Should extend beyond direct children nodes
     * @public
     */
    @attr extend: boolean = true;
}
