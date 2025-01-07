import { FormAssociated } from "../form-associated/form-associated.js";
import { FoundationElement } from "../foundation-element/foundation-element.js";

class _TextArea extends FoundationElement {}
interface _TextArea extends FormAssociated {}

/**
 * A form-associated base class for the {@link @ni/fast-foundation#(TextArea:class)} component.
 *
 * @internal
 */
export class FormAssociatedTextArea extends FormAssociated(_TextArea) {
    proxy = document.createElement("textarea");
}
