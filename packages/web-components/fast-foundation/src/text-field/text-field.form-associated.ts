/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Controller, PartialFASTElementDefinition } from "@microsoft/fast-element";
import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * A form-associated base class for the {@link (TextField:class)} component.
 *
 * @internal
 */
export class FormAssociatedTextField extends FormAssociated(
    class extends FASTElement {
        public proxy: HTMLInputElement = document.createElement("input");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedTextField extends FormAssociated {}
