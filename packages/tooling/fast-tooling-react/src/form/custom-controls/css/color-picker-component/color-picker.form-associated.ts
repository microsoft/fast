import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "@microsoft/fast-foundation";

/**
 * A form-associated base class for the color picker component.
 *
 * @internal
 */
export class FormAssociatedColorPicker extends FormAssociated(
    class extends FASTElement {
        public proxy: HTMLInputElement = document.createElement("input");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedColorPicker extends FormAssociated {}
