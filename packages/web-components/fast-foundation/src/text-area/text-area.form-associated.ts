import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _TextArea extends FASTElement {}
interface _TextArea extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(FASTTextArea:class)} component.
 *
 * @beta
 */
export class FormAssociatedTextArea extends FormAssociated(_TextArea) {
    proxy = document.createElement("textarea");
}
