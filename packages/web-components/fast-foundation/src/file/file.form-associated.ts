import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _File extends FoundationElement {}
interface _File extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(File:class)} component.
 * @internal
 */
export class FormAssociatedFile extends FormAssociated(_File) {
    proxy: HTMLInputElement = (() => {
        const proxy = document.createElement("input");
        proxy.setAttribute("type", "file");
        return proxy;
    })();
}
