import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
class _Switch extends FoundationElement {}
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Switch:class)} component.
 *
 * @internal
 */
export class FormAssociatedSwitch extends FormAssociated(_Switch) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("input");
    }
}
