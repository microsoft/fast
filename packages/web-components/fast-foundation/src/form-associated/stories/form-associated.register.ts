import { FASTElement, html } from "@microsoft/fast-element";
import { CheckableFormAssociated, FormAssociated } from "../form-associated.js";

const template = html`
    <slot></slot>
`;

export class FormAssociatedElement extends FormAssociated(
    class extends FASTElement {
        proxy = document.createElement("input");
    }
) {
    constructor() {
        super();
        this.proxy.setAttribute("type", "text");
    }
}

export interface FormAssociatedElement extends FormAssociated {}

FormAssociatedElement.define({
    name: "test-element",
    template,
});

class CustomInitialValueElement extends FormAssociatedElement {
    public initialValue: string = "foobar";

    constructor() {
        super();
        this.proxy.setAttribute("type", "text");
    }
}

CustomInitialValueElement.define({
    name: "custom-initial-value",
    template,
});

export class CheckableFormAssociatedElement extends CheckableFormAssociated(
    class extends FASTElement {
        proxy = document.createElement("input");
    }
) {
    constructor() {
        super();
        this.proxy.setAttribute("type", "checkbox");
    }
}

export interface CheckableFormAssociatedElement extends CheckableFormAssociated {}

CheckableFormAssociatedElement.define({
    name: "checkable-form-associated",
    template,
});
