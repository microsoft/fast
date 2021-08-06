import { FormAssociated, FoundationElement } from "@microsoft/fast-foundation";

class _File extends FoundationElement {}
interface _File extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-tooling#(File:class)} component.
 *
 * @internal
 */
export class FormAssociatedFile extends FormAssociated(_File) {
    proxy = (() => {
        const proxy = document.createElement("input");
        proxy.setAttribute("type", "file");
        return proxy;
    })();
}
