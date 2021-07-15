import { FormAssociated, FoundationElement } from "@microsoft/fast-foundation";
/**
 * A form-associated base class for the flexbox component.
 *
 * @internal
 */
export class FormAssociatedCSSLayout extends FormAssociated(
    class extends FoundationElement {
        constructor() {
            super(...arguments);
            this.proxy = document.createElement("input");
        }
    }
) {}
