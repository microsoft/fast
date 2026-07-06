import { FASTElement } from "@microsoft/fast-element";
import { CheckableFormAssociated } from "../form-associated/form-associated.js";

class _Radio extends FASTElement {}
interface _Radio extends CheckableFormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(FASTRadio:class)} component.
 *
 * @beta
 */
export class FormAssociatedRadio extends CheckableFormAssociated(_Radio) {
    proxy = document.createElement("input");
}
