import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _Picker extends FASTElement {}
interface _Picker extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(FASTPicker:class)} component.
 *
 * @beta
 */
export class FormAssociatedPicker extends FormAssociated(_Picker) {
    proxy = document.createElement("input");
}
