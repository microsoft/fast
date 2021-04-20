import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _Radio extends FoundationElement {}
interface _Radio extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Radio:class)} component.
 *
 * @internal
 */
export class FormAssociatedRadio extends FormAssociated(_Radio) {
    proxy = document.createElement("input");
}
