import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated";

class _Switch extends FASTElement {}
interface _Switch extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Switch:class)} component.
 *
 * @internal
 */
export class FormAssociatedSwitch extends FormAssociated(_Switch) {
    proxy = document.createElement("input");
}
