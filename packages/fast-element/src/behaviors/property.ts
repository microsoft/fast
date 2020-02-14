import { BindingDirective } from "../directives/bind";
import { BindingBase } from "./binding-base";

export class PropertyBinding extends BindingBase {
    constructor(directive: BindingDirective, private target: any) {
        super(directive);
    }

    updateTarget(value: unknown) {
        this.target[this.directive.targetName!] = value;
    }
}
