import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * A form-associated base class for the {@link (TextArea:class)} component.
 *
 * @internal
 */
export class FormAssociatedTextArea extends FormAssociated(
    class extends FASTElement {
        public proxy: HTMLTextAreaElement = document.createElement("textarea");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedTextArea extends FormAssociated {}
