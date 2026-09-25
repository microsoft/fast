import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _Button extends FASTElement {}
interface _Button extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(FASTButton:class)} component.
 *
 * @beta
 */
export class FormAssociatedButton extends FormAssociated(_Button) {
    proxy = document.createElement("input");
}
