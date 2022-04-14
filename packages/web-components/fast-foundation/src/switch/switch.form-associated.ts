import { CheckableFormAssociated } from "../form-associated/form-associated.js";
import { FoundationElement } from "../foundation-element/foundation-element.js";

class _Switch extends FoundationElement {}
interface _Switch extends CheckableFormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Switch:class)} component.
 *
 * @internal
 */
export class FormAssociatedSwitch extends CheckableFormAssociated(_Switch) {
    proxy = document.createElement("input");
}
