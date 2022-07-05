import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _TextField extends FASTElement {}
interface _TextField extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(TextField:class)} component.
 *
 * @beta
 */
export class FormAssociatedTextField extends FormAssociated(_TextField) {
    proxy = document.createElement("input");
}
