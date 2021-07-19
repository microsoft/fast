import { FormAssociated, FoundationElement } from "@microsoft/fast-foundation";

/**
 * A form-associated base class for the flexbox component.
 *
 * @internal
 */
export class FormAssociatedCSSLayout extends FormAssociated(
    class extends FoundationElement {
        public proxy: HTMLInputElement = document.createElement("input");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedCSSLayout extends FormAssociated {}
