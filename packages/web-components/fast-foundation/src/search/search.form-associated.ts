import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _Search extends FoundationElement {}
interface _Search extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Search:class)} component.
 *
 * @internal
 */
export class FormAssociatedSearch extends FormAssociated(_Search) {
    proxy = document.createElement("input");
}
