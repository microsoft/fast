import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
class _Button extends FoundationElement {}
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Button:class)} component.
 *
 * @internal
 */
export class FormAssociatedButton extends FormAssociated(_Button) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("input");
    }
}
