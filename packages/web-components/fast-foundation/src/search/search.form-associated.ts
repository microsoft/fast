import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _Search extends FASTElement {}
interface _Search extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(FASTSearch:class)} component.
 *
 * @beta
 */
export class FormAssociatedSearch extends FormAssociated(_Search) {
    proxy = document.createElement("input");
}
