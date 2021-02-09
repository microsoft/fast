import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * A form-associated base class for the {@link (Button:class)} component.
 *
 * @internal
 */
export class FormAssociatedButton extends FormAssociated(
    class extends FASTElement {
        public proxy: HTMLInputElement = document.createElement("input");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedButton extends FormAssociated {}
