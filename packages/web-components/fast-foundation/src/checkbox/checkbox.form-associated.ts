import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * A form-associated base class for the {@link (Checkbox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCheckbox extends FormAssociated(
    class extends FASTElement {
        public proxy: HTMLInputElement = document.createElement("input");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedCheckbox extends FormAssociated {}
