import { CheckableFormAssociated } from "../form-associated/form-associated.js";
import { FoundationElement } from "../foundation-element/foundation-element.js";

class _Radio extends FoundationElement {}
interface _Radio extends CheckableFormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Radio:class)} component.
 *
 * @internal
 */
export class FormAssociatedRadio extends CheckableFormAssociated(_Radio) {
    proxy = document.createElement("input");
}
