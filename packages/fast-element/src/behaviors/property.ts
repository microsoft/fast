import { BindingDirective } from "../directives/bind";
import { BindingBase } from "./binding-base";

export class PropertyBinding extends BindingBase {
    private isElementTarget: boolean;

    constructor(directive: BindingDirective, private target: any) {
        super(directive);
        this.isElementTarget = target instanceof HTMLElement;
    }

    shouldQueueUpdate() {
        return this.isElementTarget;
    }

    updateTarget(value: unknown) {
        this.target[this.directive.targetName!] = value;
    }
}
