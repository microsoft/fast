import { BindingDirective } from "../directives/bind";
import { BindingBase } from "./binding-base";

export class AttributeBinding extends BindingBase {
    constructor(directive: BindingDirective, private target: HTMLElement) {
        super(directive);
    }

    updateTarget(value: unknown) {
        this.target.setAttribute(this.directive.targetName!, value as string);
    }
}
