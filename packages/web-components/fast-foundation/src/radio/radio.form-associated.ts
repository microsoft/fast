// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Controller, PartialFASTElementDefinition } from "@microsoft/fast-element";
import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * A form-associated base class for the {@link (Radio:class)} component.
 *
 * @internal
 */
export class FormAssociatedRadio extends FormAssociated(
    class extends FASTElement {
        public proxy: HTMLInputElement = document.createElement("input");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedRadio extends FormAssociated {}
