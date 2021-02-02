/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
    Controller,
    FASTElement,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import type { ListboxOption } from "../listbox-option/listbox-option";
import { Listbox } from "../listbox/listbox";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * A form-associated base class for the {@link (Select:class)} component.
 *
 * @internal
 */
export class FormAssociatedSelect extends FormAssociated(
    class extends Listbox {
        public proxy: HTMLSelectElement = document.createElement("select");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedSelect extends FormAssociated {}
