import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _NumberField extends FoundationElement {}
interface _NumberField extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(NumberField:class)} component.
 *
 * @internal
 */
export class FormAssociatedNumberField extends FormAssociated(_NumberField) {
    proxy = document.createElement("input");
}
