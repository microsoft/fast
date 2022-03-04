import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";

/**
 * Focusgroup wrapping element
 */
export class Focusgroup extends FoundationElement {
    @attr wrap: "none" | "horizontal" | "vertical" | "both" | undefined = "none";
}
