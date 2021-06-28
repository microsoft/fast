import { FormAssociated, FoundationElement } from "@microsoft/fast-foundation";

class _ColorPicker extends FoundationElement {}
interface _ColorPicker extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-tooling#(ColorPicker:class)} component.
 *
 * @internal
 */
export class FormAssociatedColorPicker extends FormAssociated(_ColorPicker) {
    proxy = document.createElement("input");
}
