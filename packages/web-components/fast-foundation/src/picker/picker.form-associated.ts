import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _Picker extends FoundationElement {}
interface _Picker extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Picker:class)} component.
 *
 * @internal
 */
export class FormAssociatedPicker extends FormAssociated(_Picker) {
    proxy = document.createElement("input");
}
