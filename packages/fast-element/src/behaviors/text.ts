import { DOM } from "../dom";
import { BindingDirective } from "../directives/bind";
import { BindingBase } from "./binding-base";

export class TextBinding extends BindingBase {
    private target: Text;

    constructor(directive: BindingDirective, marker: HTMLElement) {
        super(directive);
        this.target = DOM.convertMarkerToLocation(marker) as Text;
    }

    updateTarget(value: unknown) {
        this.target.textContent = value as string;
    }
}
