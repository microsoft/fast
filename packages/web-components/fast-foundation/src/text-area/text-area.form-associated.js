import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
class _TextArea extends FoundationElement {}
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(TextArea:class)} component.
 *
 * @internal
 */
export class FormAssociatedTextArea extends FormAssociated(_TextArea) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("textarea");
    }
}
